import styles, { fonts } from '@/styles/global';
import { Text as _Text, TextProps as _TextProps } from 'react-native';

interface TextProps {
    size?: number,
    weight?: string
}

export default function Text({ size = 14, weight = 'light', children, style, ...rest }: TextProps & _TextProps) {

    return (
        <_Text style={[
            styles.text,
            {
                fontFamily: fonts.poppins[weight as keyof typeof fonts.poppins],
                fontSize: size
            },
            style
        ]} {...rest}>
            {children}
        </_Text>
    );
}
