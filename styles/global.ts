import { StyleSheet } from 'react-native';

export const lightSwatch: Swatch = {
    white: '#FFFFFF',
    black: '#000000',
    blue: '#4051ff',
    yellow: '#ffd541',
    purple: '#4e0250',
    green: '#58bc82',
    pink: '#ffa69e',
    success: '#58bc82',
    warning: '#ffd541',
    info: '#92dce5',
    error: '#FF1B1C',
    c: 'rgb(0, 255, 255)',
    m: 'rgb(255, 0, 255)',
    y: 'rgb(255, 255, 0)',
    k: 'rgb(0, 0, 0)',
};

export const lightColors: Palette = {
    sous: lightSwatch.yellow,
    primary: lightSwatch.blue,
    background: '#F7F7F7',
    text: '#191919',
    indeterminate: '#E8E8E8',
    surface: '#FFFFFF',
    ...lightSwatch,
};

export const darkSwatch: Swatch = {
    white: '#FFFFFF',
    black: '#000000',
    blue: '#5B6FFF',
    yellow: '#FFD85A',
    purple: '#B35BB8',
    green: '#6EDCA3',
    pink: '#FFB6AE',
    success: '#6EDCA3',
    warning: '#FFD85A',
    info: '#7ADBE5',
    error: '#FF5A5B',
    c: 'rgb(100, 255, 255)',
    m: 'rgb(255, 100, 255)',
    y: 'rgb(255, 255, 120)',
    k: 'rgb(255, 255, 255)',
};

export const darkColors: Palette = {
    sous: darkSwatch.yellow,
    primary: darkSwatch.blue,
    background: '#0E0E10',
    text: '#F3F3F3',
    indeterminate: '#2B2B2E',
    surface: '#1A1A1D',
    ...darkSwatch,
};

export const sizes = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const fontSizes = {
    xs: 12,
    small: 14,
    regular: 16,
    large: 20,
    title: 36,
    heading: 32,
    h1: 36,
    h2: 24,
    h3: 20,
};

export const fonts = {
    poppins: {
        light: 'Poppins_300Light',
        regular: 'Poppins_400Regular',
        medium: 'Poppins_500Medium',
        bold: 'Poppins_700Bold',
    },
    caprasimo: 'Caprasimo_400Regular',
};

export default function (colors: Palette) {
    return StyleSheet.create({
        // Containers
        container: {
            flex: 1,
        },
        content: {
            paddingHorizontal: 16,
        },

        // Typography
        text: {
            fontFamily: 'Poppins_300Light',
            fontSize: fontSizes.regular,
            color: colors.text,
        },
        link: {
            color: colors.primary,
        },
        title: {
            flexShrink: 1,
            fontFamily: 'Caprasimo_400Regular',
            fontSize: fontSizes.title,
            color: colors.text,
            textTransform: 'lowercase',
        },
        h1: {
            fontFamily: 'Poppins_500Medium',
            fontSize: fontSizes.h1,
            color: colors.text,
            textTransform: 'lowercase',
        },
        h2: {
            paddingVertical: 16,
            fontFamily: 'Poppins_500Medium',
            fontSize: fontSizes.h2,
            color: colors.text,
            textTransform: 'lowercase',
        },
        h3: {
            marginBottom: 16,
            fontFamily: 'Poppins_500Medium',
            fontSize: fontSizes.h3,
            color: colors.text,
            textTransform: 'lowercase',
        },
        heading: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 16,
            paddingHorizontal: 16,
        },
        dialogHeading: {
            fontFamily: fonts.poppins.medium,
            fontSize: fontSizes.h2,
            color: colors.text,
            textTransform: 'lowercase',
        },
        dialogDescription: {
            fontFamily: fonts.poppins.regular,
            fontSize: fontSizes.regular,
        },
        button: {
            height: 48,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
        },
        buttonDisabled: {
            backgroundColor: colors.indeterminate,
        },
        buttonText: {
            color: colors.surface,
            fontFamily: fonts.poppins.medium,
            fontSize: fontSizes.regular,
            textTransform: 'lowercase',
        },
        buttonTextDisabled: {
            // color: brightness(colors.text, 128),
        },
    });
}
