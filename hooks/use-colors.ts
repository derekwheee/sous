import { useEffect, useState, useMemo, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '@/styles/global';

type ThemePreference = 'light' | 'dark' | 'system';

interface RGB {
    r: number;
    g: number;
    b: number;
    a: number;
}

export function useColors() {
    const systemTheme = useColorScheme();
    const [userTheme, updateTheme] = useState<ThemePreference>('system');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem('themePreference');
                if (saved === 'light' || saved === 'dark' || saved === 'system') {
                    updateTheme(saved);
                }
            } catch (err) {
                console.error('Failed to load theme', err);
            } finally {
                setIsReady(true);
            }
        })();
    }, []);

    useEffect(() => {
        if (!isReady) return;
        AsyncStorage.setItem('themePreference', userTheme).catch(console.error);
    }, [userTheme, isReady]);

    const resolvedTheme = useMemo(() => {
        if (userTheme === 'system') {
            return systemTheme ?? 'light';
        }
        return userTheme;
    }, [systemTheme, userTheme]);

    const colors = useMemo(() => {
        return resolvedTheme === 'dark' ? darkColors : lightColors;
    }, [resolvedTheme]);

    const brightness = useCallback(
        (color: string, amount: number): string => {
            const rgb = getMutableColor(color);

            amount = resolvedTheme === 'dark' ? amount * -1 : amount;

            const adjustedRgb = {
                r: Math.min(255, Math.max(0, rgb.r + amount)),
                g: Math.min(255, Math.max(0, rgb.g + amount)),
                b: Math.min(255, Math.max(0, rgb.b + amount)),
                a: rgb.a,
            };

            return `rgba(${adjustedRgb.r}, ${adjustedRgb.g}, ${adjustedRgb.b}, ${adjustedRgb.a})`;
        },
        [resolvedTheme]
    );

    const opacity = useCallback((color: string, opacity: number): string => {
        const rgb = getMutableColor(color);

        const adjustedRgb = {
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            a: Math.min(1, Math.max(0, rgb.a * opacity)),
        };

        return `rgba(${adjustedRgb.r}, ${adjustedRgb.g}, ${adjustedRgb.b}, ${adjustedRgb.a})`;
    }, []);

    return {
        updateTheme,
        resolvedTheme,
        userTheme,
        systemTheme,
        isReady,
        colors,
        brightness,
        opacity,
    };
}

function getMutableColor(color: string): RGB {
    const isHex = color.startsWith('#');
    const isRgb = color.startsWith('rgb');
    let rgb: RGB = { r: 0, g: 0, b: 0, a: 1 };

    if (isHex) {
        rgb = hexToRgb(color);
    }

    if (isRgb) {
        rgb = parseRbg(color);
    }

    return rgb;
}

function parseRbg(rgbString: string): RGB {
    const [r, g, b, a = 1] = rgbString
        .replace(/[(rgba?)\(\)]/g, '')
        .split(/,\s?/)
        .map(Number);
    return { r, g, b, a };
}

function hexToRgb(hex: string): RGB {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b, a: 1 };
}
