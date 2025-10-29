import Text from '@/components/text';
import globalStyles from '@/styles/global';
import { StyleSheet, View, ViewProps } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({}),
};

interface HeadingProps {
    title: string;
}

export default function Heading({ title, ...rest }: HeadingProps & ViewProps) {
    return (
        <View style={styles.heading} {...rest}>
            <Text style={styles.h1}>{title}</Text>
        </View>
    );
}
