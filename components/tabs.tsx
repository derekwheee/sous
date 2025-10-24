import { useSSE } from '@/hooks/use-sse';
import { colors, fonts } from '@/styles/global';
import { useAuth } from '@clerk/clerk-expo';
import { Tabs } from 'expo-router/tabs';
import { SymbolView } from 'expo-symbols';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

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

export default function TabRouter() {
    const { isSignedIn = false } = useAuth();
    
    useSSE();

    return (
        <Tabs
            initialRouteName={isSignedIn ? 'recipes' : '(auth)'}
            screenOptions={() => ({
                headerShown: false,
                tabBarStyle: [styles.tabBar, { display: isSignedIn ? 'flex' : 'none' }],
                tabBarLabelStyle: styles.tabLabel,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: '#888',
            })}
        >
            <Tabs.Protected guard={isSignedIn}>
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
            </Tabs.Protected>
            <Tabs.Screen
                name='(auth)'
                options={{
                    href: null,
                    tabBarStyle: [styles.tabBar, { display: 'none' }],
                }}
            />
            <Tabs.Screen
                name='+not-found'
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
