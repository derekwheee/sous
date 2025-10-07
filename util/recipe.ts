import { PantryItem, Recipe } from '@/types/interfaces';

export function getAvailableIngredients(recipe: Recipe, pantry: PantryItem[]) {
    return recipe.ingredients.filter((ingredient) => {
        return pantry.some((item) => item.name === ingredient.item);
    });
}