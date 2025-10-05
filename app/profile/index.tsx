import { Link } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const recipes = [
  { id: '1', title: 'Chocolate Cake', description: 'Delicious chocolate cake recipe' },
  { id: '2', title: 'Pasta Carbonara', description: 'Classic Italian pasta dish' },
  { id: '3', title: 'Chicken Curry', description: 'Spicy and aromatic curry' },
];

export default function RecipeList() {
  const renderRecipe = ({ item }: { item: typeof recipes[0] }) => (
    <Link href={`/recipes/${item.id}`} asChild>
      <TouchableOpacity style={styles.recipeCard}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeDescription}>{item.description}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    padding: 16,
  },
  recipeCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
  },
});