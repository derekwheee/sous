import { getPantry } from '@/api/pantry';
import { getRecipes } from '@/api/recipes';
import Heading from '@/components/heading';
import Loading from '@/components/loading';
import RecipeListing from '@/components/recipe-listing';
import SearchBar from '@/components/search';
import { useHeader } from '@/hooks/use-header';
import globalStyles from '@/styles/global';
import { PantryItem, Recipe } from '@/types/interfaces';
import { getAvailableIngredients } from '@/util/recipe';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({

    })
};

export default function HomeScreen() {
    const { HeaderSpacer } = useHeader({
        rightAction: () => {},
        rightActionText: 'add recipe',
        rightActionIcon: 'plus'
    });
    const {
        isFetching: isRecipeLoadingerror,
        error: recipeError,
        data: recipes
    } = useQuery<Recipe[]>({
        queryKey: ['recipes'],
        queryFn: getRecipes
    });

    const {
        isFetching: isPantryLoading,
        error: pantryError,
        data: pantry = [],
        refetch: refetchRecipes
    } = useQuery<PantryItem[]>({
        queryKey: ['pantry'],
        queryFn: getPantry
    });

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');


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
        <>
            <Loading isLoading={isLoading && !filteredRecipes?.length} />
            <HeaderSpacer />
            <Heading
                title='Recipes'
                linkTo='/recipes/new'
                linkText='create recipe'
            />
            <SearchBar
                value={searchTerm}
                onChangeText={setSearchTerm}
                inputProps={{
                    placeholder: 'search recipes...'
                }}
            />
            <ScrollView
                style={styles.container}
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
                {filteredRecipes?.map((recipe: Recipe) => (
                    <RecipeListing key={recipe.id} recipe={recipe} pantry={pantry} />
                ))}
            </ScrollView>
        </>
    );
}
