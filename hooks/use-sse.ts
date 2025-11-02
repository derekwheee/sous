import { useApi } from '@/hooks/use-api';
import { SSEMessageType, subscribe } from '@/util/sse';
import { useAuth } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

export function useSSE() {
    const { getToken } = useAuth();
    const { user } = useApi();
    const queryClient = useQueryClient();

    const [token, setToken] = useState<string | null>(null);

    const householdId = (user as User | null)?.defaultHouseholdId || 0;

    const getAuthToken = useCallback(async () => {
        const authToken = await getToken();
        setToken(authToken);
    }, [getToken]);

    useEffect(() => {
        if (!token) {
            getAuthToken();
            return;
        }

        if (!householdId) {
            return;
        }

        const unsubscribe = subscribe(token, householdId, (data: BroadcastMessage) => {
            switch (data.type) {
                case SSEMessageType.RECIPE_UPDATE:
                    queryClient?.invalidateQueries({ queryKey: ['recipes'], exact: false });
                    break;
                case SSEMessageType.RECIPE_DELETE:
                    queryClient?.invalidateQueries({ queryKey: ['recipes'], exact: false });
                    break;
                case SSEMessageType.PANTRY_UPDATE:
                    queryClient?.invalidateQueries({ queryKey: ['pantry'], exact: false });
                    queryClient?.invalidateQueries({ queryKey: ['pantryItem'], exact: false });
                    break;
                case SSEMessageType.CATEGORY_UPDATE:
                    queryClient?.invalidateQueries({ queryKey: ['categories'], exact: false });
                    break;
                case SSEMessageType.USER_UPDATE:
                    queryClient?.invalidateQueries({ queryKey: ['users'], exact: false });
                    break;
                default:
                    break;
            }
        });

        return () => unsubscribe();
    }, [token, queryClient, householdId, getAuthToken]);
}
