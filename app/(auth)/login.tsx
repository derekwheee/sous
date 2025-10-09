import Screen from '@/components/screen'
import Text from '@/components/text'
import globalStyles, { colors, fonts } from '@/styles/global'
import { useSSO } from '@clerk/clerk-expo'
import AntDesign from '@expo/vector-icons/AntDesign'
import * as AuthSession from 'expo-auth-session'
import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import * as WebBrowser from 'expo-web-browser'
import React, { useCallback, useEffect } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        wrapper: {
            flex: 1,
            gap: 16,
            paddingTop: 200,
            paddingHorizontal: 16
        },
        welcomeText: {
            fontFamily: fonts.poppins.medium,
            fontSize: 14,
            textAlign: 'center',
            color: colors.primary
        },
        welcomeLogo: {
            marginBottom: 32,
            fontFamily: fonts.caprasimo,
            fontSize: 64,
            lineHeight: 58,
            textAlign: 'center'
        },
        appleButton: {
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
            fontSize: 16
        },
        googleButton: {
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
            fontSize: 16
        }
    })
};

export const useWarmUpBrowser = () => {
    useEffect(() => {
        if (Platform.OS !== 'android') return
        void WebBrowser.warmUpAsync()
        return () => {
            void WebBrowser.coolDownAsync()
        }
    }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function Page() {
    useWarmUpBrowser();

    const { startSSOFlow } = useSSO();
    const router = useRouter();

    const onPress = useCallback(async (strategy: 'oauth_google' | 'oauth_apple') => {
        try {
            const { createdSessionId, setActive } = await startSSOFlow({
                strategy,
                redirectUrl: AuthSession.makeRedirectUri(),
            })

            if (createdSessionId) {
                setActive!({
                    session: createdSessionId,
                    navigate: async () => {
                        router.push('/recipes' as any)
                    },
                })
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }
    }, [])

    return (
        <Screen>
            <View style={styles.wrapper}>
                <Text style={styles.welcomeText}>welcome to</Text>
                <Text style={styles.welcomeLogo}>sous</Text>
                <Pressable style={styles.appleButton} onPress={() => onPress('oauth_apple')}>
                    <SymbolView
                        name='apple.logo'
                        style={{ width: 24, height: 24 }}
                        type='palette'
                        tintColor={'#fff'}
                    />
                    <Text style={styles.appleButtonText}>Sign in with Apple</Text>
                </Pressable>
                <Pressable style={styles.googleButton} onPress={() => onPress('oauth_google')}>
                    <AntDesign name='google' size={24} color='#000' />
                    <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </Pressable>
            </View>
        </Screen>
    )
}