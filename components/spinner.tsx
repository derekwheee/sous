import { useColors } from '@/hooks/use-colors';
import { ActivityIndicator, View, ViewProps } from 'react-native';

export default function Spinner({
    size = 'large',
    color,
    ...props
}: {
    size?: number | 'small' | 'large';
    color?: string;
    props?: ViewProps;
}) {
    const { colors } = useColors();

    color = color || colors.surface;

    return (
        <View {...props}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
}
