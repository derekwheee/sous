import { Stack } from 'expo-router';

export default function RecipesLayout() {
    return (
        <Stack

            screenOptions={() => ({
                headerTitle: 'sous',
                headerStyle: {
                    height: 112,
                    backgroundColor: '#FFD541',
                },
                headerTitleStyle: {
                    fontFamily: 'Caprasimo_400Regular',
                    fontSize: 36
                },
                headerBackground: () => null,
                headerBackButtonMenuEnabled: false,
                headerBackButtonDisplayMode: 'minimal'
            })}
        >
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