import { useApi } from '@/hooks/use-api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useAI({ pantryId }: { pantryId?: number }) {
    const { getRecipeSuggestions, getExpiringPantryItems } = useApi();
    const queryClient = useQueryClient();

    const { data: expiringPantryItems, refetch: fetchExpiringPantryItems } = useQuery({
        queryKey: ['expiring-items', pantryId],
        queryFn: () => getExpiringPantryItems(pantryId!),
        enabled: false,
    });

    const fetchRecipeSuggestions = ({
        tags = [],
        keywords = '',
    }: {
        tags?: string[];
        keywords?: string;
    }) => {
        return queryClient.fetchQuery({
            queryKey: ['recipe-suggestions', pantryId, tags, keywords],
            queryFn: () => getRecipeSuggestions(pantryId!, tags, keywords),
        });
    };

    return {
        expiringPantryItems,
        fetchRecipeSuggestions,
        fetchExpiringPantryItems,
    };
}
