import { MutationFunction, QueryClient } from '@tanstack/react-query';

function optimisticUpdate(patch: any, previous?: any) {
    if (!previous) return previous;

    const itemIndex = previous.findIndex((i: any) => i.id === patch.id);

    if (itemIndex === -1) {
        const updated = [...previous];
        const newItem = {
            id: -1,
            ...patch
        };
        return [...updated, newItem];
    } else {
        const updated = [...previous];
        updated[itemIndex] = { ...updated[itemIndex], ...patch };
        return updated;
    }
}

async function optimisticOnMutate<T>(client: QueryClient, queryKey: string[], patch: T) {
    await client.cancelQueries({ queryKey });
    const previous = client.getQueryData<T>(queryKey);

    client.setQueryData<T>(queryKey, (old) => optimisticUpdate(patch, old));

    return { previous };
}

export function standardMutation<TData, TVariables>(
    mutationFn: MutationFunction<TData, TVariables>,
    queryClient: QueryClient,
    queryKey: string[],
    invalidateKeys?: string[] | string[][]
) {
    return {
        mutationFn,
        onMutate: async (patch: TVariables) => optimisticOnMutate<TVariables>(queryClient, queryKey, patch),
        onError: (_: any, __: any, context: { previous: TData | undefined } | undefined) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKey, context.previous);
            }
        },
        onSettled: () => {
            if (invalidateKeys) {
                for (const key of invalidateKeys) {
                    queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
                }
            } else {
                queryClient.invalidateQueries({ queryKey });
            }
        },
    }
}