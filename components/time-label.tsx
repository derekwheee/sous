import Text from '@/components/text';
import globalStyles from '@/styles/global';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useColors } from '@/hooks/use-colors';

const useStyles = () => {
    const { colors } = useColors();
    return {
        ...globalStyles(colors),
        ...StyleSheet.create({
            wrapper: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
            },
        }),
    };
};

interface TimeLabelProps {
    label: string;
    time: string;
}

export default function Ingredient({ label, time, ...rest }: TimeLabelProps & ViewProps) {
    const styles = useStyles();
    return (
        <View style={styles.wrapper} {...rest}>
            <Text size={12} weight='bold'>
                {label}
            </Text>
            <Text>{time}</Text>
        </View>
    );
}
