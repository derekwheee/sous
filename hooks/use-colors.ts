import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from '@/styles/global';

export const useColors = () => {
    const colorScheme = useColorScheme();
    return colorScheme === 'dark' ? darkColors : lightColors;
};
