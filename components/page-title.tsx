import Text from '@/components/text';
import globalStyles, { colors } from '@/styles/global';
import { StyleSheet, View, ViewProps } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        wrapper: {
            display: 'flex',
            flexDirection: 'row',
            paddingTop: 32,
            paddingBottom: 32,
            paddingHorizontal: 16,
        },
        actionChipWrapper: {
            flexDirection: 'row',
            gap: 8,
            marginLeft: 'auto',
        },
        actionChip: {
            width: 40,
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 8,
            borderRadius: 24,
            backgroundColor: colors.primary,
        },
        actionChipText: {
            paddingLeft: 4,
            color: 'white',
        },
    }),
};

export default function PageTitle({
    children,
    ...rest
}: {
    children: React.ReactNode;
} & ViewProps) {
    return (
        <View style={styles.wrapper} {...rest}>
            <Text style={styles.title}>{children}</Text>
        </View>
    );
}
