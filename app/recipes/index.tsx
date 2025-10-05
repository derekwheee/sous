import { getPantry } from '@/api/pantry';
import { getRecipes } from '@/api/recipes';
import Heading from '@/components/heading';
import RecipeListing from '@/components/recipe-listing';
import globalStyles from '@/styles/global';
import { PantryItem, Recipe } from '@/types/interfaces';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({

    })
};

const Spacer = ({ height = 16 }) => <View style={{ height }} />;

export default function HomeScreen() {
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
        data: pantry = []
    } = useQuery<PantryItem[]>({
        queryKey: ['pantry'],
        queryFn: getPantry
    });

    if (recipeError) {
        console.log('Error fetching recipes:', recipeError);
    }

    if (pantryError) {
        console.log('Error fetching pantry:', pantryError);
    }

    const isLoading = isRecipeLoadingerror || isPantryLoading;

    return (
        <ScrollView style={styles.container}>
            <Heading
                title='Recipes'
                linkTo='/recipes/new'
                linkText='create recipe'
            />
            {isLoading && (
                <></>
            )}
            {!isLoading && recipes?.map((recipe: Recipe) => (
                <RecipeListing key={recipe.id} recipe={recipe} pantry={pantry} />
            ))}
        </ScrollView>
    );
}
