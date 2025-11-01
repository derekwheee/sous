import { useColors } from '@/hooks/use-colors';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import globalStyles from '@/styles/global';

export function useStyles(styles: CreateStyleFunc) {
    const { colors, brightness, opacity } = useColors();
    const stylesSheet = useMemo(
        () =>
            StyleSheet.create({
                ...globalStyles,
                ...styles(colors, brightness, opacity),
            }),
        [colors, brightness, opacity, styles]
    );

    return {
        colors,
        brightness,
        opacity,
        styles: stylesSheet,
    };
}
