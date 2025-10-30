import { useApi } from '@/hooks/use-api';
import { getDefault } from '@/util/pantry';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Alert } from 'react-native';

export const usePantry = ({ pantryItemId }: { pantryItemId?: number } = {}) => {
    const queryClient = useQueryClient();
    const { user, getPantries, getPantryItem, upsertPantryItem } = useApi();

    const pantriesQuery = useQuery<Pantry[]>({
        queryKey: ['pantries'],
        queryFn: () => getPantries(),
        enabled: !!user,
    });

    const pantry: Pantry | undefined = getDefault(pantriesQuery.data || []);

    const pantryItemQuery = useQuery<PantryItem>({
        queryKey: ['pantryItem', pantryItemId, pantry?.id],
        queryFn: () => getPantryItem(Number(pantryItemId), pantry?.id!),
        enabled: !!user && !!pantryItemId && !!pantry?.id,
    });

    const { mutate: savePantryItem, isPending: isPantryItemSaving } = useMutation({
        mutationFn: (patch: UpsertPantryItem) => upsertPantryItem(pantry?.id!, patch),
        onMutate: async (patch: UpsertPantryItem) => {
            await queryClient.cancelQueries({ queryKey: ['pantries'] });
            await queryClient.cancelQueries({ queryKey: ['pantryItem', patch.id, pantry?.id] });

            const prevPantries = queryClient.getQueryData<Pantry[]>(['pantries']);
            const prevItem = queryClient.getQueryData<PantryItem>([
                'pantryItem',
                patch.id,
                pantry?.id,
            ]);

            const newItem: PantryItem | null = !!patch.id
                ? null
                : { ...(patch as PantryItem), id: Date.now() };

            if (prevPantries) {
                queryClient.setQueryData<Pantry[]>(['pantries'], (old) =>
                    old
                        ? old.map((pantry) => ({
                              ...pantry,
                              pantryItems: [
                                  ...pantry.pantryItems.map((item) =>
                                      item.id === patch.id ? { ...item, ...patch } : item
                                  ),
                                  ...(newItem ? [newItem] : []),
                              ],
                          }))
                        : old
                );
            }

            if (prevItem) {
                queryClient.setQueryData<PantryItem>(['pantryItem', patch.id, pantry?.id], {
                    ...prevItem,
                    ...patch,
                });
            }

            return { prevPantries, prevItem };
        },
        onError: (_, updatedItem, context) => {
            if (context?.prevPantries) {
                queryClient.setQueryData(['pantries'], context.prevPantries);
            }
            if (context?.prevItem) {
                queryClient.setQueryData(['pantryItem', updatedItem.id], context.prevItem);
            }
        },
        onSettled: (_, __, updatedItem) => {
            queryClient.invalidateQueries({ queryKey: ['pantry', pantry?.id] });
            queryClient.invalidateQueries({ queryKey: ['pantryItem', updatedItem.id] });
        },
    });

    const finishPantryItem = useCallback(
        (pantryItem: PantryItem, cb?: Function) => {
            Alert.alert('Finish item', 'Are you all out of this item?', [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        await savePantryItem({
                            id: pantryItem.id,
                            isInShoppingList: pantryItem.isFavorite,
                            isInStock: false,
                        });
                    },
                    style: 'default',
                    isPreferred: true,
                },
            ]);

            cb?.();
        },
        [savePantryItem]
    );

    const deletePantryItem = useCallback(
        (id: number, cb?: Function) => {
            Alert.alert('Remove item', 'Do you want to remove this item from your list?', [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        await savePantryItem({
                            id,
                            isInShoppingList: false,
                            isInStock: false,
                            deletedAt: new Date(),
                        });
                    },
                    style: 'destructive',
                },
            ]);

            cb?.();
        },
        [savePantryItem]
    );

    return {
        pantriesQuery,
        pantriesIsBusy:
            pantriesQuery.isFetching || pantriesQuery.isLoading || pantriesQuery.isPending,
        pantries: pantriesQuery?.data,
        pantry,
        pantryItemQuery,
        pantryItemIsBusy:
            pantryItemQuery.isFetching || pantryItemQuery.isLoading || pantryItemQuery.isPending,
        pantryItem: pantryItemQuery?.data,
        savePantryItem,
        finishPantryItem,
        deletePantryItem,
        isPantryItemSaving,
    };
};
