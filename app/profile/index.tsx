import Heading from '@/components/heading';
import Screen from '@/components/screen';
import globalStyles from '@/styles/global';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({

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
        </Screen>
    );
}
