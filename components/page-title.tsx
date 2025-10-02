import Text from '@/components/text';
import globalStyles from '@/styles/global';
import { StyleSheet, View, ViewProps } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        wrapper: {
            display: 'flex',
            flexDirection: 'row',
            paddingTop: 4,
            paddingBottom: 32,
            paddingHorizontal: 16
        }
    })
};

export default function PageTitle({ children, ...rest }: ViewProps) {
    return (
        <View style={styles.wrapper} {...rest}>
            <Text style={styles.title}>{children}</Text>
        </View>
    );
}
