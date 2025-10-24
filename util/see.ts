import Constants from 'expo-constants';
import EventSource from 'react-native-sse';

const API_HOST: string | undefined =
    Constants.expoConfig?.extra?.apiHost || process.env.EXPO_PUBLIC_API_HOST;

if (!API_HOST) {
    throw new Error('API_HOST is not defined');
}

type Callback = (data: any) => void;

const sources: Record<number, EventSource> = {};
const listeners: Record<number, Callback[]> = {};

export function subscribe(token: string, householdId: number, cb: Callback) {
    if (!sources[householdId]) {
        const source = new EventSource(`${API_HOST}/events/${householdId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        sources[householdId] = source;
        listeners[householdId] = [];

        source.addEventListener('error', (err) => {
            // Check for 'message' property safely, or use 'type' for error filtering
            const errorMessage = (err as any)?.message || (err as any)?.data || '';
            if (typeof errorMessage === 'string' && errorMessage.includes('network connection')) {
                return;
            }
            console.error(err);
        });

        source.addEventListener('message', (event) => {
            if (!event.data) return;
            const parsed = JSON.parse(event.data);
            listeners[householdId].forEach((fn) => fn(parsed));
        });
    }

    // TODO: This is a little lazy, it would be better if subscribe didn't get called so often
    if (!listeners[householdId].includes(cb)) {
        listeners[householdId].push(cb);
    }

    return () => {
        listeners[householdId] = listeners[householdId]?.filter((fn) => fn !== cb);

        if (listeners[householdId]?.length === 0) {
            sources[householdId]?.close();

            delete sources[householdId];
            delete listeners[householdId];
        }
    };
}
