import Heading from '@/components/heading';
import Screen from '@/components/screen';
import Text from '@/components/text';
import globalStyles from '@/styles/global';
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
            padding: 16
        }
    })
};

export default function ProfileScreen() {

    const { signOut } = useClerk()
    const { user } = useUser();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/recipes' as any)
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <Screen>
            <Heading
                title='Profile'
                actions={[{
                    label: 'sign out',
                    icon: 'door.left.hand.open',
                    onPress: () => handleSignOut()
                }]}
            />
            <Pressable onPress={() => router.push('/profile/link')} style={styles.menuItem}>
                <SymbolView name="link" size={24} tintColor="#666" />
                <Text>share household</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/profile/join')} style={styles.menuItem}>
                <SymbolView name="link" size={24} tintColor="#666" />
                <Text>join a household</Text>
            </Pressable>
        </Screen>
    );
}
