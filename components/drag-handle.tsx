import { StyleSheet, View, ViewProps } from 'react-native';
import { useColors } from '@/hooks/use-colors';

const useStyles = () => {
    const { colors } = useColors();
    return StyleSheet.create({
        wrapper: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 3,
            width: 9,
        },
        dot: {
            width: 3,
            height: 3,
            borderRadius: 2,
            backgroundColor: colors.text,
        },
    });
};

export default function DragHandle({ color, ...props }: { color?: string } & ViewProps) {
    const styles = useStyles();
    const { colors } = useColors();
    return (
        <View style={styles.wrapper} {...props}>
            {[...Array(6)].map((_, index) => (
                <View key={index} style={[styles.dot, { backgroundColor: color || colors.text }]} />
            ))}
        </View>
    );
}
