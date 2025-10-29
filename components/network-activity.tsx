// components/network-activity-indicator.tsx
import { colors } from '@/styles/global';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

export default function NetworkActivityIndicator() {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();
    const background = useSharedValue(0);
    const rotate = useSharedValue(0);
    const height = useSharedValue(0);

    const active = isFetching > 0 || isMutating > 0;

    useEffect(() => {
        if (active && height.value === 0) {
            height.value = withTiming(32, { duration: 300 });
        } else if (!active && height.value === 32) {
            height.value = withTiming(0, { duration: 300 });
        }
    }, [isFetching, isMutating, active, height]);

    useEffect(() => {
        background.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
        rotate.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    }, [background, rotate]);

    const backgroundStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                background.value,
                [0, 1],
                [colors.primary, colors.sous]
            ),
            transform: [
                {
                    rotate: `${interpolate(rotate.value, [0, 1], [-0.5, 0.5])}deg`,
                },
            ],
        };
    });

    const heightStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
        };
    });

    return <Animated.View style={[styles.overlay, backgroundStyle, heightStyle]} />;
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        bottom: -8,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
});
