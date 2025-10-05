import client from './client';

export const getPantry = async () => {
    return await client.get('/pantry');
}

export const getPantryItem = async (id: number) => {
    return await client.get(`/pantry/${id}`);
}