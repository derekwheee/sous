import HeaderSpacer from '@/components/header-spacer';
import Loading from '@/components/loading';
import Text from '@/components/text';
import globalStyles, { colors } from '@/styles/global';
import { SymbolView } from 'expo-symbols';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    ScrollViewProps,
    StyleSheet,
    View,
} from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        contentWrapper: {
            flex: 1,
        },
        actionChipWrapper: {
            position: 'absolute',
            top: 64,
            right: 16,
            flexDirection: 'row',
            gap: 8,
            marginLeft: 'auto',
            zIndex: 10,
        },
        actionChip: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 8,
            borderRadius: 24,
            backgroundColor: colors.primary,
        },
        actionChipText: {
            paddingLeft: 4,
            fontSize: 16,
            color: 'white',
        },
    }),
};

export default function Screen({
    isLoading = false,
    actions,
    children,
    ref,
    ...props
}: {
    isLoading?: boolean;
    actions?: {
        label?: string;
        icon: any;
        nudge?: number;
        onPress: () => void;
    }[];
    children: React.ReactNode;
    ref?: React.Ref<any>;
} & ScrollViewProps) {
    return (
        <>
            <Loading isLoading={isLoading} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {actions && actions.length > 0 && (
                    <View style={styles.actionChipWrapper}>
                        {actions.map(({ label, icon, nudge, onPress }, i) => (
                            <Pressable key={i} style={styles.actionChip} onPress={onPress}>
                                {label && <Text style={styles.actionChipText}>{label}</Text>}
                                <SymbolView
                                    name={icon}
                                    style={{
                                        width: 24,
                                        height: 24,
                                        position: 'relative',
                                        top: nudge ?? 0,
                                    }}
                                    type='palette'
                                    tintColor={'white'}
                                />
                            </Pressable>
                        ))}
                    </View>
                )}
                <ScrollView {...props} ref={ref} contentContainerStyle={{ flexGrow: 1 }}>
                    <HeaderSpacer />
                    {children}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}
