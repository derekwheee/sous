import { useApi } from '@/hooks/use-api';
import { getDefault } from '@/util/pantry';
import { standardMutation } from '@/util/query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Alert } from 'react-native';

export const useCategory = ({ categoryId }: { categoryId?: number } = {}) => {
    const queryClient = useQueryClient();
    const { user, getPantries, getCategories, getCategory, upsertCategory, updateSortOrder } =
        useApi();

    const categoryQueryKey = ['categories'];

    const pantries = useQuery<Pantry[]>({
        queryKey: ['pantry'],
        queryFn: () => getPantries(),
        enabled: !!user,
    });

    const pantry: Pantry | undefined = getDefault(pantries.data || []);

    const categories = useQuery<ItemCategory[]>({
        queryKey: [...categoryQueryKey, pantry?.id],
        queryFn: () => getCategories(pantry?.id!),
        enabled: !!user && !!pantry?.id,
    });

    const category = useQuery<ItemCategory>({
        queryKey: ['categories', categoryId, pantry?.id],
        queryFn: () => getCategory(pantry?.id!, Number(categoryId)),
        enabled: !!user && !!categoryId && !!pantry?.id,
    });

    const { mutate: saveCategory, isPending: isCategorySaving } = useMutation(
        standardMutation<any, UpsertItemCategory, UpsertItemCategory>(
            (patch: UpsertItemCategory) => upsertCategory(pantry?.id!, patch),
            queryClient,
            categoryQueryKey
        )
    );

    const { mutate: saveSortOrder, isPending: isSortOrderUpdating } = useMutation({
        mutationFn: (sortedIds: number[]) => updateSortOrder(pantry?.id!, sortedIds),
        onMutate: async (sortedIds): Promise<{ previous: ItemCategory[] | undefined }> => {
            await queryClient.cancelQueries({ queryKey: categoryQueryKey });
            const previous = queryClient.getQueryData<ItemCategory[]>(categoryQueryKey);

            queryClient.setQueryData<ItemCategory[]>(categoryQueryKey, (old) =>
                sortedIds
                    .map((id, index) => {
                        const category = old?.find((c) => c.id === id);
                        if (category) {
                            return Object.assign({}, category, { sortOrder: index });
                        }
                        return category;
                    })
                    .filter((c): c is ItemCategory => !!c)
            );

            return { previous };
        },
        onError: (_: any, __: any, context: { previous: any } | undefined) => {
            if (context?.previous) {
                queryClient.setQueryData(categoryQueryKey, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: categoryQueryKey });
        },
    });

    const deleteCategory = useCallback(
        (id: number, cb?: Function) => {
            Alert.alert('Remove category', 'Do you want to remove this category from your list?', [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        await saveCategory({
                            id,
                            deletedAt: new Date(),
                        });
                    },
                    style: 'destructive',
                },
            ]);

            cb?.();
        },
        [saveCategory]
    );

    return {
        pantry,
        categories,
        category,
        saveCategory,
        deleteCategory,
        isCategorySaving,
        saveSortOrder,
        isSortOrderUpdating,
    };
};
