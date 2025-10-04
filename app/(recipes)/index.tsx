import Heading from '@/components/heading';
import RecipeListing from '@/components/recipe-listing';
import { getPantry, getRecipes } from '@/fetch';
import globalStyles from '@/styles/global';
import { Recipe } from '@/types/interfaces';
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({

    })
};

export default function HomeScreen() {
    const [recipes, setRecipes] = useState([]);
    const [pantry, setPantry] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                setRecipes((await getRecipes()) || []);
                setPantry((await getPantry()) || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Heading
                title='Recipes'
                linkTo='/(recipes)/new'
                linkText='create recipe'
            />
            {!loading && recipes.map((recipe: Recipe) => (
                <RecipeListing key={recipe.id} recipe={recipe} pantry={pantry} />
            ))}
        </ScrollView>
    );
}
