import Button from '@/components/button';
import Heading from '@/components/heading';
import PantryListing from '@/components/pantry-listing';
import Screen from '@/components/screen';
import { useApi } from '@/hooks/use-api';
import globalStyles, { colors, fonts } from '@/styles/global';
import { ItemCategory, Pantry, PantryItem, UpsertPantryItem } from '@/types/interfaces';
import { getDefault } from '@/util/pantry';
import { pantryItemMutation } from '@/util/query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigation, useRouter } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        onboarding: {
            alignItems: 'center',
            marginVertical: 128,
            gap: 16,
        },
        onboardingText: {
            fontSize: 16,
            fontFamily: fonts.caprasimo,
        },
    }),
};

export default function PantryScreen() {
    const queryClient = useQueryClient();
    const navigation = useNavigation();
    const router = useRouter();
    const { user, getPantries, getItemCategories, upsertPantryItem } = useApi();

    const { data: pantries, refetch: refetchPantries } = useQuery<Pantry[]>({
        queryKey: ['pantry'],
        queryFn: () => getPantries(),
        enabled: !!user,
    });

    const { data: itemCategories } = useQuery<ItemCategory[]>({
        queryKey: ['itemCategories'],
        queryFn: () => getItemCategories(getDefault(pantries)!.id),
        enabled: !!user && !!pantries && pantries.length > 0,
    });

    const { mutate: savePantryItem } = useMutation(
        pantryItemMutation<any, UpsertPantryItem>(
            getDefault(pantries)?.id,
            (patch: UpsertPantryItem) => upsertPantryItem(getDefault(pantries)?.id!, patch),
            queryClient,
            ['pantry']
        )
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerSearchBarOptions: {
                placeholder: 'search pantry...',
                tintColor: colors.primary,
                onChangeText: (event: any) => setSearchTerm(event.nativeEvent.text),
            },
        });
    }, [navigation]);

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSaveChanges = (patch: UpsertPantryItem, cb?: Function) => {
        savePantryItem(patch, {
            onSuccess: () => cb?.(),
        });
    };

    const pantry = getDefault(pantries);
    const pantryItems = pantry?.pantryItems;
    const sortedPantry = pantryItems
        ?.sort((a, b) => {
            if (a.isInStock === b.isInStock) {
                return a.name.localeCompare(b.name);
            }
            return a.isInStock ? -1 : 1;
        })
        .filter((item) => {
            return !item.category?.isNonFood && (item.isInStock || item.isFavorite);
        });

    const filteredPantry = searchTerm
        ? sortedPantry?.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : sortedPantry;

    const isLoading = !user || !filteredPantry || !itemCategories;

    return (
        <Screen
            isLoading={isLoading}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => {
                        setIsRefreshing(true);
                        refetchPantries().finally(() => setIsRefreshing(false));
                    }}
                />
            }
            actions={[
                {
                    label: 'add item',
                    icon: 'plus',
                    onPress: () =>
                        router.push({
                            pathname: '/pantry/edit',
                            params: { pantryId: pantry!.id },
                        }),
                },
            ]}
        >
            <Heading title='Pantry' />
            {!!filteredPantry?.length &&
                !!itemCategories?.length &&
                filteredPantry?.map((pantryItem: PantryItem) => (
                    <PantryListing
                        key={pantryItem.id}
                        pantryItem={pantryItem}
                        onToggleFavorite={handleSaveChanges}
                    />
                ))}
            {!filteredPantry?.length && (
                <View style={styles.onboarding}>
                    <Text style={styles.onboardingText}>
                        you don't have anything in your pantry
                    </Text>
                    <Button
                        text='add your first item'
                        onPress={() =>
                            router.push({
                                pathname: '/pantry/edit',
                                params: { pantryId: pantry!.id },
                            })
                        }
                    />
                    <Text style={styles.onboardingText}>or</Text>
                    <Button text='join a household' onPress={() => router.push('/profile/join')} />
                </View>
            )}
        </Screen>
    );
}
