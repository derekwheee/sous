import Text from '@/components/text';
import globalStyles from '@/styles/global';
import { Ingredient as IngredientType } from '@/types/interfaces';
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
    ingredient: IngredientType
}

export default function Ingredient({ ingredient, ...rest }: IngredientProps & ViewProps) {
    return (
        <View style={styles.wrapper} {...rest}>
            <Feather name="plus-circle" style={styles.icon} size={24} color="#000000" />
            {ingredient.sentence && (<Text size={16}>{ingredient.sentence}</Text>)}
        </View>
    );
}
