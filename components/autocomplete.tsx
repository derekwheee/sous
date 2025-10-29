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
            zIndex: 300000,
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
    mode?: 'select' | 'create';
    keyboardOffset?: number;
    label?: string;
    value: string;
    onChange: (text: string) => void;
    onSelect: (item: string, close: () => void) => void;
    onClose?: () => void;
    items?: string[] | { label: string; value: string }[];
};

export default function Autocomplete({
    open = false,
    mode = 'create',
    keyboardOffset = -80,
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

    const keyboardPadding = useDerivedValue(() => {
        const target = open ? keyboard.height.value + keyboardOffset : 0;
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

    items = items
        .map<{ label: string; value: string }>((item) => ({
            label: item instanceof Object ? item.label : (item as string),
            value: item instanceof Object ? item.value : (item as string),
        }))
        .sort((a, b) => a.value.localeCompare(b.value));

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

    const filteredItems = items.filter(
        (item) =>
            item.label.toLowerCase().includes(value.toLowerCase()) ||
            item.value.toLowerCase().includes(value.toLowerCase())
    );

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
                <ScrollView style={{ maxHeight: vh(0.3) }} keyboardShouldPersistTaps='handled'>
                    <View style={styles.tagWrapper}>
                        {filteredItems.map((item, i) => (
                            <Pill
                                key={`${item}-pill-${i}`}
                                text={item.label}
                                icon='pointer.arrow.ipad.rays'
                                tintColor={colors.primary}
                                onPress={() => onSelect(item.value, handleClose)}
                            />
                        ))}
                    </View>
                </ScrollView>
                <View style={styles.inputWrapper}>
                    <TextInput
                        ref={inputRef}
                        value={value}
                        onChangeText={onChange}
                        placeholder={mode === 'create' ? 'search or create...' : 'search...'}
                        rightAdornment={{
                            icon: mode === 'create' ? 'plus.circle.fill' : 'magnifyingglass.circle',
                            disabledIcon:
                                mode === 'create' ? 'circle.dotted' : 'magnifyingglass.circle',
                            disabled: mode === 'create' ? !value : false,
                            onPress:
                                mode === 'create' ? () => onSelect(value, handleClose) : undefined,
                        }}
                        style={{ marginBottom: 16 }}
                        returnKeyType={mode === 'create' ? 'done' : 'default'}
                        submitBehavior='submit'
                        onSubmitEditing={(e) => {
                            const text = e.nativeEvent.text.trim();
                            if (text) {
                                onSelect(text, handleClose);
                            }
                            handleClose();
                        }}
                    />
                </View>
            </Animated.View>
        </>
    );
}
