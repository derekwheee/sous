import globalStyles, { colors } from '@/styles/global';
import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        search: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 14,
            backgroundColor: colors.primary,
        },
        searchInput: {
            flexGrow: 1,
            color: 'white',
        },
    }),
};

export default function SearchBar({
    value,
    onChangeText,
    onCancel,
    inputProps = {},
}: {
    value?: string;
    onChangeText: (text: string) => void;
    onCancel?: () => void;
    inputProps?: TextInputProps;
}): React.ReactElement {
    return (
        <View style={styles.search}>
            <Feather name='search' size={24} color='white' />
            <TextInput
                style={[styles.searchInput]}
                placeholder='search'
                placeholderTextColor='rgba(255, 255, 255, 0.7)'
                autoCapitalize='none'
                clearButtonMode='never'
                selectionColor={'white'}
                value={value}
                onChangeText={onChangeText}
                {...inputProps}
            />
            {value && (
                <Feather
                    name='x'
                    size={24}
                    color='white'
                    onPress={() => {
                        onCancel?.();
                        onChangeText('');
                    }}
                />
            )}
        </View>
    );
}
