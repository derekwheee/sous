// styles/globalStyles.ts
import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#4051FF',
    secondary: '#FF3B30',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E5E5EA',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
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
    title: 24,
    heading: 32,
    h1: 36
};

export default StyleSheet.create({
    // Containers
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
    },
    h1: {
        fontFamily: 'Poppins_500Medium',
        fontSize: fontSizes.h1,
        color: colors.text,
        textTransform: 'lowercase'
    },
    heading: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16
    }
});