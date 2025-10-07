import Text from '@/components/text';
import globalStyles, { colors } from '@/styles/global';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        header: {
            backgroundColor: colors.sous,
        },
        wrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 16,
            paddingHorizontal: 8
        },
        title: {
            flex: 1,
            fontFamily: 'Caprasimo_400Regular',
            fontSize: 36,
            textAlign: 'center'
        },
        backButton: {
            position: 'absolute',
            top: 8,
            left: 8
        },
        rightAction: {
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            top: 8,
            right: 8
        },
        rightActionText: {
            marginRight: 8,
            fontSize: 16,
            color: colors.primary
        }
    }),
};

export default function Header({
    rightAction,
    rightActionText,
    rightActionIcon,
    ...props
}: {
    rightAction?: Function
    rightActionText?: string,
    rightActionIcon?: React.ComponentProps<typeof Feather>['name']
} & any) {
    const { navigation } = props;

    return (
        <SafeAreaView
            edges={['top']}
            style={styles.header}
            {...props}
        >
            <StatusBar style="dark" />
            <View style={styles.wrapper}>
                {navigation.canGoBack() && (
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Feather
                            name="chevron-left"
                            size={32}
                            color="black"
                        />
                    </Pressable>
                )}
                <Text style={styles.title}>sous</Text>
                {rightAction && (
                    <Pressable style={styles.rightAction} onPress={() => rightAction()}>
                        <Text style={styles.rightActionText}>{rightActionText}</Text>
                        <Feather
                            name={rightActionIcon}
                            size={32}
                            color={colors.primary}
                        />
                    </Pressable>
                )}
            </View>
        </SafeAreaView>
    );
}
