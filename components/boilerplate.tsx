import Divider from '@/components/divider';
import { fonts } from '@/styles/global';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useStyles } from '@/hooks/use-style';

// TODO: Update this to new pattern
const moduleStyles: CreateStyleFunc = (colors, brightness, opacity) => ({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    text: {
        fontFamily: fonts.poppins.regular,
        color: colors.text,
    },
    divider: {
        backgroundColor: brightness(colors.background, -40),
    },
});

export default function NewScreen() {
    const { someParam } = useLocalSearchParams<{ someParam: string }>();

    const { styles } = useStyles(moduleStyles);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>This component is brand new</Text>
            <Divider style={styles.divider} />
            <Text style={styles.text}>Param: {someParam}</Text>
        </View>
    );
}
