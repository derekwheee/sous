import { useSSE } from '@/hooks/use-sse';
import { brightness, fonts } from '@/styles/global';
import { useAuth } from '@clerk/clerk-expo';
import { Tabs } from 'expo-router/tabs';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import SystemIcon from './system-icon';
import { useAI } from '@/hooks/use-ai';
import { usePantry } from '@/hooks/use-pantry';
import { useEffect } from 'react';
import { useColors } from '@/hooks/use-colors';

const useStyles = () => {
    const colors = useColors();
    return StyleSheet.create({
        tabBar: {
            backgroundColor: colors.surface,
            borderTopWidth: 0,
        },
        tabLabel: {
            fontFamily: fonts.poppins.medium,
            textTransform: 'lowercase',
        },
    });
};

export default function TabRouter() {
    const styles = useStyles();
    const colors = useColors();
    const { isSignedIn = false } = useAuth();

    useSSE();

    const { pantry } = usePantry();
    const { fetchExpiringPantryItems } = useAI({ pantryId: pantry?.id });

    useEffect(() => {
        if (pantry?.id) {
            fetchExpiringPantryItems();
        }
    }, [pantry?.id, fetchExpiringPantryItems]);

    return (
        <Tabs
            initialRouteName={isSignedIn ? 'recipes' : '(auth)'}
            screenOptions={() => ({
                headerShown: false,
                tabBarStyle: [styles.tabBar, { display: isSignedIn ? 'flex' : 'none' }],
                tabBarLabelStyle: styles.tabLabel,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: brightness(colors.background, -128),
            })}
        >
            <Tabs.Protected guard={isSignedIn}>
                <Tabs.Screen
                    name='recipes'
                    options={{
                        tabBarLabel: 'Recipes',
                        tabBarIcon: ({ color, size }) => (
                            <SystemIcon
                                ios='book'
                                android='book-open-variant-outline'
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name='pantry'
                    options={{
                        tabBarLabel: 'Pantry',
                        tabBarIcon: ({ color, size }) => (
                            <SystemIcon
                                ios='refrigerator'
                                android='fridge-outline'
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name='list'
                    options={{
                        tabBarLabel: 'List',
                        tabBarIcon: ({ color, size }) => (
                            <SystemIcon
                                ios='cart'
                                android='cart-outline'
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name='profile'
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color, size }) => (
                            <SystemIcon
                                ios='smiley'
                                android='emoticon-happy-outline'
                                size={size}
                                color={color}
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
