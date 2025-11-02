import Text from '@/components/text';
import globalStyles from '@/styles/global';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useColors } from '@/hooks/use-colors';

// TODO: Update this to new pattern
const useStyles = () => {
    const { colors } = useColors();
    return {
        ...globalStyles(colors),
        ...StyleSheet.create({}),
    };
};

interface HeadingProps {
    title: string;
}

export default function Heading({ title, ...rest }: HeadingProps & ViewProps) {
    const styles = useStyles();
    return (
        <View style={styles.heading} {...rest}>
            <Text style={styles.h1}>{title}</Text>
        </View>
    );
}
