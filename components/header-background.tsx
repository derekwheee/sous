import globalStyles, { colors } from '@/styles/global';
import { StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        spacer: {
            height: 100
        },
        circle: {
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: [{ translateX: '-60%' }, { scaleX: 2 }],
            width: '125%',
            aspectRatio: 1,
            borderRadius: 9999,
            backgroundColor: colors.sous
        }
    })
};

export default function HeadingBackground() {
    return (
        <View style={styles.spacer}>
            <View style={styles.circle} />
        </View>
    );
}
