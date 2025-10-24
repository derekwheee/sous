import { FUZZY_SEARCH_THRESHOLD } from '@/util/constants';
import Fuse from 'fuse.js';

export function getAvailableIngredients(recipe: Recipe, pantryItems?: PantryItem[]) {
    const fuse = new Fuse(pantryItems || [], {
        keys: ['name'],
        threshold: FUZZY_SEARCH_THRESHOLD,
    });

    const availableIngredients: PantryItem[] = [];

    recipe.ingredients.forEach((ingredient) => {
        const matched = fuse.search(`${ingredient.item || ''}`);
        const pantryItem = matched[0]?.item;
        if (pantryItem && pantryItem.isInStock) {
            availableIngredients.push(pantryItem);
        }
    });

    return availableIngredients;
}

const normalize = (s?: string) => s?.toLowerCase().replace(/[^a-z\s]/g, '').trim() ?? '';
const singularize = (w: string) => w.replace(/(ies|ses|es|s)$/, (m) => (m === 'ies' ? 'y' : ''));
const stopWords = new Set([
    'a','an','the','in','on','and','or','of','to','with','for','by','at','from',
    'is','are','be','as','that','this','these','those','it','its','was','were',
    'but','if','then','so','into','about','over','under','near','per'
]);

const tokenize = (s?: string) => normalize(s).split(/\s+/).filter(t => t && !stopWords.has(t));

export function findIngredientMatches(recipe?: Recipe | null, instructionIndex = 0): string[] {
    if (!recipe) return [];

    const ingredientTokens = recipe.ingredients?.flatMap(i => tokenize(i.item)) ?? [];
    const ingredientSet = new Set(ingredientTokens.map(t => singularize(t)));

    const instructionWords = recipe.instructions?.[instructionIndex]
        ?.replace(/[^A-z ]/g, '')
        .split(/\s+/)
        .map(normalize)
        .filter(w => w && !stopWords.has(w)) ?? [];

    const matches = instructionWords.filter((word) => {
        const w = word;
        if (!w) return false;
        const s = singularize(w);

        if (ingredientSet.has(w) || ingredientSet.has(s)) return true;

        for (const token of ingredientSet) {
            if (token.includes(w) || w.includes(token)) return true;
        }

        return false;
    });

    return Array.from(new Set(matches));
}