import Text from '@/components/text';
import globalStyles from '@/styles/global';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import SystemIcon from './system-icon';
import { useColors } from '@/hooks/use-colors';

const useStyles = () => {
    const { colors, brightness } = useColors();
    return {
        ...globalStyles(colors),
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
};

interface PillProps {
    text: string;
    icon?: any[];
    tintColor?: string;
    onPress?: () => void;
}

export default function Pill({
    text,
    icon,
    tintColor,
    onPress,
    ...props
}: PillProps & PressableProps) {
    const styles = useStyles();
    const { colors } = useColors();

    tintColor = tintColor || colors.text;

    return (
        <Pressable style={styles.pill} onPress={onPress} {...props}>
            <Text style={styles.pillText}>{text}</Text>
            {icon && (
                <SystemIcon
                    ios={icon[0]}
                    android={icon[1]}
                    size={24}
                    color={tintColor}
                    style={styles.pillIcon}
                />
            )}
        </Pressable>
    );
}
