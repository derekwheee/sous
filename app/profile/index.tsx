import Heading from '@/components/heading';
import Screen from '@/components/screen';
import Text from '@/components/text';
import globalStyles, { fonts } from '@/styles/global';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
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
            paddingBottom: 32,
            paddingHorizontal: 16,
            fontSize: 56,
            lineHeight: 60,
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

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/recipes' as any);
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    return (
        <Screen
            actions={[
                {
                    label: 'sign out',
                    icon: 'door.left.hand.open',
                    onPress: () => handleSignOut(),
                },
            ]}
        >
            <Heading title='welcome,' />
            <Text style={styles.userName}>{user?.firstName || 'friend'}</Text>
            <Text style={styles.sectionHeading}>household</Text>
            <Pressable onPress={() => router.push('/profile/link')} style={styles.menuItem}>
                <SymbolView name='qrcode' size={24} tintColor='#000' />
                <Text size={16}>share household</Text>
                <SymbolView
                    name='chevron.right'
                    size={16}
                    tintColor='#000'
                    style={{ marginLeft: 'auto' }}
                />
            </Pressable>
            <Pressable onPress={() => router.push('/profile/join')} style={styles.menuItem}>
                <SymbolView name='qrcode.viewfinder' size={24} tintColor='#000' />
                <Text size={16}>join a household</Text>
                <SymbolView
                    name='chevron.right'
                    size={16}
                    tintColor='#000'
                    style={{ marginLeft: 'auto' }}
                />
            </Pressable>
        </Screen>
    );
}
