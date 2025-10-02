// styles/globalStyles.ts
import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#4051FF',
    secondary: '#FF3B30',
    background: '#F7F7F7',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E5E5EA',
    success: '#59FF87',
    warning: '#FFDB59',
    error: '#FF7979',
    indeterminate: '#E8E8E8'
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
    small: 12,
    regular: 14,
    large: 18,
    title: 36,
    heading: 32,
    h1: 36,
    h2: 24,
    h3: 20
};

export const fonts = {
    poppins: {
        light: 'Poppins_300Light',
        regular: 'Poppins_400Regular',
        medium: 'Poppins_500Medium',
        bold: 'Poppins_700Bold'
    },
    caprasimo: 'Caprasimo_400Regular'
};

export default StyleSheet.create({
    // Containers
    container: {
        flex: 1
    },
    content: {
        paddingHorizontal: 16
    },

    // Typography
    text: {
        fontFamily: 'Poppins_300Light',
        fontSize: fontSizes.regular,
        color: colors.text
    },
    link: {
        color: colors.primary
    },
    title: {
        fontFamily: 'Caprasimo_400Regular',
        fontSize: fontSizes.title,
        color: colors.text,
        textTransform: 'lowercase'
    },
    h1: {
        fontFamily: 'Poppins_500Medium',
        fontSize: fontSizes.h1,
        color: colors.text,
        textTransform: 'lowercase'
    },
    h2: {
        paddingVertical: 16,
        fontFamily: 'Poppins_500Medium',
        fontSize: fontSizes.h2,
        color: colors.text,
        textTransform: 'lowercase'
    },
    h3: {
        marginBottom: 16,
        fontFamily: 'Poppins_500Medium',
        fontSize: fontSizes.h3,
        color: colors.text,
        textTransform: 'lowercase'
    },
    heading: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16
    }
});