import globalStyles, { brightness } from '@/styles/global';
import { StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/use-colors';

const useStyles = () => {
    const colors = useColors();
    return {
        ...globalStyles(colors),
        ...StyleSheet.create({
            list: {
                gap: 1,
                backgroundColor: brightness(colors.background, -20),
            },
        }),
    };
};

interface ListProps {
    children?: React.ReactNode;
}

export default function List({ children }: ListProps) {
    const styles = useStyles();
    return <View style={styles.list}>{children}</View>;
}
