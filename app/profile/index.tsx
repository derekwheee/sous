import Heading from '@/components/heading';
import Screen from '@/components/screen';
import SystemIcon from '@/components/system-icon';
import Text from '@/components/text';
import { useHeader } from '@/hooks/use-header';
import globalStyles, { colors, fonts } from '@/styles/global';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

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

    return (
        <Screen>
            <Heading title='welcome,' />
            <Text style={styles.userName}>{user?.firstName || 'friend'}</Text>
            <Pressable onPress={() => router.push('/profile/categories')} style={styles.menuItem}>
                <SystemIcon
                    ios='list.dash'
                    android='format-list-bulleted'
                    size={24}
                    color={colors.text}
                />
                <Text size={16}>categories</Text>
                <SystemIcon
                    ios='chevron.right'
                    android='chevron-right'
                    size={16}
                    color={colors.text}
                    style={{ marginLeft: 'auto' }}
                />
            </Pressable>
            <Pressable onPress={() => router.push('/profile/link')} style={styles.menuItem}>
                <SystemIcon ios='qrcode' android='qrcode' size={24} color={colors.text} />
                <Text size={16}>share household</Text>
                <SystemIcon
                    ios='chevron.right'
                    android='chevron-right'
                    size={16}
                    color={colors.text}
                    style={{ marginLeft: 'auto' }}
                />
            </Pressable>
            <Pressable onPress={() => router.push('/profile/join')} style={styles.menuItem}>
                <SystemIcon
                    ios='qrcode.viewfinder'
                    android='qr-code-scanner'
                    size={24}
                    color={colors.text}
                />
                <Text size={16}>join a household</Text>
                <SystemIcon
                    ios='chevron.right'
                    android='chevron-right'
                    size={16}
                    color={colors.text}
                    style={{ marginLeft: 'auto' }}
                />
            </Pressable>
        </Screen>
    );
}
