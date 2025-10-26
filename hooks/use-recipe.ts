import { useApi } from '@/hooks/use-api';
import { standardMutation } from '@/util/query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Alert } from 'react-native';

export const useRecipe = ({
    recipeId,
    enabled = true,
}: { recipeId?: number; enabled?: boolean } = {}) => {
    const queryClient = useQueryClient();
    const { user, getRecipes, getRecipe, deleteRecipe: apiDeleteRecipe } = useApi();

    const recipes = useQuery<Recipe[]>({
        queryKey: ['recipes'],
        queryFn: () => getRecipes(),
        enabled: enabled && !!user,
    });

    const recipe = useQuery<Recipe>({
        queryKey: ['recipes', recipeId],
        queryFn: () => getRecipe(recipeId!),
        enabled: enabled && !!user && !!recipeId,
    });

    const { mutate: handleDeleteRecipe } = useMutation(
        standardMutation<any, DeleteRecipe>(
            ({ id }: DeleteRecipe) => apiDeleteRecipe(id),
            queryClient,
            ['recipes'],
            { isDelete: true }
        )
    );

    const deleteRecipe = useCallback((id: number, cb?: Function) => {
        Alert.alert('Remove item', 'Do you want to remove this item from your list?', [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: async () => {
                    await handleDeleteRecipe({ id });
                    cb?.();
                },
                style: 'destructive',
            },
        ]);
    }, []);

    return {
        recipes,
        recipe,
        deleteRecipe,
    };
};
