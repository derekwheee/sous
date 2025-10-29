import Text from '@/components/text';
import globalStyles, { colors } from '@/styles/global';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        wrapper: {
            display: 'flex',
            flexDirection: 'row',
            paddingTop: 32,
            paddingBottom: 32,
            paddingHorizontal: 16,
        },
        actionChipWrapper: {
            flexDirection: 'row',
            gap: 8,
            marginLeft: 'auto',
        },
        actionChip: {
            width: 40,
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 8,
            borderRadius: 24,
            backgroundColor: colors.primary,
        },
        actionChipText: {
            paddingLeft: 4,
            color: 'white',
        },
    }),
};

export default function PageTitle({
    actions,
    children,
    ...rest
}: {
    actions?: {
        label?: string;
        icon: any;
        nudge?: number;
        onPress: () => void;
    }[];
    children: React.ReactNode;
} & ViewProps) {
    return (
        <View style={styles.wrapper} {...rest}>
            <Text style={styles.title}>{children}</Text>
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
        </View>
    );
}
