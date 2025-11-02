import Heading from '@/components/heading';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import Screen from '@/components/screen';
import SystemIcon from '@/components/system-icon';
import Text from '@/components/text';
import { useHeader } from '@/hooks/use-header';
import { fonts } from '@/styles/global';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { MenuView, MenuComponentRef, NativeActionEvent } from '@react-native-menu/menu';
import { useRef, useState } from 'react';
import { useDbUser } from '@/hooks/use-db-user';
import { useStyles } from '@/hooks/use-style';
import { useAppStore } from '@/store/use-app-store';
import Loading from '@/components/loading';

const moduleStyles: CreateStyleFunc = (colors, brightness) => ({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: brightness(colors.background, -40),
    },
    welcomeText: {
        marginVertical: 16,
        paddingHorizontal: 16,
        fontSize: 24,
    },
    userName: {
        marginTop: -32,
        paddingHorizontal: 16,
        fontSize: 56,
        fontFamily: fonts.poppins.bold,
    },
    sectionHeading: {
        padding: 16,
        fontSize: 16,
        fontFamily: fonts.poppins.medium,
        borderBottomWidth: 1,
        borderBottomColor: brightness(colors.background, -40),
    },
});

export default function ProfileScreen() {
    const { signOut } = useClerk();
    const { user } = useUser();
    const { user: dbUser, saveUser } = useDbUser({
        onUserSettled: () => {
            // console.log('User update settled, triggering re-render');
            // triggerRender(Date.now());
            // router.replace('/recipes' as any);
        },
    });
    const router = useRouter();
    const { styles, colors } = useStyles(moduleStyles);
    const { triggerRender } = useAppStore();

    const [isSwitchingTheme, setIsSwitchingTheme] = useState(false);

    const preferences: UserPreferences = {
        colorTheme: dbUser?.themePreference || 'system',
    };

    const menuRef = useRef<MenuComponentRef>(null);

    const isLoading = !dbUser || isSwitchingTheme;

    useHeader({
        headerItems: [
            {
                label: 'sign out',
                icon: {
                    name: ['rectangle.portrait.and.arrow.right', 'logout'],
                },
                onPress: () => handleSignOut(),
            },
        ],
    });

    const handleSetTheme = async ({ nativeEvent }: NativeActionEvent) => {
        setIsSwitchingTheme(true);
        saveUser({ themePreference: nativeEvent.event as ColorTheme });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        triggerRender(Date.now());
        setIsSwitchingTheme(false);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/recipes' as any);
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    interface ListItem {
        text: string;
        icon: any[];
        onPress?: () => void;
    }

    const listItems: ListItem[] = [
        {
            text: 'categories',
            icon: ['list.dash', 'format-list-bulleted'],
            onPress: () => router.push('/profile/categories'),
        },
        {
            text: 'share household',
            icon: ['qrcode', 'qrcode'],
            onPress: () => router.push('/profile/link'),
        },
        {
            text: 'join a household',
            icon: ['qrcode.viewfinder', 'qr-code-scanner'],
            onPress: () => router.push('/profile/join'),
        },
    ];

    return (
        <Screen>
            <Loading isLoading={isLoading} />
            <Heading title='welcome,' />
            <Text style={styles.userName}>{user?.firstName || 'friend'}</Text>
            <List>
                {listItems.map((item, i) => (
                    <ListItem
                        key={i}
                        text={item.text}
                        onPress={item.onPress}
                        leftAdornment={
                            <SystemIcon
                                ios={item.icon[0]}
                                android={item.icon[1]}
                                size={24}
                                color={colors.text}
                            />
                        }
                        rightAdornment={
                            <SystemIcon
                                ios='chevron.right'
                                android='chevron-right'
                                size={16}
                                color={colors.text}
                            />
                        }
                    />
                ))}
            </List>
            <MenuView
                ref={menuRef}
                onPressAction={handleSetTheme}
                actions={[
                    {
                        id: 'system',
                        title: 'System',
                        image: Platform.select({
                            ios: 'iphone',
                            android: 'ic_menu_add',
                        }),
                        imageColor: colors.primary,
                        state: preferences.colorTheme === 'system' ? 'on' : 'off',
                    },
                    {
                        id: 'dark',
                        title: 'Dark',
                        image: Platform.select({
                            ios: 'moon',
                            android: 'ic_menu_add',
                        }),
                        imageColor: colors.primary,
                        state: preferences.colorTheme === 'dark' ? 'on' : 'off',
                    },
                    {
                        id: 'light',
                        title: 'Light',
                        image: Platform.select({
                            ios: 'sun.max',
                            android: 'ic_menu_add',
                        }),
                        imageColor: colors.primary,
                        state: preferences.colorTheme === 'light' ? 'on' : 'off',
                    },
                ]}
                shouldOpenOnLongPress={false}
            >
                <ListItem
                    key={'color-theme'}
                    text='color theme'
                    leftAdornment={
                        <SystemIcon
                            ios={'sun.righthalf.filled'}
                            android={listItems[0].icon[1]}
                            size={24}
                            color={colors.text}
                        />
                    }
                    rightAdornment={
                        <SystemIcon
                            ios='chevron.right'
                            android='chevron-right'
                            size={16}
                            color={colors.text}
                        />
                    }
                />
            </MenuView>
        </Screen>
    );
}
