import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const recipeData = {
  '1': {
    title: 'Chocolate Cake',
    ingredients: ['2 cups flour', '1 cup sugar', '1/2 cup cocoa powder', '2 eggs'],
    instructions: 'Mix dry ingredients, add wet ingredients, bake at 350°F for 30 minutes.',
  },
  '2': {
    title: 'Pasta Carbonara',
    ingredients: ['400g spaghetti', '200g pancetta', '4 eggs', 'Parmesan cheese'],
    instructions: 'Cook pasta, fry pancetta, mix with egg and cheese mixture.',
  },
  '3': {
    title: 'Chicken Curry',
    ingredients: ['1 lb chicken', 'Curry powder', 'Coconut milk', 'Onions', 'Garlic'],
    instructions: 'Sauté onions and garlic, add chicken and spices, simmer with coconut milk.',
  },
};

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const recipe = recipeData[id as keyof typeof recipeData];
  
  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Recipe not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>• {ingredient}</Text>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions:</Text>
          <Text style={styles.instructions}>{recipe.instructions}</Text>
        </View>
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