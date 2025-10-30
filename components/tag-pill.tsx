import Text from '@/components/text';
import globalStyles, { brightness } from '@/styles/global';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';

const useStyles = () => {
    const colors = useColors();
    return {
        ...globalStyles(colors),
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
                color: colors.text,
            },
            pillTextActive: {
                color: colors.surface,
            },
        }),
    };
};

export default function TagPill({
    text = '',
    isActive = false,
    ...props
}: {
    text?: string;
    isActive?: boolean;
} & PressableProps) {
    const styles = useStyles();
    return (
        <Pressable style={[styles.pill, isActive && styles.pillActive]} {...props}>
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{text}</Text>
        </Pressable>
    );
}
