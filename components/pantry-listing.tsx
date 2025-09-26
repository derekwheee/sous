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
        }
    })
};

interface PantryListingProps {
    pantryItem: {
        id: number,
        name: string
    }
}

export default function PantryListing({ pantryItem, ...rest }: PantryListingProps & PressableProps) {
    return (
        <Link href={`/(recipes)/${pantryItem.id}`} asChild>
            <Pressable style={styles.wrapper} {...rest}>
                <View style={styles.statusDot} />
                <Text style={styles.name}>{pantryItem.name}</Text>
            </Pressable>
        </Link>
    );
}
