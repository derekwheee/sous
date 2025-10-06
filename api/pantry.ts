import { PatchPantryItem } from '@/types/interfaces';
import client from './client';

export const getPantry = async () => {
    return await client.get('/pantry');
}

export const getPantryItem = async (id: number) => {
    return await client.get(`/pantry/${id}`);
}

export const updatePantryItem = async (patch: PatchPantryItem) => {
    return await client.post(`/pantry/${patch.id}`, patch);
};