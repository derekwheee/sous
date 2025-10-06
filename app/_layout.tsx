import { colors, fonts } from '@/styles/global';
import Theme from '@/styles/sous-theme';
import { Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import Feather from '@expo/vector-icons/Feather';
import { ThemeProvider } from '@react-navigation/native';
import { defaultConfig } from '@tamagui/config/v4';
import { PortalProvider } from '@tamagui/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router/tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
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
                                        tabBarIcon: ({ color, size }) => <Feather name="book" size={size} color={color} />
                                    }}
                                />
                                <Tabs.Screen
                                    name="pantry"
                                    options={{
                                        tabBarLabel: 'Pantry',
                                        tabBarIcon: ({ color, size }) => <Feather name="grid" size={size} color={color} />
                                    }}
                                />
                                <Tabs.Screen
                                    name="lists"
                                    options={{
                                        tabBarLabel: 'Lists',
                                        tabBarIcon: ({ color, size }) => <Feather name="list" size={size} color={color} />
                                    }}
                                />
                                <Tabs.Screen
                                    name="profile"
                                    options={{
                                        tabBarLabel: 'Profile',
                                        tabBarIcon: ({ color, size }) => <Feather name="smile" size={size} color={color} />
                                    }}
                                />
                            </Tabs>

                            <StatusBar style='dark' />
                        </SafeAreaProvider>
                    </ThemeProvider >
                </QueryClientProvider>
            </TamaguiProvider>
        </PortalProvider>
    );
}