import { useApi } from '@/hooks/use-api';
import { colors, fonts } from '@/styles/global';
import Theme from '@/styles/sous-theme';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { ThemeProvider } from '@react-navigation/native';
import { defaultConfig } from '@tamagui/config/v4';
import { PortalProvider } from '@tamagui/portal';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments } from 'expo-router';
import { Tabs } from 'expo-router/tabs';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef } from 'react';
import { Appearance, StatusBar, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createTamagui, TamaguiProvider } from 'tamagui';

const queryClient = new QueryClient()
const config = createTamagui(defaultConfig)

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFF',
        borderTopWidth: 2,
        borderTopColor: colors.primary
    },
    tabLabel: {
        fontFamily: fonts.poppins.medium,
        textTransform: 'lowercase'
    }
});

function SignedOutRedirectGuard() {
    const router = useRouter();
    const segments = useSegments();

    // consider "login" and the auth grouping as auth routes
    const isOnAuthRoute = segments.some(s => s === 'login' || s === '(auth)');

    useEffect(() => {
        // Only navigate when signed out AND not already on an auth route
        if (!isOnAuthRoute) {
            // use replace so the back stack doesn't go back to a protected route
            router.push('/login' as any);
        }
    }, [isOnAuthRoute, router]);

    return null;
}

// add this component (place above RootLayout)
function SyncUserOnSignIn() {
    const { getToken, userId, isLoaded } = useAuth();
    const { syncUser } = useApi();
    const calledRef = useRef(false);

    const mutation = useMutation({
        mutationFn: () => syncUser()
    });

    useEffect(() => {
        if (!isLoaded || !userId || calledRef.current) return;
        calledRef.current = true;
        mutation.mutate();
    }, [isLoaded, userId, mutation]);

    return null;
}

export default function RootLayout() {

    if (!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        throw new Error('Missing authentication token');
    }

    useEffect(() => {
        Appearance.setColorScheme('light');
    }, []);

    let [fontsLoaded] = useFonts({
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
        Caprasimo_400Regular
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ClerkProvider tokenCache={tokenCache}>
            <PortalProvider>
                <TamaguiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider value={Theme}>
                            <SafeAreaProvider>

                                <SignedOut>
                                    <SignedOutRedirectGuard />
                                    <Slot />
                                </SignedOut>
                                <SignedIn>
                                    <SyncUserOnSignIn />
                                    <Tabs
                                        initialRouteName="recipes"
                                        screenOptions={() => ({
                                            headerShown: false,
                                            tabBarStyle: styles.tabBar,
                                            tabBarLabelStyle: styles.tabLabel,
                                            tabBarActiveTintColor: colors.primary,
                                            tabBarInactiveTintColor: '#888'
                                        })}
                                    >
                                        <Tabs.Screen
                                            name="recipes"
                                            options={{
                                                tabBarLabel: 'Recipes',
                                                tabBarIcon: ({ color, size }) =>
                                                    <SymbolView
                                                        name="book"
                                                        style={{ width: size, height: size }}
                                                        type="palette"
                                                        tintColor={color}
                                                    />

                                            }}
                                        />
                                        <Tabs.Screen
                                            name="pantry"
                                            options={{
                                                tabBarLabel: 'Pantry',
                                                tabBarIcon: ({ color, size }) =>
                                                    <SymbolView
                                                        name="refrigerator"
                                                        style={{ width: size, height: size }}
                                                        type="palette"
                                                        tintColor={color}
                                                    />
                                            }}
                                        />
                                        <Tabs.Screen
                                            name="list"
                                            options={{
                                                tabBarLabel: 'List',
                                                tabBarIcon: ({ color, size }) =>
                                                    <SymbolView
                                                        name="cart"
                                                        style={{ width: size, height: size }}
                                                        type="palette"
                                                        tintColor={color}
                                                    />
                                            }}
                                        />
                                        <Tabs.Screen
                                            name="profile"
                                            options={{
                                                tabBarLabel: 'Profile',
                                                tabBarIcon: ({ color, size }) =>
                                                    <SymbolView
                                                        name="smiley"
                                                        style={{ width: size, height: size }}
                                                        type="palette"
                                                        tintColor={color}
                                                    />
                                            }}
                                        />
                                        <Tabs.Screen
                                            name="+not-found"
                                            options={{
                                                href: null
                                            }}
                                        />
                                        <Tabs.Screen
                                            name="(auth)"
                                            options={{
                                                href: null
                                            }}
                                        />
                                    </Tabs>
                                </SignedIn>
                                <StatusBar barStyle="dark-content" />
                            </SafeAreaProvider>
                        </ThemeProvider >
                    </QueryClientProvider>
                </TamaguiProvider>
            </PortalProvider>
        </ClerkProvider>
    );
}