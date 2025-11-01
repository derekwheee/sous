import Text from '@/components/text';
import { usePrevious } from '@/hooks/use-previous';
import globalStyles from '@/styles/global';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Spinner } from 'tamagui';
import SystemIcon from './system-icon';
import { useColors } from '@/hooks/use-colors';

const useStyles = () => {
    const { colors } = useColors();
    return {
        ...globalStyles(colors),
        ...StyleSheet.create({}),
    };
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
    const styles = useStyles();
    const { colors } = useColors();
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
                <Spinner size='small' color={colors.text} style={{ padding: 2 }} />
            )}
            {!showSuccess && !isSaving && (
                <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>save</Text>
            )}
            {showSuccess && (
                <SystemIcon ios='checkmark' android='check' size={24} color={colors.surface} />
            )}
        </Pressable>
    );
}
