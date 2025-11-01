import { Platform, StyleProp } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';

interface SystemIconProps {
    ios: any;
    android: any;
    size?: number;
    color?: string;
    style?: StyleProp<any>;
    onPress?: () => void;
}

export default function SystemIcon({
    ios,
    android,
    size = 24,
    color,
    style,
    onPress,
}: SystemIconProps) {
    const { colors } = useColors();

    color = color || colors.text;

    if (Platform.OS === 'ios') {
        return (
            <SymbolView
                name={ios}
                size={size}
                tintColor={color}
                style={style}
                onTouchEnd={onPress}
            />
        );
    }

    if (Platform.OS === 'android') {
        const name = android;

        const glyphMap = MaterialIcons.getRawGlyphMap?.() ?? MaterialIcons.glyphMap;

        if (!name || !glyphMap || !Object.prototype.hasOwnProperty.call(glyphMap, name)) {
            const communityGlyphMap =
                MaterialCommunityIcons.getRawGlyphMap?.() ?? MaterialCommunityIcons.glyphMap;

            if (
                !communityGlyphMap ||
                !Object.prototype.hasOwnProperty.call(communityGlyphMap, name)
            ) {
                return (
                    <MaterialIcons
                        name='help-outline'
                        size={size}
                        color={color}
                        style={style}
                        onPress={onPress}
                    />
                );
            }
            return (
                <MaterialCommunityIcons
                    name={name as any}
                    size={size}
                    color={color}
                    style={style}
                    onPress={onPress}
                />
            );
        }
        return (
            <MaterialIcons
                name={name as any}
                size={size}
                color={color}
                style={style}
                onPress={onPress}
            />
        );
    }
}
