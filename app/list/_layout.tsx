import HeaderBackground from '@/components/header-background';
import { Stack } from 'expo-router';

export default function ListLayout() {
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
                    title: 'List',
                }}
            />
            <Stack.Screen
                name='edit'
                options={{
                    title: 'Edit Item',
                    presentation: 'modal',
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
