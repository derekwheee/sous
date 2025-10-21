import HeaderBackground from '@/components/header-background';
import { useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';

export default function AuthRoutesLayout() {
    const { isSignedIn } = useAuth()

    // if (isSignedIn) {
    //     return <Redirect href={'/recipes' as any} />
    // }

    return <Stack
        screenOptions={{
            headerTitle: '',
            headerTransparent: true,
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
            headerBlurEffect: 'none',
            headerBackground: () => <HeaderBackground />
        }}
    />
}