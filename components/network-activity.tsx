// components/network-activity-indicator.tsx
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { useColors } from '@/hooks/use-colors';

const INDICATOR_ACTIVE_HEIGHT = 16;
const INDICATOR_IDLE_HEIGHT = 2;

export default function NetworkActivityIndicator() {
    const colors = useColors();
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();
    const background = useSharedValue(0);
    const height = useSharedValue(INDICATOR_IDLE_HEIGHT);

    const active = isFetching > 0 || isMutating > 0;

    useEffect(() => {
        if (active && height.value === INDICATOR_IDLE_HEIGHT) {
            height.value = withTiming(INDICATOR_ACTIVE_HEIGHT, { duration: 300 });
        } else if (!active && height.value === INDICATOR_ACTIVE_HEIGHT) {
            height.value = withTiming(INDICATOR_IDLE_HEIGHT, { duration: 300 });
        }
    }, [isFetching, isMutating, active, height]);

    useEffect(() => {
        if (active) {
            background.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
        } else {
            background.value = withTiming(0, { duration: 300 });
        }
    }, [active, background]);

    const backgroundStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                background.value,
                [0, 1],
                [colors.primary, colors.sous]
            ),
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
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
});
