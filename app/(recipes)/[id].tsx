import Ingredient from '@/components/ingredient';
import PageTitle from '@/components/page-title';
import Text from '@/components/text';
import TimeLabel from '@/components/time-label';
import data from '@/dummy/data';
import globalStyles from '@/styles/global';
import { Image, useImage } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';


const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        timeLabels: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    })
};

export default function RecipeDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const image = useImage('https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', {
        maxWidth: 800
    });

    const recipe = data.recipes.find((recipe) => recipe.id === Number(id));
    const ingredients = recipe?.ingredients.map((ingredient) => ({
        ...ingredient,
        test: 'test',
        pantryItem: data.pantry.find((pi) => pi.id === ingredient.pantryId)
    }));

    if (!recipe) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.h2}>Recipe not found</Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <PageTitle>{recipe.name}</PageTitle>
            <View style={[styles.content, styles.timeLabels]}>
                <TimeLabel label={'prep time'} time={recipe.prepTime} />
                <TimeLabel label={'cook time'} time={recipe.cookTime} />
            </View>
            <View style={styles.content}>
                <Text style={styles.h2}>Ingredients</Text>
                <View>
                    {ingredients?.map((ingredient) => (
                        <Ingredient key={ingredient.id} ingredient={ingredient} />
                    ))}
                </View>
            </View>
            <ScrollView style={styles.container}>
                {image && <Image source={image} style={{ width: image.width / 2, height: image.height / 2 }} />}
            </ScrollView>
        </ScrollView>
    );
}
