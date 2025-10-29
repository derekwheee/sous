import Screen from '@/components/screen';
import { useApi } from '@/hooks/use-api';
import globalStyles from '@/styles/global';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
        },
        qrWrapper: {
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            aspectRatio: 1,
            backgroundColor: '#e6e6e6',
            borderRadius: 999,
        },
    }),
};

export default function ProfileLinkScreen() {
    const { user } = useApi();
    const { width } = useWindowDimensions();

    const household = user?.households?.find((h: Household) => user.defaultHouseholdId === h.id);

    return (
        <Screen isLoading={!user}>
            <View style={styles.container}>
                {!!household && (
                    <View style={{ ...styles.qrWrapper, width: width * 0.85 }}>
                        <QRCodeStyled
                            data={JSON.stringify({
                                id: household.id,
                                joinToken: household.joinToken,
                            })}
                            size={200}
                            color='#000'
                        />
                    </View>
                )}
            </View>
        </Screen>
    );
}
