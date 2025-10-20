import { SnackbarProvider } from '@/components/snackbar';
import { useApi } from '@/hooks/use-api';
import { colors, fonts } from '@/styles/global';
import Theme from '@/styles/sous-theme';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import {
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '@react-navigation/native';
import { defaultConfig } from '@tamagui/config/v4';
import { PortalProvider } from '@tamagui/portal';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import Constants from 'expo-constants';
import * as ExpoDevice from 'expo-device';
import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments } from 'expo-router';
import { Tabs } from 'expo-router/tabs';
import * as SecureStore from 'expo-secure-store';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef } from 'react';
import { Appearance, Platform, StatusBar, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSyncQueriesExternal } from 'react-query-external-sync';
import { createTamagui, TamaguiProvider } from 'tamagui';

const queryClient = new QueryClient();
const config = createTamagui(defaultConfig);

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFF',
        borderTopWidth: 2,
        borderTopColor: colors.primary,
    },
    tabLabel: {
        fontFamily: fonts.poppins.medium,
        textTransform: 'lowercase',
    },
});

function SignedOutRedirectGuard() {
    const router = useRouter();
    const segments = useSegments();

    // consider "login" and the auth grouping as auth routes
    const isOnAuthRoute = segments.some((s) => s === 'login' || s === '(auth)');

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
    const { userId, isLoaded, getToken } = useAuth();
    const { syncUser } = useApi();
    const calledRef = useRef(false);

    const mutation = useMutation({
        mutationFn: () => syncUser(),
    });

    useEffect(() => {
        if (!isLoaded || !userId || calledRef.current) return;
        calledRef.current = true;
        mutation.mutate();
    }, [isLoaded, userId, mutation]);

    return null;
}

export default function RootLayout() {
    if (!Constants.expoConfig?.extra?.clerkKey && !process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        throw new Error('Missing authentication token');
    }

    useSyncQueriesExternal({
        queryClient,
        socketURL: 'http://localhost:42831', // Default port for React Native DevTools
        deviceName: Platform?.OS || 'web', // Platform detection
        platform: Platform?.OS || 'web', // Use appropriate platform identifier
        deviceId: Platform?.OS || 'web', // Use a PERSISTENT identifier (see note below)
        isDevice: ExpoDevice.isDevice, // Automatically detects real devices vs emulators
        extraDeviceInfo: {
            // Optional additional info about your device
            appVersion: '1.0.0',
            // Add any relevant platform info
        },
        enableLogs: false,
        envVariables: {
            NODE_ENV: process.env.NODE_ENV,
            // Add any private environment variables you want to monitor
            // Public environment variables are automatically loaded
        },
        // Storage monitoring with CRUD operations
        asyncStorage: AsyncStorage, // AsyncStorage for ['#storage', 'async', 'key'] queries + monitoring
        secureStorage: SecureStore, // SecureStore for ['#storage', 'secure', 'key'] queries + monitoring
        secureStorageKeys: ['userToken', 'refreshToken', 'biometricKey', 'deviceId'], // SecureStore keys to monitor
    });

    useEffect(() => {
        Appearance.setColorScheme('light');
    }, []);

    let [fontsLoaded] = useFonts({
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
        Caprasimo_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={
                Constants.expoConfig?.extra?.clerkKey ||
                process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
            }
        >
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
                                            <Tabs
                                                initialRouteName='recipes'
                                                screenOptions={() => ({
                                                    headerShown: false,
                                                    tabBarStyle: styles.tabBar,
                                                    tabBarLabelStyle: styles.tabLabel,
                                                    tabBarActiveTintColor: colors.primary,
                                                    tabBarInactiveTintColor: '#888',
                                                })}
                                            >
                                                <Tabs.Screen
                                                    name='recipes'
                                                    options={{
                                                        tabBarLabel: 'Recipes',
                                                        tabBarIcon: ({ color, size }) => (
                                                            <SymbolView
                                                                name='book'
                                                                style={{
                                                                    width: size,
                                                                    height: size,
                                                                }}
                                                                type='palette'
                                                                tintColor={color}
                                                            />
                                                        ),
                                                    }}
                                                />
                                                <Tabs.Screen
                                                    name='pantry'
                                                    options={{
                                                        tabBarLabel: 'Pantry',
                                                        tabBarIcon: ({ color, size }) => (
                                                            <SymbolView
                                                                name='refrigerator'
                                                                style={{
                                                                    width: size,
                                                                    height: size,
                                                                }}
                                                                type='palette'
                                                                tintColor={color}
                                                            />
                                                        ),
                                                    }}
                                                />
                                                <Tabs.Screen
                                                    name='list'
                                                    options={{
                                                        tabBarLabel: 'List',
                                                        tabBarIcon: ({ color, size }) => (
                                                            <SymbolView
                                                                name='cart'
                                                                style={{
                                                                    width: size,
                                                                    height: size,
                                                                }}
                                                                type='palette'
                                                                tintColor={color}
                                                            />
                                                        ),
                                                    }}
                                                />
                                                <Tabs.Screen
                                                    name='profile'
                                                    options={{
                                                        tabBarLabel: 'Profile',
                                                        tabBarIcon: ({ color, size }) => (
                                                            <SymbolView
                                                                name='smiley'
                                                                style={{
                                                                    width: size,
                                                                    height: size,
                                                                }}
                                                                type='palette'
                                                                tintColor={color}
                                                            />
                                                        ),
                                                    }}
                                                />
                                                <Tabs.Screen
                                                    name='+not-found'
                                                    options={{
                                                        href: null,
                                                    }}
                                                />
                                                <Tabs.Screen
                                                    name='(auth)'
                                                    options={{
                                                        href: null,
                                                    }}
                                                />
                                            </Tabs>
                                        </SignedIn>
                                        <StatusBar barStyle='dark-content' />
                                    </SafeAreaProvider>
                                </SnackbarProvider>
                            </ThemeProvider>
                        </QueryClientProvider>
                    </TamaguiProvider>
                </PortalProvider>
            </GestureHandlerRootView>
        </ClerkProvider>
    );
}
