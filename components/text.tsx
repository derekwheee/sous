import styles, { fonts } from '@/styles/global';
import { Text as _Text, TextProps as _TextProps } from 'react-native';
import { useColors } from '@/hooks/use-colors';

// TODO: Update this to new pattern
const useStyles = () => {
    const { colors } = useColors();
    return styles(colors);
};

interface TextProps {
    size?: number;
    weight?: string;
    align?: 'left' | 'center' | 'right';
}

export default function Text({
    size = 16,
    weight = 'light',
    align = 'left',
    children,
    style,
    ...rest
}: TextProps & _TextProps) {
    const styles = useStyles();
    return (
        <_Text
            style={[
                styles.text,
                {
                    fontFamily: fonts.poppins[weight as keyof typeof fonts.poppins],
                    fontSize: size,
                    textAlign: align,
                },
                style,
            ]}
            {...rest}
        >
            {children}
        </_Text>
    );
}
