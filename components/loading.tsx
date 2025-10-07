import Text from '@/components/text';
import globalStyles, { colors, fonts } from '@/styles/global';
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, ViewProps } from 'react-native';
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        wrapper: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60%',
            backgroundColor: colors.primary,
            zIndex: 1000,
            transform: [{ translateY: '-150%' }]
        },
        loadingText: {
            fontSize: 28,
            fontFamily: fonts.caprasimo,
            textAlign: 'center',
            color: 'white',
            zIndex: 1001
        },
        circle: {
            width: '150%',
            aspectRatio: 1,
            borderRadius: 9999,
            backgroundColor: colors.primary,
            position: 'absolute',
            bottom: '-50%',
            left: '50%',
            transform: [{ translateX: '-50%' }]
        }
    })
};

type Props = ViewProps & {
    isLoading?: boolean;
    duration?: number;
};

export default function PageTitle({ isLoading = false, duration = 300, ...rest }: Props) {
    const [measuredHeight, setMeasuredHeight] = useState(0);
    const translateY = useSharedValue(0);

    useEffect(() => {
        // target in pixels: 0 (visible) or -150% of measured height (hidden)
        const target = measuredHeight ? (!isLoading ? -1.5 * measuredHeight : 0) : (!isLoading ? -1000 : 0);
        translateY.value = withTiming(target, { duration });
    }, [isLoading, measuredHeight, duration, translateY]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }));

    const onLayout = (e: LayoutChangeEvent) => {
        const h = e.nativeEvent.layout.height;
        if (h && h !== measuredHeight) setMeasuredHeight(h);
    };

    return (
        <Reanimated.View style={[styles.wrapper, animatedStyle]} onLayout={onLayout} {...rest}>
            <Reanimated.View style={styles.circle} />
            <Reanimated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.loadingText}>let me get that for you...</Text>
            </Reanimated.View>
        </Reanimated.View>
    );
}
