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
            backgroundColor: colors.primary
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            textAlign: 'center'
        }
    })
};

export default function Button({
    text,
    ...props
}: {
    text: string;
} & PressableProps) {
    return (
        <Pressable style={styles.button} {...props}>
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    );
}