import { useSnackbar } from '@/components/snackbar';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useEffect } from 'react';

const API_HOST: string | undefined =
    Constants.expoConfig?.extra?.apiHost || process.env.EXPO_PUBLIC_API_HOST;

if (!API_HOST) {
    throw new Error('API_HOST is not defined');
}

export function useApi() {
    const { getToken, userId, isSignedIn } = useAuth();
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbar();

    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => apiClient.get('/user'),
        enabled: !!userId,
    });

    const householdId = (user as User | null)?.defaultHouseholdId || 0;

    useEffect(() => {
        if (!isSignedIn) {
            queryClient.invalidateQueries();
        }
    }, [isSignedIn, queryClient]);

    const apiClient = createClient(getToken, showSnackbar);

    return {
        user,
        // User
        getUser: () => apiClient.get('/user'),
        updateUser: (userData: Partial<User>) => apiClient.post('/user', userData),
        syncUser: () => apiClient.post('/user/sync'),
        joinHousehold: ({ id, joinToken }: { id: string; joinToken: string }) =>
            apiClient.post(`/household/${id}/join`, { joinToken }),
        // Recipes
        getRecipes: (keywords?: string) => {
            let url = `/household/${householdId}/recipes`;
            if (keywords) {
                url += `?keywords=${encodeURIComponent(keywords)}`;
            }
            return apiClient.get(url);
        },
        getRecipe: (id: number) => apiClient.get(`/household/${householdId}/recipes/${id}`),
        createRecipe: (recipe: object) =>
            apiClient.post(`/household/${householdId}/recipes`, recipe),
        upsertRecipe: (recipe: Partial<Recipe>) =>
            apiClient.post(`/household/${householdId}/recipes`, recipe),
        deleteRecipe: (id: number) => apiClient.delete(`/household/${householdId}/recipes/${id}`),
        importRecipe: (url: string) =>
            apiClient.get(
                `/household/${householdId}/recipes/scrape?url=` + encodeURIComponent(url)
            ),
        getAllRecipeTags: () => apiClient.get(`/household/${householdId}/recipes/tags`),
        // Pantry
        getPantries: () => apiClient.get(`/household/${householdId}/pantry`),
        upsertPantryItem: (pantryId: number, item: Partial<PantryItem>) =>
            apiClient.post(`/household/${householdId}/pantry/${pantryId}`, item),
        getPantryItems: (pantryId: number) =>
            apiClient.get(`/household/${householdId}/pantry/${pantryId}/items`),
        getPantryItem: (id: number, pantryId: number) =>
            apiClient.get(`/household/${householdId}/pantry/${pantryId}/items/${id}`),
        // ItemCategories
        getCategories: (pantryId: number) =>
            apiClient.get(`/household/${householdId}/pantry/${pantryId}/category`),
        getCategory: (pantryId: number, categoryId: number) =>
            apiClient.get(`/household/${householdId}/pantry/${pantryId}/category/${categoryId}`),
        upsertCategory: (pantryId: number, category: Partial<ItemCategory>) =>
            apiClient.post(`/household/${householdId}/pantry/${pantryId}/category`, category),
        updateSortOrder: (pantryId: number, sortedIds: number[]) =>
            apiClient.post(
                `/household/${householdId}/pantry/${pantryId}/category/sort-order`,
                sortedIds
            ),
        // AI
        getRecipeSuggestions: (pantryId: number, tags: string[], keywords: string) =>
            apiClient.get(`/ai/suggestions/${pantryId}`, {
                query: {
                    tags,
                    keywords,
                },
            }),
        getExpiringPantryItems: (pantryId: number) =>
            apiClient.get(`/ai/expiring-items/${pantryId}`),
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

function createClient(getToken: any, showSnackbar: any) {
    return {
        get: (url: string, options: { query?: object } & RequestInit = {}) =>
            makeRequest(url, { method: 'GET', ...options }, getToken, showSnackbar),
        post: (url: string, body?: object) =>
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
        delete: (url: string) => makeRequest(url, { method: 'DELETE' }, getToken, showSnackbar),
    };
}
