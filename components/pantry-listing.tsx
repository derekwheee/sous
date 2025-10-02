import Text from '@/components/text';
import globalStyles, { colors } from '@/styles/global';
import { PantryItem } from '@/types/interfaces';
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
        }
    })
};

interface PantryListingProps {
    pantryItem: PantryItem
}

export default function PantryListing({ pantryItem, ...rest }: PantryListingProps & PressableProps) {
    return (
        <Link href={`/(recipes)/${pantryItem.id}`} asChild>
            <Pressable style={styles.wrapper} {...rest}>
                <View style={[styles.statusDot, { backgroundColor: getStatusDotColor(pantryItem.isInStock) }]} />
                <Text style={styles.name}>{pantryItem.name}</Text>
            </Pressable>
        </Link>
    );
}

function getStatusDotColor(isInStock: boolean) {
    if (isInStock) {
        return colors.success;
    }

    return colors.indeterminate;
}
