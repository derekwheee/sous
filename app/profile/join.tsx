import Button from '@/components/button';
import Text from '@/components/text';
import { useApi } from '@/hooks/use-api';
import globalStyles, { fonts } from '@/styles/global';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/use-colors';

const useStyles = () => {
    const colors = useColors();
    return {
        ...globalStyles(colors),
        ...StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                padding: 64,
                alignItems: 'center',
                gap: 16,
            },
            shareText: {
                fontFamily: fonts.caprasimo,
                fontSize: 32,
                textAlign: 'center',
                marginVertical: 32,
            },
        }),
    };
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

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function ProfileJoinScreen() {
    const styles = useStyles();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, getUser, joinHousehold } = useApi();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [joinObject, setJoinObject] = useState<{ id: string; joinToken: string } | null>(null);

    const { refetch: refetchUser } = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
        enabled: !!user.id,
    });

    const { mutate: commitJoin } = useMutation({
        mutationFn: (parsed: { id: string; joinToken: string }) => joinHousehold(parsed, ['user']),
        onSuccess: async () => {
            await refetchUser();
            await queryClient.invalidateQueries();
            await delay(2000);
            router.replace('/recipes');
        },
        onError: (error) => {
            console.error('Failed to join household:', error);
        },
    });

    const handleBarcodeScan = ({ data }: BarcodeScanningResult) => {
        const parsed = validateBarcodeData(data);
        if (parsed) {
            setJoinObject(parsed);
            commitJoin(parsed);
        }
    };

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text size={24} align='center'>
                    we need permission to use your camera
                </Text>
                <Button text='grant permission' onPress={requestPermission} />
            </View>
        );
    }

    return (
        <CameraView
            ref={cameraRef}
            active={!joinObject}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onBarcodeScanned={(scan) => !joinObject && handleBarcodeScan(scan)}
        />
    );
}
