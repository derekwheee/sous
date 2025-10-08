import globalStyles from '@/styles/global';
import { StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        spacer: {
            height: 100
        }
    })
};

export default function HeaderSpacer() {
    return (
        <View style={styles.spacer} />
    );
}
