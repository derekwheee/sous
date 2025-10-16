import { Pantry, UpsertPantryItem } from '@/types/interfaces';
import { MutationFunction, QueryClient } from '@tanstack/react-query';

function optimisticUpdate(patch: any, previous: any | undefined | null, isDelete: boolean) {
    if (!previous) return previous;

    const itemIndex = previous.findIndex((i: any) => i.id === patch.id);

    if (itemIndex === -1) {
        const updated = [...previous];
        const newItem = {
            id: -1,
            ...patch
        };
        return [...updated, newItem];
    } else if (isDelete) {
        const updated = [...previous];
        updated.splice(itemIndex, 1);
        return updated;
    } else {
        const updated = [...previous];
        updated[itemIndex] = { ...updated[itemIndex], ...patch };
        return updated;
    }
}

async function optimisticOnMutate<T>(client: QueryClient, queryKey: string[], patch: T, isDelete: boolean) {
    await client.cancelQueries({ queryKey });
    const previous = client.getQueryData<T>(queryKey);

    client.setQueryData<T>(queryKey, (old) => optimisticUpdate(patch, old, isDelete));

    return { previous };
}

export function standardMutation<TData, TVariables>(
    mutationFn: MutationFunction<TData, TVariables>,
    queryClient: QueryClient,
    queryKey: string[],
    options: {
        invalidateKeys?: string[] | string[][],
        isDelete: boolean
    } = {
        isDelete: false
    }
) {
    return {
        mutationFn,
        onMutate: async (patch: TVariables) => optimisticOnMutate<TVariables>(queryClient, queryKey, patch, options.isDelete),
        onError: (_: any, __: any, context: { previous: TData | undefined } | undefined) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKey, context.previous);
            }
        },
        onSettled: () => {
            if (options.invalidateKeys) {
                for (const key of options.invalidateKeys) {
                    queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
                }
            } else {
                queryClient.invalidateQueries({ queryKey });
            }
        },
    }
}

export function pantryItemMutation<TData, TVariables>(
    pantryId: number | undefined | null,
    mutationFn: MutationFunction<TData, TVariables>,
    queryClient: QueryClient,
    queryKey: string[] = ['pantry'],
    invalidateKeys?: string[] | string[][]
) {
    return {
        enabled: !!pantryId,
        mutationFn,
        onMutate: async (patch: UpsertPantryItem) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<Pantry[]>(queryKey);

            queryClient.setQueryData<Pantry[]>(queryKey, (previous: Pantry[] | undefined) => {

                if (!previous) return previous;

                const previousPantry = previous.find(p => p.id === pantryId);

                if (!previousPantry) return previous;

                const itemIndex = previousPantry.pantryItems.findIndex((i: any) => i.id === patch.id);

                if (itemIndex === -1) {
                    const updated = [...previousPantry.pantryItems];
                    const newItem = {
                        id: -1,
                        ...patch,
                        name: patch.name || 'New Item',
                        isInStock: patch.isInStock ?? false,
                        isInShoppingList: patch.isInShoppingList ?? false,
                        isFavorite: patch.isFavorite ?? false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };
                    previousPantry.pantryItems = [...updated, newItem];
                } else {
                    const updated = [...previousPantry.pantryItems];
                    updated[itemIndex] = { ...updated[itemIndex], ...patch };
                    previousPantry.pantryItems = updated;
                }

                return previous.map(p => p.id === pantryId ? previousPantry : p);
            });

            return { previous };
        },
        onError: (_: any, __: any, context: { previous: TData | undefined } | undefined) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKey, context.previous);
            }
        },
        onSettled: () => {
            if (invalidateKeys) {
                for (const key of invalidateKeys) {
                    queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
                }
            } else {
                queryClient.invalidateQueries({ queryKey });
            }
        },
    }
}