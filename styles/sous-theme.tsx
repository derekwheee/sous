import type { Theme } from '@react-navigation/native';
import { Platform } from 'react-native';

export const fonts = Platform.select({
    ios: {
        regular: {
            fontFamily: 'System',
            fontWeight: '400',
        },
        medium: {
            fontFamily: 'System',
            fontWeight: '500',
        },
        bold: {
            fontFamily: 'System',
            fontWeight: '600',
        },
        heavy: {
            fontFamily: 'System',
            fontWeight: '700',
        },
    },
    default: {
        regular: {
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'sans-serif-medium',
            fontWeight: 'normal',
        },
        bold: {
            fontFamily: 'sans-serif',
            fontWeight: '600',
        },
        heavy: {
            fontFamily: 'sans-serif',
            fontWeight: '700',
        },
    },
} as const satisfies Record<string, Theme['fonts']>);

export default (colors: Palette, theme: 'light' | 'dark'): Theme => ({
    dark: theme === 'dark',
    colors: {
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.primary,
        notification: colors.error,
    },
    fonts,
});
