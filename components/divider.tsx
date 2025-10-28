import { brightness, colors } from '@/styles/global';
import { StyleSheet, View, ViewProps } from 'react-native';

export default function Divider({
    color = brightness(colors.background, -40),
    ...props
}: ViewProps & { color?: string }) {
    return <View style={[styles.divider, { backgroundColor: color }]} {...props} />;
}

const styles = StyleSheet.create({
    divider: {
        width: '100%',
        height: 1,
    },
});
