import Text from '@/components/text';
import globalStyles, { colors } from '@/styles/global';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        actionChipWrapper: {
            flexDirection: 'row',
            gap: 8,
            marginLeft: 'auto'
        },
        actionChip: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 8,
            borderRadius: 24,
            backgroundColor: colors.primary
        },
        actionChipText: {
            paddingLeft: 4,
            color: 'white'
        }
    })
};

interface HeadingProps {
    title: string;
    actions?: {
        label?: string;
        icon: any;
        onPress: () => void;
    }[];
}

export default function Heading({
    title,
    actions,
    ...rest
}: HeadingProps & ViewProps) {
    return (
        <View style={styles.heading} {...rest}>
            <Text style={styles.h1}>{title}</Text>
            {actions && actions.length > 0 && (
                <View style={styles.actionChipWrapper}>
                    {actions.map(({ label, icon, onPress }, i) => (
                        <Pressable key={i} style={styles.actionChip} onPress={onPress}>
                            {label && <Text style={styles.actionChipText}>{label}</Text>}
                            <SymbolView
                                name={icon}
                                style={{ width: 20, height: 20 }}
                                type="palette"
                                tintColor={'white'}
                            />
                        </Pressable>
                    ))}
                </View>
            )}

            {/* {!!linkTo && (
                <Link href={linkTo} style={{ marginLeft: 'auto' }}>
                    <View style={styles.linkWrapper}>
                        <Text style={styles.link}>{linkText}</Text>
                        <Feather name="chevron-right" size={16} color={colors.primary} style={styles.chevron} />
                    </View>
                </Link>
            )}
            {!!action && action} */}
        </View>
    );
}
