import { useInvalidateQueries } from "@/hooks/use-invalidate-queries";

const API_HOST: string | undefined = process.env.EXPO_PUBLIC_API_HOST;

if (!API_HOST) {
    throw new Error('API_HOST is not defined');
}

export function useApi() {

    const invalidateQueries = useInvalidateQueries();
    const apiClient = createClient(invalidateQueries);

    return {
        // Recipes
        getRecipes: () => apiClient.get([], '/recipes'),
        getRecipe: (id: number) => apiClient.get([], `/recipes/${id}`),
        createRecipe: (recipe: object) => apiClient.post(['recipes'], '/recipes', recipe),
        importRecipe: (url: string) => apiClient.get([], '/recipes/scrape?url=' + encodeURIComponent(url)),
        // Pantry
        getPantry: () => apiClient.get([], '/pantry'),
        getPantryItem: (id: number) => apiClient.get([], `/pantry/${id}`),
        upsertPantryItem: (item: object) => apiClient.post(['pantry', 'list'], '/pantry', item),
        // ItemCategories
        getItemCategories: () => apiClient.get([], '/item-categories'),
    }
}

async function makeRequest(url: string, options: RequestInit = {}) {
    let response;

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
    invalidateQueries: (keys: string[] | string[][]) => void
): (keys: string[] | string[][], ...args: Args) => Promise<T> {
    return (keys, ...args: Args) =>
        apiCall(...args).then((result) => {
            if (keys) {
                invalidateQueries(keys);
            }
            return result;
        });
};

function createClient(invalidateQueries: (keys: string[] | string[][]) => void) {

    return {
        get: requestAndInvalidate(
            (url: string) => makeRequest(url, { method: 'GET' }),
            invalidateQueries,
        ),
        post: requestAndInvalidate(
            (url: string, body: object) => makeRequest(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }),
            invalidateQueries
        )
    };
};