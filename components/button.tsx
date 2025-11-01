import Text from '@/components/text';
import globalStyles, { fonts } from '@/styles/global';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import SystemIcon from './system-icon';
import { useColors } from '@/hooks/use-colors';

const useStyles = () => {
    const { colors } = useColors();
    return {
        ...globalStyles(colors),
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
                color: colors.surface,
                fontFamily: fonts.poppins.medium,
                fontSize: 16,
                textAlign: 'center',
            },
            outlinedText: {
                color: colors.primary,
            },
            inverted: {
                borderColor: colors.surface,
                backgroundColor: colors.surface,
            },
            outlinedInverted: {
                borderColor: colors.surface,
                backgroundColor: 'transparent',
            },
            invertedText: {
                color: colors.primary,
            },
            outlinedInvertedText: {
                color: colors.surface,
            },
        }),
    };
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
    const styles = useStyles();
    const { colors, brightness } = useColors();

    return (
        <Pressable
            style={[
                styles[variant],
                outlined && styles.outlined,
                disabled && { backgroundColor: brightness(colors.background, -20) },
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
                    color={outlined ? colors.primary : colors.surface}
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
                    color={outlined ? colors.primary : colors.surface}
                />
            )}
        </Pressable>
    );
}
