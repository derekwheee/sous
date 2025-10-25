import Text from '@/components/text';
import globalStyles, { colors, fonts } from '@/styles/global';
import { SymbolView } from 'expo-symbols';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

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
    }),
};

export default function Button({
    text,
    outlined = false,
    variant = 'button',
    disabled = false,
    leftIcon,
    rightIcon,
    style = {},
    ...props
}: {
    text: string;
    outlined?: boolean;
    variant?: 'button' | 'pill';
    disabled?: boolean;
    leftIcon?: any;
    rightIcon?: any;
    style?: object;
} & PressableProps) {
    return (
        <Pressable
            style={[
                styles[variant],
                outlined && styles.outlined,
                disabled && { backgroundColor: '#ddd' },
                { ...style },
            ]}
            {...props}
            disabled={disabled}
        >
            {leftIcon && (
                <SymbolView
                    name={leftIcon}
                    size={variant === 'pill' ? 16 : 24}
                    tintColor={outlined ? colors.primary : '#fff'}
                />
            )}
            <Text style={[styles.buttonText, outlined && styles.outlinedText]}>{text}</Text>
            {rightIcon && (
                <SymbolView
                    name={rightIcon}
                    size={variant === 'pill' ? 16 : 24}
                    tintColor={outlined ? colors.primary : '#fff'}
                />
            )}
        </Pressable>
    );
}
