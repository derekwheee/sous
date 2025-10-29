import { useQueryClient } from '@tanstack/react-query';

export function useInvalidateQueries() {
    const queryClient = useQueryClient();

    return (keys: string[] | string[][]) => {
        for (const key of keys) {
            queryClient.invalidateQueries({
                queryKey: Array.isArray(key) ? key : [key],
            });
        }
    };
}
