import HeaderSpacer from '@/components/header-spacer';
import Loading from '@/components/loading';
import { KeyboardAvoidingView, Platform, ScrollView, ScrollViewProps, View } from 'react-native';

export default function Screen({
    withoutScroll = false,
    isLoading = false,
    children,
    ref,
    footerItems,
    ...props
}: {
    withoutScroll?: boolean;
    isLoading?: boolean;
    actions?: {
        label?: string;
        icon: any;
        nudge?: number;
        onPress: () => void;
    }[];
    children: React.ReactNode;
    ref?: React.Ref<any>;
    footerItems?: React.ReactElement[];
} & ScrollViewProps) {
    return (
        <>
            <Loading isLoading={isLoading} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {!withoutScroll && (
                    <ScrollView
                        {...props}
                        ref={ref}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps='handled'
                    >
                        <HeaderSpacer />
                        {children}
                        <View style={{ height: 100 }} />
                    </ScrollView>
                )}
                {withoutScroll && (
                    <View style={{ flex: 1 }} {...props} ref={ref}>
                        <HeaderSpacer />
                        {children}
                    </View>
                )}
            </KeyboardAvoidingView>
            {footerItems && footerItems.length > 0 && <>{footerItems.map((item) => item)}</>}
        </>
    );
}
