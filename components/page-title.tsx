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
                paddingTop: 32,
                paddingBottom: 32,
                paddingHorizontal: 16,
            },
        }),
    };
};

export default function PageTitle({
    children,
    ...rest
}: {
    children: React.ReactNode;
} & ViewProps) {
    const styles = useStyles();
    return (
        <View style={styles.wrapper} {...rest}>
            <Text style={styles.title}>{children}</Text>
        </View>
    );
}
