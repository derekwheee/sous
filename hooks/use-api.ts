import { useSnackbar } from '@/components/snackbar';
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useEffect } from 'react';

const API_HOST: string | undefined =
    Constants.expoConfig?.extra?.apiHost || process.env.EXPO_PUBLIC_API_HOST;

if (!API_HOST) {
    throw new Error('API_HOST is not defined');
}

type Keys = string[] | string[][];

export function useApi() {
    const { getToken, userId, isSignedIn } = useAuth();
    const invalidateQueries = useInvalidateQueries();
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbar();

    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => apiClient.get([], '/user'),
        enabled: !!userId,
    });

    const householdId = (user as User | null)?.defaultHouseholdId || 0;

    useEffect(() => {
        if (!isSignedIn) {
            queryClient.invalidateQueries();
        }
    }, [isSignedIn, invalidateQueries]);

    const apiClient = createClient(invalidateQueries, getToken, showSnackbar);

    return {
        user,
        // User
        getUser: (keys: Keys = []) => apiClient.get(keys, '/user'),
        syncUser: (keys: Keys = ['user']) => apiClient.post(keys, '/user/sync'),
        joinHousehold: (
            { id, joinToken }: { id: string; joinToken: string },
            keys: Keys = ['user']
        ) => apiClient.post(keys, `/household/${id}/join`, { joinToken }),
        // Recipes
        getRecipes: (keys: Keys = [], keywords?: string) => {
            let url = `/household/${householdId}/recipes`;
            if (keywords) {
                url += `?keywords=${encodeURIComponent(keywords)}`;
            }
            return apiClient.get(keys, url);
        },
        getRecipe: (id: number, keys: Keys = []) =>
            apiClient.get(keys, `/household/${householdId}/recipes/${id}`),
        createRecipe: (recipe: object, keys: Keys = ['recipes']) =>
            apiClient.post(keys, `/household/${householdId}/recipes`, recipe),
        upsertRecipe: (recipe: UpsertRecipe, keys: Keys = ['recipes']) =>
            apiClient.post(keys, `/household/${householdId}/recipes`, recipe),
        deleteRecipe: (id: number, keys: Keys = ['recipes']) =>
            apiClient.delete(keys, `/household/${householdId}/recipes/${id}`),
        importRecipe: (url: string, keys: Keys = []) =>
            apiClient.get(
                keys,
                `/household/${householdId}/recipes/scrape?url=` + encodeURIComponent(url)
            ),
        getAllRecipeTags: (keys: Keys = []) =>
            apiClient.get(keys, `/household/${householdId}/recipes/tags`),
        // Pantry
        getPantries: (keys: Keys = []) => apiClient.get(keys, `/household/${householdId}/pantry`),
        upsertPantryItem: (
            pantryId: number,
            item: object,
            keys: Keys = ['pantry', 'list', 'itemCategories']
        ) => apiClient.post(keys, `/household/${householdId}/pantry/${pantryId}`, item),
        getPantryItems: (pantryId: number, keys: Keys = []) =>
            apiClient.get(keys, `/household/${householdId}/pantry/${pantryId}/items`),
        getPantryItem: (id: number, pantryId: number, keys: Keys = []) =>
            apiClient.get(keys, `/household/${householdId}/pantry/${pantryId}/items/${id}`),
        // ItemCategories
        getItemCategories: (pantryId: number, keys: Keys = []) =>
            apiClient.get(keys, `/household/${householdId}/pantry/${pantryId}/categories`),
        getRecipeSuggestions: (
            pantryId: number,
            tags: string[],
            keywords: string,
            keys: Keys = []
        ) =>
            apiClient.get(keys, `/ai/suggestions/${pantryId}`, {
                query: {
                    tags,
                    keywords,
                },
            }),
    };
}

async function makeRequest(
    url: string,
    options: { query?: object } & RequestInit = {},
    getToken: (options?: any) => Promise<string | undefined>,
    showSnackbar: any
) {
    const token = await getToken();

    // Uncomment this line to get a Postman token
    // console.log(await getToken({ template: 'postman' }));

    if (token) {
        options.headers = {
            ...(options.headers || {}),
            ['Authorization']: `Bearer ${token}`,
        };
    }

    const { query, ...init } = options;

    const queryString = query
        ? Object.entries(query)
              .map(
                  ([key, value]) =>
                      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
              )
              .join('&')
        : '';
    url += queryString ? `?${queryString}` : '';

    const response = await fetch(`${API_HOST}${url}`, init);

    if (response.status === 401) {
        showSnackbar({
            message: `unauthorized`,
            type: 'error',
        });
        return null;
    }

    const isJson = response.headers.get('Content-Type')?.includes('application/json');

    try {
        const body = isJson ? await response.json() : await response.text();

        if (isJson && body?.error) {
            throw new Error(body.error);
        }

        return body;
    } catch (err) {
        showSnackbar({
            message: `something went wrong`,
            type: 'error',
        });

        if (response) {
            console.log(response);
        }
        console.error(err);
        return null;
    }
}

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
}

function createClient(invalidateQueries: (keys: Keys) => void, getToken: any, showSnackbar: any) {
    return {
        get: requestAndInvalidate(
            (url: string, options: { query?: object } & RequestInit = {}) =>
                makeRequest(url, { method: 'GET', ...options }, getToken, showSnackbar),
            invalidateQueries
        ),
        post: requestAndInvalidate(
            (url: string, body?: object) =>
                makeRequest(
                    url,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: body ? JSON.stringify(body) : null,
                    },
                    getToken,
                    showSnackbar
                ),
            invalidateQueries
        ),
        delete: requestAndInvalidate(
            (url: string) => makeRequest(url, { method: 'DELETE' }, getToken, showSnackbar),
            invalidateQueries
        ),
    };
}
