import { colors } from '@/styles/global';
import { StyleSheet, View, ViewProps } from 'react-native';

export default function DragHandle({
    color = colors.text,
    ...props
}: { color?: string } & ViewProps) {
    return (
        <View style={styles.wrapper} {...props}>
            {[...Array(6)].map((_, index) => (
                <View key={index} style={[styles.dot, { backgroundColor: color }]} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: 'black',
    },
});
