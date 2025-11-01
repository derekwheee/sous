import { MutationFunction, QueryClient, UseMutationOptions } from '@tanstack/react-query';

interface MutateItemResult<T> {
    previous: T | undefined;
}

interface MutateMemberResult<T> {
    prevMember: T | undefined;
    prevMemberOf: T[] | undefined;
}

interface MutateMemberProps<T> {
    mutationFn: MutationFunction<T, Partial<T>>;
    onMutate?: (
        patch: Partial<T>,
        memberQueryKey: any[],
        memberOfQueryKey: any[],
        queryClient: QueryClient
    ) => Promise<MutateMemberResult<T>>;
    memberQueryKey: any[];
    memberOfQueryKey: any[];
    queryClient: QueryClient;
}

interface MutateItemProps<T extends { id?: number }>
    extends Omit<MutateMemberProps<T>, 'memberQueryKey' | 'memberOfQueryKey' | 'onMutate'> {
    onMutate?: (
        patch: Partial<T>,
        queryKey: any[],
        queryClient: QueryClient
    ) => Promise<MutateItemResult<T>>;
    queryKey: any[];
    onSettled?: (updatedItem: T | undefined) => void;
    onError?: (error: any, patch: Partial<T>, context: MutateItemResult<T> | undefined) => void;
}

export function mutateItem<T extends { id?: number }>({
    mutationFn,
    onMutate,
    queryKey,
    queryClient,
    onError,
    onSettled,
}: MutateItemProps<T>): UseMutationOptions<
    T,
    { previous: T | undefined },
    Partial<T>,
    { previous: T | undefined }
> {
    return {
        mutationFn,
        onMutate: onMutate
            ? (patch) => onMutate(patch, queryKey, queryClient)
            : (patch) => onMutateItem<T>(patch, queryKey, queryClient),
        onError: (_, __, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKey!, context.previous);
            }
            onError?.(_, __, context);
        },
        onSettled: (updatedItem) => {
            queryClient.invalidateQueries({ queryKey });
            onSettled?.(updatedItem);
        },
    };
}

export function mutateMember<TMember extends { id?: number }>({
    mutationFn,
    onMutate,
    memberQueryKey,
    memberOfQueryKey,
    queryClient,
}: MutateMemberProps<TMember>): UseMutationOptions<
    TMember,
    MutateMemberResult<TMember>,
    any,
    MutateMemberResult<TMember>
> {
    return {
        mutationFn,
        onMutate: onMutate
            ? (patch) => onMutate(patch, memberQueryKey, memberOfQueryKey, queryClient)
            : (patch) =>
                  onMutateMember<TMember>(patch, memberQueryKey, memberOfQueryKey, queryClient),
        onError: (
            _: any,
            __: any,
            context: { prevMemberOf?: TMember[]; prevMember?: TMember } | undefined
        ) => {
            if (context?.prevMemberOf) {
                queryClient.setQueryData(memberOfQueryKey, context.prevMemberOf);
            }
            if (context?.prevMember) {
                queryClient.setQueryData(memberQueryKey, context.prevMember);
            }
        },
        onSettled: (_, __, updatedItem) => {
            queryClient.invalidateQueries({ queryKey: memberOfQueryKey });
            queryClient.invalidateQueries({ queryKey: memberQueryKey });
        },
    };
}

export function deleteMember<TMember extends { id?: number }>({
    mutationFn,
    memberQueryKey,
    memberOfQueryKey,
    queryClient,
}: Omit<MutateMemberProps<TMember>, 'onMutate'>): UseMutationOptions<
    TMember,
    { prevMember: TMember | undefined; prevMemberOf: TMember[] | undefined },
    any,
    { prevMember: TMember | undefined; prevMemberOf: TMember[] | undefined }
> {
    return mutateMember<TMember>({
        mutationFn,
        memberQueryKey,
        memberOfQueryKey,
        queryClient,
        onMutate: async (patch, memberQueryKey, memberOfQueryKey, queryClient) => {
            await queryClient.cancelQueries({ queryKey: memberOfQueryKey });
            await queryClient.cancelQueries({ queryKey: memberQueryKey });

            const prevMemberOf = queryClient.getQueryData<TMember[]>(memberOfQueryKey);
            const prevMember = queryClient.getQueryData<TMember>(memberQueryKey);

            if (prevMemberOf) {
                queryClient.setQueryData<TMember[]>(memberOfQueryKey, (old) =>
                    old ? old.filter((member) => member.id !== patch.id) : old
                );
            }

            if (prevMember) {
                queryClient.setQueryData<TMember>(memberQueryKey, undefined);
            }

            return { prevMemberOf, prevMember };
        },
    });
}

async function onMutateItem<T extends { id?: number }>(
    patch: Partial<T>,
    queryKey: any[],
    queryClient: QueryClient
) {
    await queryClient.cancelQueries({ queryKey });

    const previous = queryClient.getQueryData<T>(queryKey);

    queryClient.setQueryData<T>(queryKey, (old) => ({ ...old!, ...patch }));

    return { previous };
}

async function onMutateMember<T extends { id?: number }>(
    patch: Partial<T>,
    memberQueryKey: any[],
    memberOfQueryKey: any[],
    queryClient: QueryClient
) {
    await queryClient.cancelQueries({ queryKey: memberOfQueryKey });
    await queryClient.cancelQueries({ queryKey: memberQueryKey });

    const prevMemberOf = queryClient.getQueryData<T[]>(memberOfQueryKey);
    const prevMember = queryClient.getQueryData<T>(memberQueryKey);

    const newItem: T | null = !!patch.id ? null : { ...(patch as T) };

    if (prevMemberOf) {
        queryClient.setQueryData<T[]>(memberOfQueryKey, (old) =>
            old
                ? [
                      ...old.map((member) => ({
                          ...member,
                          ...(member.id === patch.id ? { ...member, ...patch } : {}),
                      })),
                      ...(newItem ? [newItem] : []),
                  ]
                : old
        );
    }

    if (prevMember) {
        queryClient.setQueryData<T>(memberQueryKey, {
            ...prevMember,
            ...patch,
        });
    }

    return { prevMemberOf, prevMember };
}
