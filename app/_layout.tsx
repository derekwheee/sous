import { colors, fonts } from '@/styles/global';
import Theme from '@/styles/sous-theme';
import { Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { ThemeProvider } from '@react-navigation/native';
import { defaultConfig } from '@tamagui/config/v4';
import { PortalProvider } from '@tamagui/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router/tabs';
import { SymbolView } from 'expo-symbols';
import { StatusBar, StyleSheet } from 'react-native';
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

export default function RootLayout() {

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
        <PortalProvider>
            <TamaguiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider value={Theme}>
                        <SafeAreaProvider>
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
                            </Tabs>
                            <StatusBar barStyle="dark-content" />
                        </SafeAreaProvider>
                    </ThemeProvider >
                </QueryClientProvider>
            </TamaguiProvider>
        </PortalProvider>
    );
}