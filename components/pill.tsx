import Text from '@/components/text';
import globalStyles, { brightness, colors } from '@/styles/global';
import { SymbolView } from 'expo-symbols';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        pill: {
            flexShrink: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: brightness(colors.background, -10),
            paddingLeft: 12,
            paddingRight: 4,
            paddingVertical: 4,
            borderRadius: 32,
        },
        pillText: {
            paddingRight: 8,
        },
        pillIcon: {
            marginLeft: -4,
        },
    }),
};

interface PillProps {
    text: string;
    icon?: any;
    tintColor?: string;
    onPress?: () => void;
}

export default function Pill({
    text,
    icon,
    tintColor = colors.text,
    onPress,
    ...props
}: PillProps & PressableProps) {
    return (
        <Pressable style={styles.pill} onPress={onPress} {...props}>
            <Text style={styles.pillText}>{text}</Text>
            {icon && (
                <SymbolView name={icon} size={24} tintColor={tintColor} style={styles.pillIcon} />
            )}
        </Pressable>
    );
}
