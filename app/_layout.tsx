import HamburgerIcon from '@/components/hamburger';
import Text from '@/components/text';
import { Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet } from 'react-native';
import 'react-native-reanimated';

const styles = StyleSheet.create({
    hamburger: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 16
    },
    icon: {
        flex: 1
    }
});

export default function RootLayout() {
    let [fontsLoaded] = useFonts({
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Caprasimo_400Regular
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ThemeProvider value={DefaultTheme}>
            <Drawer screenOptions={({ navigation }) => ({
                headerLeft: () => (
                    <Pressable
                        style={styles.hamburger}
                        onPress={() => navigation.toggleDrawer()}
                    >
                        <HamburgerIcon />
                        <Text>menu</Text>
                    </Pressable>
                ),
                headerStyle: {
                    height: 104,
                    backgroundColor: '#FFD541',
                },
                headerTitleStyle: {
                    fontFamily: 'Caprasimo_400Regular',
                    fontSize: 36
                }
            })}>
                <Drawer.Screen
                    name="index"
                    options={{
                        drawerLabel: 'Dashboard',
                        title: 'sous'
                    }}
                />
                <Drawer.Screen
                    name="(recipes)"
                    options={{
                        drawerLabel: 'Recipes',
                        title: 'sous',
                    }}
                />
            </Drawer>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}