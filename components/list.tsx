import global, { brightness, colors } from '@/styles/global';
import { StyleSheet, View } from 'react-native';

const styles = {
    ...global,
    ...StyleSheet.create({
        list: {
            gap: 1,
            backgroundColor: brightness(colors.background, -20),
        },
    }),
};

interface ListProps {
    children?: React.ReactNode;
}

export default function List({ children }: ListProps) {

    return (
        <View style={styles.list}>
            {children}
        </View>
    );
}
