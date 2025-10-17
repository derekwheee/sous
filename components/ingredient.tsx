import Text from '@/components/text';
import globalStyles, { brightness, colors } from '@/styles/global';
import { Ingredient as IngredientType, Pantry, PantryItem } from '@/types/interfaces';
import { SymbolView } from 'expo-symbols';
import Fuse from 'fuse.js';
import { StyleSheet, View, ViewProps } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        wrapper: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 4,
            gap: 4,
        },
        icon: {
            marginRight: 16,
        },
        ingredientText: {
            flexShrink: 1,
        },
    }),
};

interface IngredientProps {
    ingredient: IngredientType;
    pantry?: Pantry;
    onPress?: (ingredient: IngredientType, pantryItem?: PantryItem) => void;
}

export default function Ingredient({
    ingredient,
    pantry,
    onPress,
    ...rest
}: IngredientProps & ViewProps) {
    const fuse = new Fuse(pantry?.pantryItems || [], {
        keys: ['name'],
        threshold: 0.45,
    });

    const matched = fuse.search(`${ingredient.item || ''}`);
    const pantryItem = matched[0]?.item;

    let icon: any;
    let tintColor: string;

    if (pantryItem?.isInShoppingList) {
        icon = 'cart.circle';
        tintColor = brightness(colors.text, 150);
    } else if (pantryItem?.isInStock) {
        icon = 'plus.arrow.trianglehead.clockwise';
        tintColor = colors.success;
    } else {
        icon = 'plus.circle';
        tintColor = colors.text;
    }

    return (
        <View style={styles.wrapper} {...rest}>
            <SymbolView
                name={icon}
                size={24}
                tintColor={tintColor}
                onTouchEnd={() => onPress && onPress(ingredient, pantryItem)}
            />
            {ingredient.sentence && (
                <Text style={styles.ingredientText}>{ingredient.sentence}</Text>
            )}
        </View>
    );
}
