import Text from '@/components/text';
import { fonts } from '@/styles/global';
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, ViewProps } from 'react-native';
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useStyles } from '@/hooks/use-style';

const moduleStyles: CreateStyleFunc = (colors) => {
    return {
        wrapper: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
            backgroundColor: colors.primary,
            zIndex: 1000,
        },
        loadingText: {
            marginBottom: 16,
            fontSize: 28,
            fontFamily: fonts.caprasimo,
            textAlign: 'center',
            color: 'white',
            zIndex: 1001,
        },
        longWaitText: {
            fontSize: 16,
            fontFamily: fonts.poppins.medium,
            textAlign: 'center',
            color: 'white',
            zIndex: 1001,
        },
    };
};

type Props = ViewProps & {
    isLoading?: boolean;
    duration?: number;
};

export default function LoadingOverlay({ isLoading = false, duration = 300, ...rest }: Props) {
    const { styles } = useStyles(moduleStyles);
    const [measuredHeight, setMeasuredHeight] = useState(0);
    const [showLongWaitMessage, setShowLongWaitMessage] = useState(false);
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => {
                setShowLongWaitMessage(true);
            }, 5000);
        }
    }, [isLoading]);

    useEffect(() => {
        // target in pixels: 0 (visible) or -150% of measured height (hidden)
        const target = measuredHeight
            ? !isLoading
                ? -1.5 * measuredHeight
                : 0
            : !isLoading
              ? -1000
              : 0;
        translateY.value = withTiming(target, { duration });
    }, [isLoading, measuredHeight, duration, translateY]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const onLayout = (e: LayoutChangeEvent) => {
        const h = e.nativeEvent.layout.height;
        if (h && h !== measuredHeight) setMeasuredHeight(h);
    };

    return (
        <Reanimated.View style={[styles.wrapper, animatedStyle]} onLayout={onLayout} {...rest}>
            <Reanimated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.loadingText}>let me get that for you...</Text>
                <Text style={[styles.longWaitText, { opacity: showLongWaitMessage ? 1 : 0 }]}>
                    this could take a minute
                </Text>
            </Reanimated.View>
        </Reanimated.View>
    );
}
