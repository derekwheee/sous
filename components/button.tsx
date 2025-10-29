import Text from '@/components/text';
import globalStyles, { colors, fonts } from '@/styles/global';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import SystemIcon from './system-icon';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        button: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 8,
            backgroundColor: colors.primary,
        },
        pill: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 9999,
            borderWidth: 2,
            borderColor: colors.primary,
            backgroundColor: colors.primary,
        },
        outlined: {
            borderWidth: 2,
            borderColor: colors.primary,
            backgroundColor: 'transparent',
        },
        buttonText: {
            color: '#fff',
            fontFamily: fonts.poppins.medium,
            fontSize: 16,
            textAlign: 'center',
        },
        outlinedText: {
            color: colors.primary,
        },
        inverted: {
            borderColor: '#fff',
            backgroundColor: '#fff',
        },
        outlinedInverted: {
            borderColor: '#fff',
            backgroundColor: 'transparent',
        },
        invertedText: {
            color: colors.primary,
        },
        outlinedInvertedText: {
            color: '#fff',
        },
    }),
};

export default function Button({
    text,
    invert = false,
    outlined = false,
    variant = 'button',
    disabled = false,
    leftIcon,
    rightIcon,
    style = {},
    ...props
}: {
    text: string;
    invert?: boolean;
    outlined?: boolean;
    variant?: 'button' | 'pill';
    disabled?: boolean;
    leftIcon?: any[];
    rightIcon?: any[];
    style?: object;
} & PressableProps) {
    return (
        <Pressable
            style={[
                styles[variant],
                outlined && styles.outlined,
                disabled && { backgroundColor: '#ddd' },
                invert && styles.inverted,
                invert && outlined && styles.outlinedInverted,
                { ...style },
            ]}
            {...props}
            disabled={disabled}
        >
            {leftIcon && (
                <SystemIcon
                    ios={leftIcon[0]}
                    android={leftIcon[1]}
                    size={variant === 'pill' ? 16 : 24}
                    color={outlined ? colors.primary : '#fff'}
                />
            )}
            <Text
                style={[
                    styles.buttonText,
                    outlined && styles.outlinedText,
                    invert && styles.invertedText,
                    invert && outlined && styles.outlinedInvertedText,
                ]}
            >
                {text}
            </Text>
            {rightIcon && (
                <SystemIcon
                    ios={rightIcon[0]}
                    android={rightIcon[1]}
                    size={variant === 'pill' ? 16 : 24}
                    color={outlined ? colors.primary : '#fff'}
                />
            )}
        </Pressable>
    );
}
