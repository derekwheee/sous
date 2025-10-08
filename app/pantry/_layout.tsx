import HeaderBackground from '@/components/header-background';
import { Stack } from 'expo-router';

export default function PantryLayout() {
    return (
        <Stack
            screenOptions={{
                headerTitle: '',
                headerTransparent: true,
                headerShadowVisible: false,
                headerBackButtonDisplayMode: 'minimal',
                headerBlurEffect: 'none',
                headerBackground: () => <HeaderBackground />
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Pantry',
                }}
            />
        </Stack>
    );
}