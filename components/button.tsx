import Text from '@/components/text';
import globalStyles, { colors } from '@/styles/global';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        button: {
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 8,
            backgroundColor: colors.primary,
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            textAlign: 'center',
        },
    }),
};

export default function Button({
    text,
    disabled = false,
    ...props
}: {
    text: string;
    disabled?: boolean;
} & PressableProps) {
    return (
        <Pressable
            style={[styles.button, disabled && { backgroundColor: '#ddd' }]}
            {...props}
            disabled={disabled}
        >
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    );
}
