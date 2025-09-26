import styles from '@/styles/global';
import { Text as _Text, TextProps } from 'react-native';

export default function Text({ children, style, ...rest }: TextProps) {
    return (
        <_Text style={[styles.text, style]} {...rest}>
            {children}
        </_Text>
    );
}
