import HeaderSpacer from '@/components/header-spacer';
import Loading from '@/components/loading';
import globalStyles from '@/styles/global';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ScrollViewProps,
    StyleSheet,
    View
} from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        contentWrapper: {
            flex: 1
        }
    })
};

export default function Screen({
    isLoading = false,
    children,
    ref,
    ...props
}: {
    isLoading?: boolean,
    children: React.ReactNode,
    ref?: React.Ref<any>
} & ScrollViewProps) {
    return (
        <>
            <Loading isLoading={isLoading} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    {...props}
                    ref={ref}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <HeaderSpacer />
                    <View style={styles.contentWrapper}>
                        {children}
                    </View>
                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}
