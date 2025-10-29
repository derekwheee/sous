import NetworkActivityIndicator from '@/components/network-activity';
import { SnackbarProvider } from '@/components/snackbar';
import Tabs from '@/components/tabs';
import { useApi } from '@/hooks/use-api';
import Theme from '@/styles/sous-theme';
import { ClerkProvider, SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import {
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { ThemeProvider } from '@react-navigation/native';
import { defaultConfig } from '@tamagui/config/v4';
import { PortalProvider } from '@tamagui/portal';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Appearance, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createTamagui, TamaguiProvider } from 'tamagui';

const queryClient = new QueryClient();
const config = createTamagui(defaultConfig);

export default function RootLayout() {
    if (!Constants.expoConfig?.extra?.clerkKey && !process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        throw new Error('Missing authentication token');
    }

    useEffect(() => {
        Appearance.setColorScheme('light');
    }, []);

    return (
        <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={
                Constants.expoConfig?.extra?.clerkKey ||
                process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
            }
        >
            <AppProviders />
        </ClerkProvider>
    );
}

function AppProviders() {
    const { isLoaded } = useUser();
    let [fontsLoaded] = useFonts({
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
        Caprasimo_400Regular,
    });

    if (!isLoaded) return null;

    if (!fontsLoaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PortalProvider>
                <TamaguiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider value={Theme}>
                            <SnackbarProvider>
                                <SafeAreaProvider>
                                    <SignedOut>
                                        <SignedOutRedirectGuard />
                                        <Slot />
                                    </SignedOut>
                                    <SignedIn>
                                        <SyncUserOnSignIn />
                                        <Tabs />
                                        <NetworkActivityIndicator />
                                    </SignedIn>
                                    <StatusBar barStyle='dark-content' />
                                </SafeAreaProvider>
                            </SnackbarProvider>
                        </ThemeProvider>
                    </QueryClientProvider>
                </TamaguiProvider>
            </PortalProvider>
        </GestureHandlerRootView>
    );
}

function SignedOutRedirectGuard() {
    const router = useRouter();
    const segments = useSegments();

    // consider "login" and the auth grouping as auth routes
    const isOnAuthRoute = segments.some((s) => s === '(auth)');

    useEffect(() => {
        // Only navigate when signed out AND not already on an auth route
        if (!isOnAuthRoute) {
            // use replace so the back stack doesn't go back to a protected route
            router.push('/(auth)' as any);
        }
    }, [isOnAuthRoute, router]);

    return null;
}

function SyncUserOnSignIn() {
    const { userId, isLoaded } = useAuth();
    const { syncUser } = useApi();
    const calledRef = useRef(false);

    const { mutate: syncUserMutate } = useMutation({
        mutationFn: () => syncUser(),
    });

    useEffect(() => {
        if (!isLoaded || !userId || calledRef.current) return;
        calledRef.current = true;
        syncUserMutate();
    }, [isLoaded, userId, syncUserMutate]);

    return null;
}
