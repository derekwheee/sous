import Text from '@/components/text';
import globalStyles, { brightness, colors, fonts } from '@/styles/global';
import { SymbolView } from 'expo-symbols';
import {
    TextInput as _TextInput,
    TextInputProps as _TextInputProps,
    StyleSheet,
    View,
    ViewProps,
} from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        wrapper: {
            display: 'flex',
            width: '100%',
            flexShrink: 1,
            marginBottom: 32,
        },
        input: {
            width: '100%',
            margin: 0,
            borderColor: colors.primary,
            borderBottomWidth: 2,
            padding: 16,
            backgroundColor: '#eee',
            fontFamily: fonts.poppins.regular,
            fontSize: 16,
            color: colors.text,
        },
        adornments: {},
        adornmentRight: {
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: [{ translateY: '-50%' }],
        },
    }),
};

interface TextInputProps {
    label?: string;
    ref?: any;
    id?: string;
    rightAdornment?: Adornment;
    leftAdornment?: Adornment;
}

interface Adornment {
    icon?: any;
    tintColor?: string;
    disabled?: boolean;
    disabledIcon?: any;
    disabledTintColor?: string;
    onPress?: () => void;
}

export default function TextInput({
    label,
    ref,
    onChangeText,
    value,
    style,
    id,
    rightAdornment,
    leftAdornment,
    ...rest
}: TextInputProps & ViewProps & _TextInputProps) {
    return (
        <View style={[styles.wrapper, style]} {...rest}>
            {label && (
                <Text size={16} weight='regular'>
                    {label}
                </Text>
            )}
            <View>
                {leftAdornment && (
                    <SymbolView
                        name={
                            leftAdornment.disabled
                                ? leftAdornment.disabledIcon || 'circle.dotted'
                                : leftAdornment.icon || 'circle'
                        }
                        size={40}
                        tintColor={
                            leftAdornment.disabled
                                ? leftAdornment.disabledTintColor ||
                                  brightness(colors.background, -100)
                                : leftAdornment.tintColor || colors.primary
                        }
                        style={styles.adornmentRight}
                        onTouchEnd={leftAdornment.onPress}
                    />
                )}
                <_TextInput
                    ref={ref}
                    id={id}
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={value}
                    placeholderTextColor='#ccc'
                    autoCapitalize='none'
                    {...rest}
                />
                {rightAdornment && (
                    <SymbolView
                        name={
                            rightAdornment.disabled
                                ? rightAdornment.disabledIcon || 'arrow.right.circle.dotted'
                                : rightAdornment.icon || 'arrow.right.circle.fill'
                        }
                        size={40}
                        tintColor={
                            rightAdornment.disabled
                                ? rightAdornment.disabledTintColor ||
                                  brightness(colors.background, -100)
                                : rightAdornment.tintColor || colors.primary
                        }
                        style={styles.adornmentRight}
                        onTouchEnd={rightAdornment.onPress}
                    />
                )}
            </View>
        </View>
    );
}
