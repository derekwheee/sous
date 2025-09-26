import Text from '@/components/text';
import globalStyles, { colors } from '@/styles/global';
import { Link } from 'expo-router';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';


const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        wrapper: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#eee'
        },
        statusDot: {
            width: 16,
            height: 16,
            marginRight: 16,
            borderRadius: 8,
            backgroundColor: colors.success
        },
        name: {
            fontSize: 16,
            textTransform: 'lowercase'
        },
        ingredientsAvailable: {
            marginLeft: 'auto',
            fontSize: 16
        }
    })
};

interface RecipeListingProps {
    recipe: {
        id: number,
        name: string
    }
}

export default function RecipeListing({ recipe, ...rest }: RecipeListingProps & PressableProps) {
    return (
        <Link href={`/(recipes)/${recipe.id}`} asChild>
            <Pressable style={styles.wrapper} {...rest}>
                <View style={styles.statusDot} />
                <Text style={styles.name}>{recipe.name}</Text>
                <Text style={styles.ingredientsAvailable}>12 / 12</Text>
            </Pressable>
        </Link>
    );
}
