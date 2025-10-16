import styles, { fonts } from '@/styles/global';
import { Text as _Text, TextProps as _TextProps } from 'react-native';

interface TextProps {
    size?: number,
    weight?: string,
    align?: 'left' | 'center' | 'right'
}

export default function Text({
    size = 16,
    weight = 'light',
    align = 'left',
    children,
    style,
...rest
}: TextProps & _TextProps) {

    return (
        <_Text style={[
            styles.text,
            {
                fontFamily: fonts.poppins[weight as keyof typeof fonts.poppins],
                fontSize: size,
                textAlign: align
            },
            style
        ]} {...rest}>
            {children}
        </_Text>
    );
}
