import { useApi } from '@/hooks/use-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mutateItem } from '@/util/query';

export const useDbUser = ({
    onUserSettled,
}: {
    onUserSettled?: (updatedUser: User | undefined) => void;
} = {}) => {
    const queryClient = useQueryClient();
    const { user, getUser, updateUser } = useApi();

    const userQuery = useQuery<User>({
        queryKey: ['user', user?.id],
        queryFn: () => getUser(user?.id!),
        enabled: !!user,
    });

    const { mutate: saveUser, isPending: isUserSaving } = useMutation(
        mutateItem<User>({
            mutationFn: async (patch: Partial<User>) => updateUser(patch),
            queryKey: ['user', user?.id],
            queryClient,
            onSettled: onUserSettled,
        })
    );

    return {
        user: userQuery.data,
        userIsBusy: userQuery.isFetching || userQuery.isPending,
        userQuery,
        saveUser,
        isUserSaving,
    };
};
