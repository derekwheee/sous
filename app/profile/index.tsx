import Heading from '@/components/heading';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import Screen from '@/components/screen';
import SystemIcon from '@/components/system-icon';
import Text from '@/components/text';
import { useHeader } from '@/hooks/use-header';
import globalStyles, { colors, fonts } from '@/styles/global';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
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
            borderBottomColor: '#ccc',
        },
    }),
};

export default function ProfileScreen() {
    const { signOut } = useClerk();
    const { user } = useUser();
    const router = useRouter();

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
        </Screen>
    );
}
