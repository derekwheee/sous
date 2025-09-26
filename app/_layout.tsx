import HamburgerIcon from '@/components/hamburger';
import Text from '@/components/text';
import { colors } from '@/styles/global';
import Theme from '@/styles/sous-theme';
import { Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { ThemeProvider } from '@react-navigation/native';
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
    },
    drawerItem: {
        padding: 16
    },
    drawerItemText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 36,
        lineHeight: 54,
        textTransform: 'lowercase',
        textAlign: 'right',
        color: '#fff'
    }
});

function CustomDrawerItem(props: any) {
    const { label, onPress, focused } = props;
    return (
        <Pressable
            onPress={onPress}
            style={{ ...styles.drawerItem, opacity: focused ? 0.5 : 1 }}
        >
            <Text style={styles.drawerItemText}>{label}</Text>
        </Pressable>
    );
}

function CustomDrawerContent(props: any) {
    const { state, navigation, descriptors } = props;

    return (
        <DrawerContentScrollView {...props}>
            {state.routes.map((route: any, index: any) => {
                const focused = state.index === index;
                const { drawerLabel, title } = descriptors[route.key].options;

                return (
                    <CustomDrawerItem
                        key={route.key}
                        label={drawerLabel ?? title ?? route.name}
                        focused={focused}
                        onPress={() => {
                            navigation.navigate(route.name);
                        }}
                    />
                );
            })}
        </DrawerContentScrollView>
    );
}

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
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={({ navigation }) => ({
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
                    },
                    drawerStyle: {
                        width: 300,
                        backgroundColor: colors.primary,
                        paddingTop: 20
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
                <Drawer.Screen
                    name="(pantry)"
                    options={{
                        drawerLabel: 'Pantry',
                        title: 'sous',
                    }}
                />
                <Drawer.Screen
                    name="(profile)"
                    options={{
                        drawerLabel: 'Profile',
                        title: 'sous',
                    }}
                />
                <Drawer.Screen
                    name="(settings)"
                    options={{
                        drawerLabel: 'Settings',
                        title: 'sous',
                    }}
                />
            </Drawer>
            <StatusBar style="auto" />
        </ThemeProvider >
    );
}