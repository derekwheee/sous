import { getPantryItem } from '@/api/pantry';
import { PantryItem } from '@/types/interfaces';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RecipeDetail() {
    const id = Number(useLocalSearchParams<{ id: string }>().id);

    const { isFetching, data: pantryItem } = useQuery<PantryItem | null>({
        queryKey: ['pantryItem', id],
        queryFn: () => getPantryItem(id)
    });

    if (!pantryItem) {
        return (
            <View style={styles.container}>
                <Text>Pantry item not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{pantryItem.name}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    ingredient: {
        fontSize: 16,
        marginBottom: 5,
        marginLeft: 10,
    },
    instructions: {
        fontSize: 16,
        lineHeight: 24,
    },
});