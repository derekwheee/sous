import Button from '@/components/button';
import Screen from '@/components/screen';
import Text from '@/components/text';
import TextInput from '@/components/text-input';
import { useApi } from '@/hooks/use-api';
import globalStyles, { brightness, colors, fonts } from '@/styles/global';
import { useSSO, useSignIn } from '@clerk/clerk-expo';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { XStack, YStack } from 'tamagui';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        wrapper: {
            flex: 1,
            justifyContent: 'center',
            gap: 16,
            paddingHorizontal: 16,
        },
        welcomeText: {
            fontFamily: fonts.poppins.medium,
            fontSize: 14,
            textAlign: 'center',
            color: colors.primary,
        },
        welcomeLogo: {
            marginBottom: 16,
            fontFamily: fonts.caprasimo,
            fontSize: 64,
            lineHeight: 58,
            textAlign: 'center',
        },
        appleButton: {
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            padding: 16,
            borderRadius: 99,
            backgroundColor: '#000',
        },
        appleButtonText: {
            fontFamily: fonts.poppins.medium,
            color: '#fff',
            fontSize: 16,
        },
        googleButton: {
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            padding: 16,
            borderRadius: 99,
            backgroundColor: '#ddd',
        },
        googleButtonText: {
            fontFamily: fonts.poppins.medium,
            color: '#000',
            fontSize: 16,
        },
        separator: {
            flexGrow: 1,
            height: 1,
            backgroundColor: brightness(colors.text, 100),
        },
        separatorText: {
            fontFamily: fonts.poppins.regular,
            color: brightness(colors.text, 100),
        },
    }),
};

export const useWarmUpBrowser = () => {
    useEffect(() => {
        if (Platform.OS !== 'android') return;
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    useWarmUpBrowser();

    const { signIn, setActive, isLoaded } = useSignIn();
    const { startSSOFlow } = useSSO();
    const { syncUser } = useApi();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onPress = useCallback(
        async (strategy: 'oauth_google' | 'oauth_apple') => {
            try {
                const { createdSessionId, setActive } = await startSSOFlow({
                    strategy,
                    redirectUrl: AuthSession.makeRedirectUri(),
                });

                if (!createdSessionId) {
                    console.error('No session created');
                    return;
                }

                setActive!({
                    session: createdSessionId,
                    navigate: async () => {
                        await syncUser();
                        router.push('/recipes' as any);
                    },
                });
            } catch (err) {
                console.error(JSON.stringify(err, null, 2));
            }
        },
        [router, startSSOFlow, syncUser]
    );

    const handleLogin = useCallback(async () => {
        if (!isLoaded) return;

        try {
            const signInAttempt = await signIn.create({
                identifier: username,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({
                    session: signInAttempt.createdSessionId,
                    navigate: async ({ session }) => {
                        if (session?.currentTask) {
                            console.log(session?.currentTask);
                            return;
                        }

                        await syncUser();
                        router.replace('/recipes');
                    },
                });
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    }, [isLoaded, username, password, signIn, setActive, router, syncUser]);

    return (
        <Screen>
            <View style={styles.wrapper}>
                <Text style={styles.welcomeText}>welcome to</Text>
                <Text style={styles.welcomeLogo}>sous</Text>
                <XStack gap={8}>
                    <Pressable style={styles.appleButton} onPress={() => onPress('oauth_apple')}>
                        <SymbolView
                            name='apple.logo'
                            style={{ width: 24, height: 24 }}
                            type='palette'
                            tintColor={'#fff'}
                        />
                        <Text style={styles.appleButtonText}>Apple</Text>
                    </Pressable>
                    <Pressable style={styles.googleButton} onPress={() => onPress('oauth_google')}>
                        <AntDesign name='google' size={24} color='#000' />
                        <Text style={styles.googleButtonText}>Google</Text>
                    </Pressable>
                </XStack>
                <XStack alignItems='center' gap={8} padding={8}>
                    <View style={styles.separator} />
                    <Text style={styles.separatorText}>or</Text>
                    <View style={styles.separator} />
                </XStack>
                <YStack>
                    <TextInput
                        label='username'
                        placeholder='username'
                        autoCapitalize='none'
                        keyboardType='email-address'
                        textContentType='emailAddress'
                        onChangeText={setUsername}
                        value={username}
                    />
                    <TextInput
                        label='password'
                        placeholder='password'
                        secureTextEntry
                        textContentType='password'
                        onChangeText={setPassword}
                        value={password}
                    />
                    <Button text='Log In' onPress={handleLogin} disabled={!username || !password} />
                </YStack>
            </View>
        </Screen>
    );
}
