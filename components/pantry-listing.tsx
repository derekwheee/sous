import Text from '@/components/text';
import globalStyles, { colors } from '@/styles/global';
import { PantryItem } from '@/types/interfaces';
import { SymbolView } from 'expo-symbols';
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
            flexGrow: 1,
            fontSize: 16,
            textTransform: 'lowercase'
        }
    })
};

export default function PantryListing({
    pantryItem,
    onToggleFavorite,
    style = {},
    ...rest
}: {
    pantryItem: PantryItem,
    onToggleFavorite: ({ id, isFavorite }: { id: number, isFavorite: boolean }) => void,
    style?: any
} & PressableProps) {
    return (
        <Pressable style={[styles.wrapper, style]} {...rest}>
            <View style={[styles.statusDot, { backgroundColor: getStatusDotColor(pantryItem.isInStock) }]} />
            <Text style={styles.name}>{pantryItem.name}</Text>
            <Pressable
                onPress={() => onToggleFavorite({ id: pantryItem.id, isFavorite: !pantryItem.isFavorite })}
            >
                <SymbolView
                    name={pantryItem.isFavorite ? 'star.fill' : 'star'}
                    size={24}
                    tintColor={pantryItem.isFavorite ? colors.sous : '#ccc'}
                />
            </Pressable>
        </Pressable>
    );
}

function getStatusDotColor(isInStock: boolean) {
    if (isInStock) {
        return colors.success;
    }

    return colors.indeterminate;
}
