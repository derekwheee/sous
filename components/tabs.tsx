import { useSSE } from '@/hooks/use-sse';
import { fonts } from '@/styles/global';
import { useAuth } from '@clerk/clerk-expo';
import { Tabs } from 'expo-router/tabs';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import SystemIcon from './system-icon';
import { useAI } from '@/hooks/use-ai';
import { usePantry } from '@/hooks/use-pantry';
import { useEffect } from 'react';
import { useColors } from '@/hooks/use-colors';
import { useDbUser } from '@/hooks/use-db-user';
import { useStyles } from '@/hooks/use-style';
import { useSegments } from 'expo-router';

const moduleStyles: CreateStyleFunc = (colors) => ({
    tabBar: {
        backgroundColor: colors.surface,
        borderTopWidth: 0,
    },
    tabLabel: {
        fontFamily: fonts.poppins.medium,
        textTransform: 'lowercase',
    },
});

export default function TabRouter() {
    const { styles, colors, brightness } = useStyles(moduleStyles);
    const { updateTheme, resolvedTheme } = useColors();
    const { isSignedIn = false } = useAuth();
    const { user } = useDbUser();
    const segment: string[] = useSegments();

    useSSE();

    const { pantry } = usePantry();
    const { fetchExpiringPantryItems } = useAI({ pantryId: pantry?.id });

    useEffect(() => {
        if (pantry?.id) {
            fetchExpiringPantryItems();
        }
    }, [pantry?.id, fetchExpiringPantryItems]);

    useEffect(() => {
        if (!!user) {
            updateTheme(user.themePreference || 'system');
        }
    }, [user, updateTheme, resolvedTheme]);

    const hideTabBar = segment.includes('recipes') && segment.includes('cook');

    return (
        <Tabs
            tabBar={hideTabBar ? () => null : undefined}
            initialRouteName={isSignedIn ? 'recipes' : '(auth)'}
            screenOptions={() => ({
                headerShown: false,
                headerShadowVisible: false,
                tabBarStyle: [styles.tabBar, { display: isSignedIn ? 'flex' : 'none' }],
                tabBarLabelStyle: styles.tabLabel,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: brightness(colors.background, -80),
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
                                ios='person'
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
