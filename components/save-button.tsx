import Text from '@/components/text';
import { usePrevious } from '@/hooks/use-previous';
import globalStyles, { colors } from '@/styles/global';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Spinner } from 'tamagui';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({}),
};

export default function SaveButton({
    onPressSave,
    disabled,
    isSaving,
    ...props
}: {
    onPressSave: () => void;
    disabled: boolean;
    isSaving: boolean;
    props?: React.ComponentProps<typeof Pressable>;
}) {
    const [showSuccess, setShowSuccess] = useState(false);
    const previousProps = usePrevious<{ disabled: boolean; isSaving: boolean } | null>({
        disabled,
        isSaving,
    });

    useEffect(() => {
        if (previousProps?.isSaving && !isSaving) {
            setShowSuccess(true);
            const timeout = setTimeout(() => {
                setShowSuccess(false);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [isSaving, previousProps]);

    return (
        <Pressable
            style={[
                styles.button,
                !showSuccess && disabled && styles.buttonDisabled,
                { width: 96 },
            ]}
            disabled={disabled}
            {...props}
            onPress={onPressSave}
        >
            {!showSuccess && isSaving && (
                <Spinner size='small' color='#000' style={{ padding: 2 }} />
            )}
            {!showSuccess && !isSaving && (
                <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>save</Text>
            )}
            {showSuccess && <SymbolView name='checkmark' size={24} tintColor={colors.background} />}
        </Pressable>
    );
}
