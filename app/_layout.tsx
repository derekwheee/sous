import { colors } from '@/styles/global';
import Theme from '@/styles/sous-theme';
import { Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import Feather from '@expo/vector-icons/Feather';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router/tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFF',
        height: 80,
        borderTopWidth: 2,
        borderTopColor: colors.primary
    },
    tabLabel: {
        fontFamily: 'Poppins_500Medium',
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
        <ThemeProvider value={Theme}>
            <SafeAreaProvider>
                <Tabs
                    initialRouteName="(recipes)"
                    screenOptions={() => ({
                        headerShown: false,
                        headerStyle: {
                            height: 112,
                            backgroundColor: '#FFD541',
                        },
                        headerTitleStyle: {
                            fontFamily: 'Caprasimo_400Regular',
                            fontSize: 36
                        },
                        tabBarStyle: styles.tabBar,
                        tabBarLabelStyle: styles.tabLabel,
                        tabBarActiveTintColor: colors.primary,
                        tabBarInactiveTintColor: '#888'
                    })}
                >
                    <Tabs.Screen
                        name="(recipes)"
                        options={{
                            title: 'sous',
                            tabBarLabel: 'Recipes',
                            tabBarIcon: ({ color, size }) => <Feather name="book" size={size} color={color} />
                        }}
                    />
                    <Tabs.Screen
                        name="(pantry)"
                        options={{
                            title: 'sous',
                            tabBarLabel: 'Pantry',
                            tabBarIcon: ({ color, size }) => <Feather name="grid" size={size} color={color} />
                        }}
                    />
                    <Tabs.Screen
                        name="(profile)"
                        options={{
                            title: 'sous',
                            tabBarLabel: 'Profile',
                            tabBarIcon: ({ color, size }) => <Feather name="smile" size={size} color={color} />
                        }}
                    />
                    <Tabs.Screen
                        name="(settings)"
                        options={{
                            title: 'sous',
                            tabBarLabel: 'Settings',
                            tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />
                        }}
                    />
                </Tabs>

                <StatusBar style='dark' />
            </SafeAreaProvider>
        </ThemeProvider >
    );
}