import Text from '@/components/text';
import globalStyles, { colors } from '@/styles/global';
import { PantryItem, Recipe } from '@/types/interfaces';
import { Link } from 'expo-router';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        wrapper: {
            display: 'flex',
            flexDirection: 'row',
            gap: 16,
            alignItems: 'center',
            padding: 16,
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#eee'
        },
        statusDot: {
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: colors.success
        },
        name: {
            flexShrink: 1,
            fontSize: 16,
            textTransform: 'lowercase'
        },
        ingredientsAvailable: {
            marginLeft: 'auto',
            fontSize: 16
        }
    })
};

interface RecipeProps {
    recipe: Recipe
}

interface PantryProps {
    pantry: PantryItem[]
}

export default function RecipeListing({ recipe, pantry, ...rest }: RecipeProps & PantryProps & PressableProps) {

    const availableIngredients = getAvailableIngredients(recipe, pantry);

    return (
        <Link href={`/recipes/${recipe.id}`} asChild>
            <Pressable style={styles.wrapper} {...rest}>
                <View style={[styles.statusDot, { backgroundColor: getStatusDotColor(availableIngredients.length, recipe.ingredients.length) }]} />
                <Text style={styles.name} numberOfLines={1}>{recipe.name}</Text>
                <Text style={styles.ingredientsAvailable}>
                    {availableIngredients.length} / {recipe.ingredients.length}
                </Text>
            </Pressable>
        </Link>
    );
}

function getStatusDotColor(available: number, total: number) {

    if (total === 0) {
        return colors.indeterminate;
    }

    if (available === total) {
        return colors.success;
    }

    if (available >= (total / 2)) {
        return colors.warning;
    }

    return colors.indeterminate;
}

function getAvailableIngredients(recipe: Recipe, pantry: PantryItem[]) {
    return recipe.ingredients.filter((ingredient) => {
        return pantry?.some((item) => item.name === ingredient.item);
    });
}
