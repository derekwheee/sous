import { FUZZY_SEARCH_THRESHOLD } from '@/util/constants';
import Fuse from 'fuse.js';

interface HighlightedSegment {
    text: string;
    isHighlighted: boolean;
    match?: any;
}

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
]);

export function highlightInstructions(
    ingredients: string[],
    instruction: string
): HighlightedSegment[] {
    // Configure Fuse.js for fuzzy matching
    const fuse = new Fuse(ingredients, {
        threshold: FUZZY_SEARCH_THRESHOLD,
        minMatchCharLength: 3,
    });

    // Split instruction into words, preserving punctuation
    const words = instruction.split(/(\s+|[.,;!?()])/);
    const result = [];
    let i = 0;

    while (i < words.length) {
        const word = words[i];

        // Skip whitespace and punctuation
        if (!word.trim() || /^[.,;!?()]+$/.test(word)) {
            result.push({ text: word, isHighlighted: false });
            i++;
            continue;
        }

        // Try matching progressively longer phrases (up to 4 words)
        let matchFound = false;
        let bestMatch = null;
        let bestMatchLength = 0;

        for (let len = Math.min(4, words.length - i); len > 0; len--) {
            // Build phrase from consecutive words
            const phraseWords = [];
            for (let j = 0; j < len * 2 - 1; j++) {
                if (i + j < words.length) {
                    phraseWords.push(words[i + j]);
                }
            }
            const phrase = phraseWords.join('').trim();

            if (!phrase) continue;

            if (phrase.split(/\s+/).some((w) => STOPWORDS.has(w.toLowerCase()))) {
                continue;
            }

            // Search for matches
            const matches: any = fuse.search(phrase);

            if (matches?.length) {
                bestMatch = matches[0];
                bestMatchLength = len * 2 - 1;
                matchFound = true;
                break;
            }
        }

        if (matchFound) {
            // Combine matched words into single highlighted segment
            const matchedText = words.slice(i, i + bestMatchLength).join('');
            result.push({ text: matchedText, isHighlighted: true, match: bestMatch });
            i += bestMatchLength;
        } else {
            result.push({ text: word, isHighlighted: false });
            i++;
        }
    }

    return result;
}
