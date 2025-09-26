import Heading from '@/components/heading';
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
            <Heading title='Recipes' />
            {data.recipes.map((recipe) => (
                <RecipeListing key={recipe.id} recipe={recipe} />
            ))}
        </ScrollView>
    );
}
