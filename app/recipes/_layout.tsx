import HeaderBackground from '@/components/header-background';
import { Stack } from 'expo-router';

export default function RecipesLayout() {
    return (
        <Stack
            screenOptions={{
                headerTitle: '',
                headerTransparent: true,
                headerShadowVisible: false,
                headerBackButtonDisplayMode: 'minimal',
                headerBlurEffect: 'none',
                headerBackground: () => <HeaderBackground />,
            }}
        >
            <Stack.Screen
                name='index'
                options={{
                    title: 'Recipes',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name='[id]'
                options={{
                    title: 'Recipe Details',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name='new'
                options={{
                    title: 'New Recipe',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name='edit/[id]'
                options={{
                    title: 'Edit Recipe',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name='cook/[id]'
                options={{
                    title: 'Cook Recipe',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='suggest'
                options={{
                    title: 'Suggest Recipes',
                    presentation: 'modal',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='suggested'
                options={{
                    title: 'Suggested Recipe',
                    headerShown: true,
                }}
            />
        </Stack>
    );
}
