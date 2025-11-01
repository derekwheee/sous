import { useApi } from '@/hooks/use-api';
import { deleteMember, mutateMember } from '@/util/query';
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

    const recipesQuery = useQuery<Recipe[]>({
        queryKey: ['recipes'],
        queryFn: () => getRecipes(),
        enabled: enabled && !!user,
    });

    const recipeQuery = useQuery<Recipe>({
        queryKey: ['recipes', recipeId],
        queryFn: () => getRecipe(recipeId!),
        enabled: enabled && !!user && !!recipeId,
    });

    const tagsQuery = useQuery<RecipeTag[]>({
        queryKey: ['recipeTags'],
        queryFn: () => getAllRecipeTags(),
        enabled: enabled && !!user,
    });

    const saveRecipe = useMutation(
        mutateMember<Recipe>({
            mutationFn: (patch: Partial<Recipe>) => upsertRecipe(patch),
            memberQueryKey: recipeId ? ['recipes', recipeId] : [],
            memberOfQueryKey: ['recipes'],
            queryClient,
        })
    );

    const deleteMutation = useMutation(
        deleteMember<Recipe>({
            mutationFn: ({ id }: Partial<Recipe>) => apiDeleteRecipe(id!),
            queryClient,
            memberQueryKey: recipeId ? ['recipes', recipeId] : [],
            memberOfQueryKey: ['recipes'],
        })
    );

    const importRecipe = useMutation({
        mutationFn: (url: string) => apiImportRecipe(url),
    });

    const deleteMutationMutate = deleteMutation.mutate;

    const deleteRecipe = useCallback(
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
                        await deleteMutationMutate({ id });
                        cb?.();
                    },
                    style: 'destructive',
                },
            ]);
        },
        [deleteMutationMutate]
    );

    return {
        recipesQuery,
        recipesIsBusy: recipesQuery.isFetching || recipesQuery.isLoading || recipesQuery.isPending,
        recipes: recipesQuery.data,
        recipeQuery,
        recipeIsBusy: recipeQuery.isFetching || recipeQuery.isLoading || recipeQuery.isPending,
        recipe: recipeQuery.data,
        tagsQuery,
        tagsIsBusy: tagsQuery.isFetching || tagsQuery.isLoading || tagsQuery.isPending,
        tags: tagsQuery.data,
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
    };
};
