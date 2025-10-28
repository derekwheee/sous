import { useApi } from '@/hooks/use-api';
import { getDefault } from '@/util/pantry';
import { pantryItemMutation } from '@/util/query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Alert } from 'react-native';

export const usePantry = ({ pantryItemId }: { pantryItemId?: number } = {}) => {
    const queryClient = useQueryClient();
    const { user, getPantries, getPantryItem, upsertPantryItem } = useApi();

    const pantries = useQuery<Pantry[]>({
        queryKey: ['pantry'],
        queryFn: () => getPantries(),
        enabled: !!user,
    });

    const pantry: Pantry | undefined = getDefault(pantries.data || []);

    const pantryItem = useQuery<PantryItem>({
        queryKey: ['pantryItem', pantryItemId],
        queryFn: () => getPantryItem(Number(pantryItemId), pantry?.id!),
        enabled: !!user && !!pantryItemId && !!pantry?.id,
    });

    const { mutate: savePantryItem, isPending: isPantryItemSaving } = useMutation(
        pantryItemMutation<any, UpsertPantryItem>(
            pantry?.id,
            (patch: UpsertPantryItem) => upsertPantryItem(pantry?.id!, patch),
            queryClient,
            ['pantry']
        )
    );

    const finishPantryItem = useCallback((pantryItem: PantryItem, cb?: Function) => {
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
    }, []);

    const deletePantryItem = useCallback((id: number, cb: Function) => {
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
    }, []);

    return {
        pantries: {
            ...pantries,
            isBusy: pantries.isFetching || pantries.isLoading || pantries.isPending,
        },
        pantry,
        pantryItem: {
            ...pantryItem,
            isBusy: pantryItem.isFetching || pantryItem.isLoading || pantryItem.isPending,
        },
        savePantryItem,
        finishPantryItem,
        deletePantryItem,
        isPantryItemSaving,
    };
};
