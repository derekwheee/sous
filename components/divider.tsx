import { StyleSheet, View, ViewProps } from 'react-native';
import { useColors } from '@/hooks/use-colors';

const styles = StyleSheet.create({
    divider: {
        width: '100%',
        height: 1,
    },
});

export default function Divider({ color, ...props }: ViewProps & { color?: string }) {
    const { colors, brightness } = useColors();
    return (
        <View
            style={[
                styles.divider,
                { backgroundColor: color || brightness(colors.background, -40) },
            ]}
            {...props}
        />
    );
}
