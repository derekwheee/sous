import Text from '@/components/text';
import globalStyles from '@/styles/global';
import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, View, ViewProps } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        wrapper: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 4,
            gap: 4
        },
        icon: {
            marginRight: 16
        }
    })
};

interface IngredientProps {
    ingredient: {
        id: number,
        quantity: string,
        measurement: string,
        pantryItem?: {
            id: number,
            name: string
        }
    }
}

export default function Ingredient({ ingredient, ...rest }: IngredientProps & ViewProps) {
    return (
        <View style={styles.wrapper} {...rest}>
            <Feather name="plus-circle" style={styles.icon} size={24} color="#000000" />
            {ingredient.quantity && (<Text size={16}>{ingredient.quantity}</Text>)}
            {ingredient.measurement && (<Text size={16}>{ingredient.measurement}</Text>)}
            {ingredient.pantryItem?.name && (<Text size={16}>{ingredient.pantryItem?.name}</Text>)}
        </View>
    );
}
