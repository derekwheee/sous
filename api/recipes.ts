import { CreateRecipe } from '@/types/interfaces';
import client from './client';

export const getRecipes = async () => {
    return await client.get('/recipes');
}

export const getRecipe = async (id: number) => {
    return await client.get(`/recipes/${id}`);
}

export const createRecipe = async (recipe: CreateRecipe) => {
    return await client.post(`/recipes`, recipe);
};

export const importRecipe = async (url: string) => {
    return await client.get('/recipes/scrape?url=' + encodeURIComponent(url))
}