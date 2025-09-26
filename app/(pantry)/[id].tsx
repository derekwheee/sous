import data from '@/dummy/data';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RecipeDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const pantryItem = data.pantry.find((item) => item.id === Number(id))

    if (!pantryItem) {
        return (
            <View style={styles.container}>
                <Text>Recipe not found</Text>
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