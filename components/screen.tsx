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

    })
};

export default function Screen({
    isLoading = false,
    children,
    ...props
}: {
    isLoading?: boolean,
    children: React.ReactNode
} & ScrollViewProps) {
    return (
        <>
            <Loading isLoading={isLoading} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView {...props}>
                    <HeaderSpacer />
                    {children}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}
