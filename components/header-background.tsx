import globalStyles from '@/styles/global';
import { StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/use-colors';

const useStyles = () => {
    const colors = useColors();
    return {
        ...globalStyles(colors),
        ...StyleSheet.create({
            spacer: {
                height: 100,
            },
            circle: {
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: [{ translateX: '-60%' }, { scaleX: 2 }],
                width: '125%',
                aspectRatio: 1,
                borderRadius: 9999,
                backgroundColor: colors.sous,
            },
        }),
    };
};

export default function HeadingBackground() {
    const styles = useStyles();

    return (
        <View style={styles.spacer}>
            <View style={styles.circle} />
        </View>
    );
}
