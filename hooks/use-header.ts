import Header from '@/components/header';
import HeaderSpacer from '@/components/header-spacer';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

export function useHeader({
    rightAction,
    rightActionIcon,
    rightActionText
}: {
    rightAction?: Function
    rightActionText?: React.ComponentProps<typeof Header>['rightActionText'],
    rightActionIcon?: React.ComponentProps<typeof Header>['rightActionIcon']
} = {}) {
    const headerHeight = useHeaderHeight();
    const navigation = useNavigation();

    useEffect(() => {
        navigation?.setOptions({
            header: (props: any) => {

                return Header({
                    rightAction,
                    rightActionIcon,
                    rightActionText,
                    ...props
                });
            },
            headerTransparent: true
        });
    }, [navigation, rightAction, rightActionIcon, rightActionText]);


    return {
        headerHeight,
        HeaderSpacer: () => HeaderSpacer({ height: headerHeight })
    };
}
