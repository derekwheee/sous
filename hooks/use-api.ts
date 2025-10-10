import { useInvalidateQueries } from "@/hooks/use-invalidate-queries";
import { useAuth } from '@clerk/clerk-expo';

const API_HOST: string | undefined = process.env.EXPO_PUBLIC_API_HOST;

if (!API_HOST) {
    throw new Error('API_HOST is not defined');
}

type Keys = string[] | string[][];

export function useApi() {

    const { getToken } = useAuth();
    const invalidateQueries = useInvalidateQueries();

    const apiClient = createClient(invalidateQueries, getToken);

    return {
        // User
        syncUser: (
            keys: Keys = ['user']
        ) => apiClient.post(keys, '/user/sync'),
        // Recipes
        getRecipes: (
            keys: Keys = []
        ) => apiClient.get(keys, '/recipes'),
        getRecipe: (
            id: number,
            keys: Keys = []
        ) => apiClient.get(keys, `/recipes/${id}`),
        createRecipe: (
            recipe: object,
            keys: Keys = ['recipes']
        ) => apiClient.post(keys, '/recipes', recipe),
        importRecipe: (
            url: string,
            keys: Keys = []
        ) => apiClient.get(keys, '/recipes/scrape?url=' + encodeURIComponent(url)),
        // Pantry
        getPantries: (
            keys: Keys = []
        ) => apiClient.get(keys, '/pantry'),
        upsertPantryItem: (
            item: object,
            keys: Keys = ['pantry', 'list', 'itemCategories']
        ) => apiClient.post(keys, '/pantry', item),
        getPantryItems: (
            pantryId: number,
            keys: Keys = []
        ) => apiClient.get(keys, `/pantry/${pantryId}/items`),
        getPantryItem: (
            id: number,
            pantryId: number,
            keys: Keys = []
        ) => apiClient.get(keys, `/pantry/${pantryId}/items/${id}`),
        // ItemCategories
        getItemCategories: (
            pantryId: number,
            keys: Keys = []
        ) => apiClient.get(keys, `/pantry/${pantryId}/categories`),
    }
}

async function makeRequest(
    url: string,
    options: RequestInit = {},
    getToken: () => Promise<string | undefined>
) {
    const token = await getToken();
    let response;

    if (token) {
        options.headers = {
            ...(options.headers || {}),
            ['Authorization']: `Bearer ${token}`
        };
    }

    try {
        response = await fetch(`${API_HOST}${url}`, options);

        return await response.json();
    } catch (err) {
        if (response) {
            console.log(response);
        }
        console.error(err);
        return null;
    }
};

function requestAndInvalidate<T, Args extends any[]>(
    apiCall: (...args: Args) => Promise<T>,
    invalidateQueries: (keys: Keys) => void
): (keys: Keys, ...args: Args) => Promise<T> {
    return (keys, ...args: Args) =>
        apiCall(...args).then((result) => {
            if (keys) {
                invalidateQueries(keys);
            }
            return result;
        });
};

function createClient(invalidateQueries: (keys: Keys) => void, getToken: any) {
    return {
        get: requestAndInvalidate(
            (url: string) => makeRequest(url, { method: 'GET' }, getToken),
            invalidateQueries
        ),
        post: requestAndInvalidate(
            (url: string, body?: object) => makeRequest(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body ? JSON.stringify(body) : null
            }, getToken),
            invalidateQueries
        )
    };
};