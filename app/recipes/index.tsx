import Heading from '@/components/heading';
import RecipeListing from '@/components/recipe-listing';
import Screen from '@/components/screen';
import { useApi } from '@/hooks/use-api';
import globalStyles, { colors } from '@/styles/global';
import { Pantry, Recipe } from '@/types/interfaces';
import { getAvailableIngredients } from '@/util/recipe';
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

    const { getRecipes, getPantries } = useApi();

    const {
        isFetching: isRecipeLoadingerror,
        error: recipeError,
        data: recipes,
        refetch
    } = useQuery<Recipe[]>({
        queryKey: ['recipes'],
        queryFn: () => getRecipes()
    });

    const {
        isFetching: isPantryLoading,
        error: pantryError,
        data: pantries,
        refetch: refetchPantries
    } = useQuery<Pantry[]>({
        queryKey: ['pantry'],
        queryFn: () => getPantries()
    });

    // TODO: Allow selection of pantry
    const pantry = pantries?.[0]?.pantryItems;
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
        const aRatio = getAvailableIngredients(a, pantry || []).length / (a.ingredients.length || 1);
        const bRatio = getAvailableIngredients(b, pantry || []).length / (b.ingredients.length || 1);
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
                        refetch().finally(() => setIsRefreshing(false));
                    }}
                />
            }
        >
            <Heading
                title='Recipes'
                actions={[
                    {
                        label: 'new recipe',
                        icon: 'plus',
                        onPress: () => router.push('/recipes/new')
                    },
                    {
                        icon: 'slider.horizontal.3',
                        onPress: () => {}
                    }
                ]}
            />
            {pantry && filteredRecipes?.map((recipe: Recipe) => (
                <RecipeListing key={recipe.id} recipe={recipe} pantry={pantry} />
            ))}
        </Screen>
    );
}
