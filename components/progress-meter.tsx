import { brightness, colors } from '@/styles/global';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function ProgressMeter({
    size = 32,
    progress,
}: {
    size?: number;
    progress: number;
}) {
    const [circumference, setCircumference] = useState(0);
    const radius = size / 2;
    const strokeWidth = 4;

    useEffect(() => {
        const circumferenceValue = 2 * Math.PI * radius;
        setCircumference(circumferenceValue);
    }, [radius]);

    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={{ aspectRatio: 1, width: radius * 2, marginLeft: 'auto' }}>
            <Svg width={radius * 2} height={radius * 2} style={styles.svg}>
                <Circle
                    stroke={brightness(colors.background, -20)}
                    fill='transparent'
                    strokeWidth={strokeWidth}
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                />
                <Circle
                    stroke={progress > 0.8 ? colors.success : colors.warning}
                    fill='transparent'
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    svg: {
        transform: [{ scaleX: -1 }, { rotate: '-110deg' }], // Flip horizontally to start progress from top
    },
});
