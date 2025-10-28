import Divider from '@/components/divider';
import global, { brightness, colors, fonts } from '@/styles/global';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const styles = {
    ...global,
    ...StyleSheet.create({
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
    }
})
};

export default function NewScreen() {
    const { someParam } = useLocalSearchParams<{ someParam: string }>();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>This component is brand new</Text>
            <Divider style={styles.divider} />
            <Text style={styles.text}>Param: {someParam}</Text>
        </View>
    );
}
