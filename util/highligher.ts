import Fuse from 'fuse.js';
import { FUZZY_SEARCH_THRESHOLD } from '@/util/constants';

const STOPWORDS = new Set([
    'a',
    'an',
    'and',
    'or',
    'but',
    'the',
    'in',
    'on',
    'at',
    'to',
    'for',
    'with',
    'from',
    'of',
    'by',
    'as',
    'is',
    'was',
    'are',
    'be',
    'been',
    'into',
    'over',
    'until',
    'add',
    'heat',
    'cook',
    'stir',
    'mix',
    'chop',
    'dice',
    'slice',
    'pour',
    'place',
    'put',
    'set',
    'let',
    'low',
    'medium',
    'high',
    'large',
    'small',
    'more',
    'less',
    'cup',
    'cups',
    'tablespoon',
    'tablespoons',
    'teaspoon',
    'teaspoons',
    'tsp',
    'tbsp',
    'oz',
    'ounce',
    'ounces',
    'pound',
    'pounds',
    'gram',
    'grams',
    'liter',
    'liters',
    'ml',
    'lb',
    'lbs',
    'pinches',
    'pinch',
    'dash',
    'finish',
    'serve',
    'proof',
    'melt',
    'divide',
    'season',
    'needed',
    'spoon',
]);

export function highlightInstructions(
    ingredients: string[],
    instruction: string
): HighlightedSegment[] {
    function extractIngredientKeywordsWithRefs(ingredients: string[]): IngredientKeyword[] {
        const seen = new Set<string>();
        const list: IngredientKeyword[] = [];

        for (const fullIngredient of ingredients) {
            const tokens = fullIngredient
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, ' ') // strip punctuation, units, etc.
                .split(/\s+/)
                .filter((w) => w.length > 2 && !STOPWORDS.has(w));

            for (const token of tokens) {
                // skip duplicates globally (optional)
                const key = `${token}|${fullIngredient}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    list.push({ keyword: token, fullIngredient });
                }
            }
        }

        return list;
    }

    const keywordMap = extractIngredientKeywordsWithRefs(ingredients);

    const fuse = new Fuse(keywordMap, {
        keys: ['keyword'],
        includeScore: true,
        threshold: FUZZY_SEARCH_THRESHOLD ?? 0.4,
        minMatchCharLength: 2,
        ignoreLocation: true,
    });

    // Split instruction into tokens, keeping punctuation and spacing
    const tokens = instruction.match(/\b[\w'-]+\b|[^\w\s]+|\s+/g) || [];

    const result: HighlightedSegment[] = [];
    const MAX_PHRASE_LEN = 4;
    let i = 0;

    while (i < tokens.length) {
        const token = tokens[i];

        // Skip whitespace or punctuation-only tokens
        if (!token.trim() || /^[^\w'-]+$/.test(token)) {
            result.push({ text: token, isHighlighted: false });
            i++;
            continue;
        }

        let bestMatch;
        let bestMatchLength = 0;

        // Try multi-word phrases from longest to shortest
        for (let len = MAX_PHRASE_LEN; len > 0; len--) {
            const phraseTokens = tokens.slice(i, i + len).filter((t) => /^[\w'-]+$/.test(t));

            if (phraseTokens.length === 0) continue;

            const phrase = phraseTokens.join(' ').toLowerCase();

            // Skip single-word stopwords
            if (len === 1 && STOPWORDS.has(phrase)) continue;

            const matches = fuse.search(phrase);

            if (matches.length) {
                const top = matches[0];
                const { keyword, fullIngredient } = top.item;

                // Check that phrase ends or begins properly
                const boundaryRegex = new RegExp(`\\b${keyword}\\b`, 'i');
                if (!boundaryRegex.test(phrase)) continue;

                // Don’t allow matches that *start* or *end* with stopwords
                const phraseWords = phrase.split(/\s+/);
                const first = phraseWords[0];
                const last = phraseWords[phraseWords.length - 1];
                if (STOPWORDS.has(first) || STOPWORDS.has(last)) continue;

                bestMatch = { ...top, fullIngredient };
                bestMatchLength = len;
            }
        }

        if (bestMatch) {
            const matchedText = tokens.slice(i, i + bestMatchLength).join('');
            result.push({
                text: matchedText,
                isHighlighted: true,
                match: bestMatch,
            });
            i += bestMatchLength;
        } else {
            result.push({ text: token, isHighlighted: false });
            i++;
        }
    }

    // Merge adjacent segments of the same highlight state
    const grouped = result.reduce<HighlightedSegment[]>((acc, seg) => {
        const last = acc[acc.length - 1];
        if (last && last.isHighlighted === seg.isHighlighted) {
            last.text += seg.text;
        } else {
            acc.push({ ...seg });
        }
        return acc;
    }, []);

    return grouped;
}
