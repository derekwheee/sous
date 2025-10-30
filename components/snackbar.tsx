import React, { createContext, useCallback, useContext, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import Text from './text';
import SystemIcon from './system-icon';
import { useColors } from '@/hooks/use-colors';

type SnackbarConfig = {
    icon: any[];
    backgroundColor: string;
    textColor: string;
};

interface SnackbarConfigs {
    [key: string]: SnackbarConfig;
}

const snackbarConfigs: (colors: Palette) => SnackbarConfigs = (colors) => ({
    success: {
        icon: ['checkmark.circle', 'check-circle'],
        backgroundColor: 'rgb(68, 132, 86)',
        textColor: colors.surface,
    },
    error: {
        icon: ['exclamationmark.triangle', 'error-circle'],
        backgroundColor: 'rgb(200, 72, 86)',
        textColor: colors.surface,
    },
    warning: {
        icon: ['info.square', 'warning-amber'],
        backgroundColor: 'rgb(242, 180, 71)',
        textColor: colors.text,
    },
    info: {
        icon: ['info.circle', 'info-outline'],
        backgroundColor: 'rgb(49, 113, 220)',
        textColor: colors.surface,
    },
});

type SnackbarContextType = {
    showSnackbar: ({ message, type }: { message: string; type?: keyof SnackbarConfigs }) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const colors = useColors();
    const _snackbarConfigs = snackbarConfigs(colors);
    const [message, setMessage] = useState<string>();
    const [type, setType] = useState<keyof SnackbarConfigs>('info');
    const [visible, setVisible] = useState(false);
    const [translate] = useState(new Animated.Value(0));
    const [height, setHeight] = useState(0);

    const showSnackbar = useCallback(
        ({ message, type = 'info' }: { message: string; type?: keyof SnackbarConfigs }) => {
            setMessage(message);
            setType(type);
            setVisible(true);

            Animated.timing(translate, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                Animated.timing(translate, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => setVisible(false));
            }, 2500);
        },
        [translate]
    );

    const hideSnackbar = useCallback(() => {
        Animated.timing(translate, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setMessage('');
            setType('info');
            setVisible(false);
        });
    }, [translate]);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            {visible && (
                <Animated.View
                    style={[
                        styles.snackbarWrapper,
                        {
                            transform: [
                                {
                                    translateY: translate.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [(height || 120) * -1, 0],
                                    }),
                                },
                            ],
                            backgroundColor: _snackbarConfigs[type].backgroundColor,
                        },
                    ]}
                >
                    <Pressable
                        style={styles.snackbar}
                        onPress={hideSnackbar}
                        onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
                    >
                        <SystemIcon
                            ios={_snackbarConfigs[type].icon[0]}
                            android={_snackbarConfigs[type].icon[1]}
                            color={_snackbarConfigs[type].textColor}
                            size={24}
                        />
                        <Text style={[styles.message, { color: _snackbarConfigs[type].textColor }]}>
                            {message}
                        </Text>
                        <SystemIcon
                            ios='xmark'
                            android='close'
                            size={24}
                            style={{ marginLeft: 'auto' }}
                        />
                    </Pressable>
                </Animated.View>
            )}
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

const styles = StyleSheet.create({
    snackbarWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    snackbar: {
        flexDirection: 'row',
        gap: 8,
        borderRadius: 8,
        padding: 16,
        paddingTop: 64,
    },
    message: {
        flexShrink: 1,
        fontSize: 16,
    },
});
