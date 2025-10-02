import Ingredient from '@/components/ingredient';
import PageTitle from '@/components/page-title';
import Text from '@/components/text';
import TimeLabel from '@/components/time-label';
import { getRecipe } from '@/fetch';
import globalStyles, { fonts } from '@/styles/global';
import { Recipe } from '@/types/interfaces';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        timeLabels: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        instructionContainer: {
            flex: 1,
            flexDirection: 'row',
            marginBottom: 16
        },
        instructionIndex: {
            position: 'relative',
            top: -8,
            width: 48,
            fontFamily: fonts.poppins.bold,
            fontSize: 32
        },
        instructionText: {
            flexShrink: 1,
            fontSize: 14
        }
    })
};

export default function RecipeDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                setRecipe((await getRecipe(id)) || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    if (loading) {
        // TODO: Show a loading state
        return null;
    }

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
                    {recipe.ingredients?.map((ingredient) => (
                        <Ingredient key={ingredient.id} ingredient={ingredient} />
                    ))}
                </View>
            </View>
            <View style={styles.content}>
                <Text style={styles.h2}>Instructions</Text>
                <View style={{ flex: 1 }}>
                    {recipe.instructions?.map((instruction, i) => (
                        <View key={i} style={styles.instructionContainer}>
                            <Text style={styles.instructionIndex}>{i + 1}</Text>
                            <Text style={styles.instructionText}>{instruction}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
