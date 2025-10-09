import Heading from '@/components/heading';
import RecipeListing from '@/components/recipe-listing';
import Screen from '@/components/screen';
import { useApi } from '@/hooks/use-api';
import globalStyles, { colors } from '@/styles/global';
import { PantryItem, Recipe } from '@/types/interfaces';
import { getAvailableIngredients } from '@/util/recipe';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { useNavigation, useRouter } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({

    })
};

export default function RecipeScreen() {

    const { getRecipes, getPantry } = useApi();

    const {
        isFetching: isRecipeLoadingerror,
        error: recipeError,
        data: recipes
    } = useQuery<Recipe[]>({
        queryKey: ['recipes'],
        queryFn: () => getRecipes()
    });

    const {
        isFetching: isPantryLoading,
        error: pantryError,
        data: pantry = [],
        refetch: refetchRecipes
    } = useQuery<PantryItem[]>({
        queryKey: ['pantry'],
        queryFn: () => getPantry()
    });

    const { user } = useUser();
    const navigation = useNavigation();
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useLayoutEffect(() => {
        navigation.setOptions({
            headerSearchBarOptions: {
                placeholder: 'search recipes...',
                tintColor: colors.primary,
                onChangeText: (event: any) => setSearchTerm(event.nativeEvent.text)
            },
        });
    }, [navigation]);

    if (recipeError) {
        console.log('Error fetching recipes:', recipeError);
    }

    if (pantryError) {
        console.log('Error fetching pantry:', pantryError);
    }

    const isLoading = isRecipeLoadingerror || isPantryLoading;

    const sortedRecipes = recipes?.sort((a, b) => {
        const aRatio = getAvailableIngredients(a, pantry).length / (a.ingredients.length || 1);
        const bRatio = getAvailableIngredients(b, pantry).length / (b.ingredients.length || 1);
        if (aRatio === bRatio) {
            return a.name.localeCompare(b.name);
        }
        return bRatio - aRatio;
    });

    const filteredRecipes = searchTerm
        ? sortedRecipes?.filter((recipe) =>
            recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : sortedRecipes;

    return (
        <Screen
            isLoading={isLoading && !filteredRecipes}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => {
                        setIsRefreshing(true);
                        refetchRecipes().finally(() => setIsRefreshing(false));
                    }}
                />
            }
        >
            <Heading
                title='Recipes'
                actions={[{
                    label: 'new recipe',
                    icon: 'plus',
                    onPress: () => router.push('/recipes/new')
                }]}
            />
            {filteredRecipes?.map((recipe: Recipe) => (
                <RecipeListing key={recipe.id} recipe={recipe} pantry={pantry} />
            ))}
        </Screen>
    );
}
