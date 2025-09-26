import Heading from '@/components/heading';
import PantryListing from '@/components/pantry-listing';
import RecipeListing from '@/components/recipe-listing';
import data from '@/dummy/data';
import globalStyles from '@/styles/global';
import { ScrollView, StyleSheet } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({

    })
};

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container}>
            <Heading
                title='Recipes'
                linkTo='/(recipes)'
                linkText='see all recipes'
            />
            {data.recipes.map((recipe) => (
                <RecipeListing key={recipe.id} recipe={recipe} />
            ))}
            <Heading
                title='Pantry'
                linkTo='/(recipes)'
                linkText='add items'
            />
            {data.pantry.map((pantryItem) => (
                <PantryListing key={pantryItem.id} pantryItem={pantryItem} />
            ))}
        </ScrollView>
    );
}
