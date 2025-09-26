import styles from '@/styles/global';
import { Text as _Text, TextProps } from 'react-native';

export default function Text({ children, ...rest }: TextProps) {
    return (
        <_Text style={styles.text} {...rest}>
            {children}
        </_Text>
    );
}
