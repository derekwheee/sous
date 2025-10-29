import { useApi } from '@/hooks/use-api';
import { getDefault } from '@/util/pantry';
import { pantryItemMutation } from '@/util/query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Alert } from 'react-native';

export const usePantry = ({ pantryItemId }: { pantryItemId?: number } = {}) => {
    const queryClient = useQueryClient();
    const { user, getPantries, getPantryItem, upsertPantryItem } = useApi();

    const pantriesQuery = useQuery<Pantry[]>({
        queryKey: ['pantry'],
        queryFn: () => getPantries(),
        enabled: !!user,
    });

    const pantry: Pantry | undefined = getDefault(pantriesQuery.data || []);

    const pantryItemQuery = useQuery<PantryItem>({
        queryKey: ['pantryItem', pantryItemId, pantry?.id],
        queryFn: () => getPantryItem(Number(pantryItemId), pantry?.id!),
        enabled: !!user && !!pantryItemId && !!pantry?.id,
    });

    // TODO: This mutation doesn't seem to be working with optimistic updates
    const { mutate: savePantryItem, isPending: isPantryItemSaving } = useMutation(
        pantryItemMutation<any, UpsertPantryItem>(
            pantry?.id,
            (patch: UpsertPantryItem) => upsertPantryItem(pantry?.id!, patch),
            queryClient,
            ['pantry']
        )
    );

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
        (id: number, cb: Function) => {
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
