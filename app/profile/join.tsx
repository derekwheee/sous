import Button from '@/components/button';
import Text from '@/components/text';
import { useApi } from '@/hooks/use-api';
import globalStyles, { fonts } from '@/styles/global';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 64,
            alignItems: 'center',
            gap: 16
        },
        shareText: {
            fontFamily: fonts.caprasimo,
            fontSize: 32,
            textAlign: 'center',
            marginVertical: 32
        }
    })
};

function validateBarcodeData(data: string): { id: string; joinToken: string } | null {
    try {
        const parsed = JSON.parse(data);
        if (parsed.id && parsed.joinToken) {
            return { id: parsed.id, joinToken: parsed.joinToken };
        }
        return null;
    } catch {
        return null;
    }
}

export default function ProfileJoinScreen() {

    const router = useRouter();
    const { user, joinHousehold } = useApi();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [joinObject, setJoinObject] = useState<{ id: string; joinToken: string } | null>(null);

    const commitJoin = async (parsed: { id: string; joinToken: string }) => {
        try {
            await joinHousehold(parsed, ['user']);
            router.push('/recipes');
        } catch (error) {
            console.error('Failed to join household:', error);
        }
    }

    const handleBarcodeScan = ({ data }: BarcodeScanningResult) => {
        if (joinObject) {
            return;
        }

        const parsed = validateBarcodeData(data);
        if (parsed) {
            setJoinObject(parsed);
            commitJoin(parsed);
        }
    };

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text size={24} align='center'>we need permission to use your camera</Text>
                <Button text="grant permission" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <CameraView
            ref={cameraRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onBarcodeScanned={handleBarcodeScan}
        />
    );
}
