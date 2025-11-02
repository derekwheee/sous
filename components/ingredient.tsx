import Text from '@/components/text';
import globalStyles from '@/styles/global';
import { FUZZY_SEARCH_THRESHOLD } from '@/util/constants';
import Fuse from 'fuse.js';
import { StyleSheet, View, ViewProps } from 'react-native';
import SystemIcon from './system-icon';
import { useColors } from '@/hooks/use-colors';

// TODO: Update this to new pattern
const useStyles = () => {
    const { colors } = useColors();
    return {
        ...globalStyles(colors),
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
};

interface IngredientProps {
    ingredient: Ingredient;
    pantry?: Pantry;
    onPress?: (ingredient: Ingredient, pantryItem?: PantryItem) => void;
}

export default function Ingredient({
    ingredient,
    pantry,
    onPress,
    ...rest
}: IngredientProps & ViewProps) {
    const styles = useStyles();
    const { colors, brightness } = useColors();

    const fuse = new Fuse(pantry?.pantryItems || [], {
        keys: ['name'],
        threshold: FUZZY_SEARCH_THRESHOLD,
    });

    const matched = fuse.search(`${ingredient.item || ''}`);
    const pantryItem = matched[0]?.item;

    let icon: any[];
    let tintColor: string;

    if (pantryItem?.isInShoppingList) {
        icon = ['cart.circle', 'cart-check'];
        tintColor = brightness(colors.text, 150);
    } else if (pantryItem?.isInStock) {
        icon = ['plus.arrow.trianglehead.clockwise', 'checkbox-marked-circle-plus-outline'];
        tintColor = colors.success;
    } else {
        icon = ['plus.circle', 'plus-circle-outline'];
        tintColor = colors.text;
    }

    return (
        <View style={styles.wrapper} {...rest}>
            <SystemIcon
                ios={icon[0]}
                android={icon[1]}
                size={24}
                color={tintColor}
                onPress={() => onPress && onPress(ingredient, pantryItem)}
            />
            {ingredient.sentence && (
                <Text style={styles.ingredientText}>{ingredient.sentence}</Text>
            )}
        </View>
    );
}
