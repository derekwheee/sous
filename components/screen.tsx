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

    }),
};

export default function Screen({
    isLoading = false,
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
                <ScrollView {...props} ref={ref} contentContainerStyle={{ flexGrow: 1 }}>
                    <HeaderSpacer />
                    {children}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}
