import { Stack } from 'expo-router';

export default function RecipesLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Recipes',
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Recipe Details',
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="new"
                options={{
                    title: 'New Recipe',
                    headerShown: true
                }}
            />
        </Stack>
    );
}