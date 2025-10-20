import Text from '@/components/text';
import globalStyles, { brightness, colors } from '@/styles/global';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        pill: {
            paddingVertical: 4,
            paddingHorizontal: 12,
            borderRadius: 32,
            backgroundColor: brightness(colors.green, 40),
        },
        pillActive: {
            backgroundColor: colors.primary,
        },
        pillText: {
            color: '#000'
        },
        pillTextActive: {
            color: '#fff'
        }
    })
};

export default function TagPill({
    text = '',
    isActive = false,
    ...props
}: {
    text?: string,
    isActive?: boolean
} & PressableProps) {
    return (
        <Pressable style={[styles.pill, isActive && styles.pillActive]} {...props}>
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{text}</Text>
        </Pressable>
    );
}