import Text from '@/components/text';
import globalStyles, { colors, fonts } from '@/styles/global';
import { TextInput as _TextInput, TextInputProps as _TextInputProps, StyleSheet, View, ViewProps } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        wrapper: {
            display: 'flex',
            // flexGrow: 1,
            width: '100%',
            flexShrink: 1,
            marginBottom: 32
        },
        input: {
            width: '100%',
            margin: 0,
            borderColor: colors.primary,
            borderBottomWidth: 2,
            padding: 16,
            backgroundColor: '#eee',
            fontFamily: fonts.poppins.regular,
            fontSize: 20,
            color: colors.text
        }
    })
};

interface TextInputProps {
    label?: string
}

export default function TextInput({ label, onChangeText, value, style, id, ...rest }: TextInputProps & ViewProps & _TextInputProps) {
    return (
        <View style={[styles.wrapper, style]} {...rest}>
            {label && (<Text size={16} weight='regular'>{label}</Text>)}
            <_TextInput
                id={id}
                style={styles.input}
                onChangeText={onChangeText}
                value={value}
                placeholder="recipe name"
                placeholderTextColor="#ccc"
                autoCapitalize='none'
                {...rest}
            />
        </View>
    );
}
