import { UpsertItemCategory } from '@/types/interfaces';
import client from './client';

export const getItemCategories = async () => {
    return await client.get('/item-categories');
}

export const upsertItemCategory = async (itemCategory: UpsertItemCategory) => {
    return await client.post('/item-categories', itemCategory);
};