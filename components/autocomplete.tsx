import Pill from '@/components/pill';
import Text from '@/components/text';
import TextInput from '@/components/text-input';
import globalStyles, { colors, fonts } from '@/styles/global';
import { SymbolView } from 'expo-symbols';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedKeyboard,
    useAnimatedStyle,
    useDerivedValue,
    withSpring,
} from 'react-native-reanimated';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        underlay: {
            flex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        wrapper: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            paddingTop: 8,
            paddingHorizontal: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: colors.background,
        },
        headingText: {
            paddingTop: 32,
            paddingBottom: 16,
            fontFamily: fonts.poppins.medium,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        tagWrapper: {
            alignItems: 'flex-start',
            gap: 8,
            paddingBottom: 16,
        },
        closeButton: {
            position: 'absolute',
            top: 40,
            right: 16,
            zIndex: 10,
        },
    }),
};

type AutocompleteProps = {
    open?: boolean;
    label?: string;
    value: string;
    onChange: (text: string) => void;
    onSelect: (item: string) => void;
    onClose?: () => void;
    items?: string[];
};

export default function Autocomplete({
    open = false,
    label,
    value,
    onChange,
    onSelect,
    onClose,
    items = [],
}: AutocompleteProps): ReactElement {
    const keyboard = useAnimatedKeyboard();
    const [height, setHeight] = useState(0);

    const vh = (scale: number) => Dimensions.get('window').height * scale;
    const vw = (scale: number) => Dimensions.get('window').width * scale;

    const keyboardPadding = useDerivedValue(() => {
        const target = open ? keyboard.height.value - 80 : 0;
        return withSpring(target);
    }, [open, keyboard]);

    const inputRef = useRef(null as any);

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        } else {
            inputRef.current?.blur();
        }
    }, [open]);

    const handleClose = () => {
        inputRef.current?.blur();
        onClose?.();
    };

    const animatedPadding = useAnimatedStyle(() => ({
        paddingBottom: keyboardPadding.value,
    }));

    const animatedOpacity = useAnimatedStyle(() => ({
        opacity: withSpring(open ? 1 : 0),
    }));

    const animatedTranslate = useAnimatedStyle(() => ({
        transform: [{ translateY: withSpring(open ? 0 : height) }],
    }));

    const filteredItems = items
        .filter((item) => item.toLowerCase().includes(value.toLowerCase()));

    return (
        <>
            <Animated.View style={[styles.underlay, animatedOpacity]} onTouchEnd={handleClose} />
            <Animated.View
                style={[styles.wrapper, animatedPadding, animatedTranslate]}
                onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
            >
                <Pressable style={styles.closeButton} onPress={handleClose}>
                    <SymbolView
                        name='xmark'
                        size={24}
                        tintColor={colors.text}
                        onTouchEnd={handleClose}
                    />
                </Pressable>
                {label && <Text style={styles.headingText}>{label}</Text>}
                <ScrollView style={{ maxHeight: vh(0.25) }} keyboardShouldPersistTaps='handled'>
                    <View style={styles.tagWrapper}>
                        {filteredItems.map((item, i) => (
                            <Pill
                                key={`${item}-pill-${i}`}
                                text={item}
                                icon='pointer.arrow.ipad.rays'
                                tintColor={colors.primary}
                                onPress={() => onSelect(item)}
                            />
                        ))}
                    </View>
                </ScrollView>
                <View style={styles.inputWrapper}>
                    <TextInput
                        ref={inputRef}
                        value={value}
                        onChangeText={onChange}
                        placeholder='search or create...'
                        rightAdornment={{
                            icon: 'plus.circle.fill',
                            disabledIcon: 'circle.dotted',
                            disabled: !value,
                            onPress: () => onSelect(value),
                        }}
                        style={{ marginBottom: 16 }}
                        returnKeyType='done'
                        submitBehavior='submit'
                        onSubmitEditing={(e) => {
                            const text = e.nativeEvent.text.trim();
                            if (text) {
                                onSelect(text);
                            }
                            handleClose();
                        }}
                    />
                </View>
            </Animated.View>
        </>
    );
}
