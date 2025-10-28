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

    const {
        user,
        getRecipes,
        getRecipe,
        upsertRecipe,
        getAllRecipeTags,
        importRecipe: apiImportRecipe,
        deleteRecipe: apiDeleteRecipe,
    } = useApi();

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

    const tags = useQuery<RecipeTag[]>({
        queryKey: ['recipeTags'],
        queryFn: () => getAllRecipeTags(),
        enabled: enabled && !!user,
    });

    const saveRecipe = useMutation(
        standardMutation<any, UpsertRecipe, any>(
            (patch: UpsertRecipe) => upsertRecipe(patch),
            queryClient,
            ['recipes']
        )
    );

    const deleteMutation = useMutation(
        standardMutation<any, DeleteRecipe, any>(
            ({ id }: DeleteRecipe) => apiDeleteRecipe(id),
            queryClient,
            ['recipes'],
            { isDelete: true }
        )
    );

    const importRecipe = useMutation({
        mutationFn: (url: string) => apiImportRecipe(url),
    });

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
                    await deleteMutation.mutate({ id });
                    cb?.();
                },
                style: 'destructive',
            },
        ]);
    }, []);

    return {
        recipes: {
            ...recipes,
            isBusy: recipes.isFetching || recipes.isLoading || recipes.isPending,
        },
        recipe: {
            ...recipe,
            isBusy: recipe.isFetching || recipe.isLoading || recipe.isPending,
        },
        importRecipe: {
            ...importRecipe,
            isBusy: importRecipe.isPending,
        },
        saveRecipe: {
            ...saveRecipe,
            isBusy: saveRecipe.isPending,
        },
        deleteRecipe: deleteRecipe,
        deleteMutation: {
            ...deleteMutation,
            isBusy: deleteMutation.isPending,
        },
        tags: {
            ...tags,
            isBusy: tags.isFetching || tags.isLoading || tags.isPending,
        },
    };
};
