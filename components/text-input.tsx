import Text from '@/components/text';
import globalStyles, { brightness, colors, fonts } from '@/styles/global';
import {
    TextInput as _TextInput,
    TextInputProps as _TextInputProps,
    StyleSheet,
    View,
    ViewProps,
} from 'react-native';
import SystemIcon from './system-icon';

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
                    <SystemIcon
                        ios={
                            leftAdornment.disabled
                                ? leftAdornment.disabledIcon || 'circle.dotted'
                                : leftAdornment.icon || 'circle'
                        }
                        android={
                            leftAdornment.disabled
                                ? leftAdornment.disabledIcon || 'dots-circle'
                                : leftAdornment.icon || 'circle-outline'
                        }
                        size={40}
                        color={
                            leftAdornment.disabled
                                ? leftAdornment.disabledTintColor ||
                                  brightness(colors.background, -100)
                                : leftAdornment.tintColor || colors.primary
                        }
                        style={styles.adornmentRight}
                        onPress={leftAdornment.onPress}
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
                    <SystemIcon
                        ios={
                            rightAdornment.disabled
                                ? rightAdornment.disabledIcon || 'arrow.right.circle.dotted'
                                : rightAdornment.icon || 'arrow.right.circle.fill'
                        }
                        android={
                            rightAdornment.disabled
                                ? rightAdornment.disabledIcon || 'arrow-right-circle-outline'
                                : rightAdornment.icon || 'arrow-right-circle'
                        }
                        size={40}
                        color={
                            rightAdornment.disabled
                                ? rightAdornment.disabledTintColor ||
                                  brightness(colors.background, -100)
                                : rightAdornment.tintColor || colors.primary
                        }
                        style={styles.adornmentRight}
                        onPress={rightAdornment.onPress}
                    />
                )}
            </View>
        </View>
    );
}
