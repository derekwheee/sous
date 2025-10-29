import { ActivityIndicator, View, ViewProps } from 'react-native';

export default function Spinner({
    size = 'large',
    color = '#fff',
    ...props
}: {
    size?: number | 'small' | 'large';
    color?: string;
    props?: ViewProps;
}) {
    return (
        <View {...props}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
}
