import Heading from '@/components/heading';
import PantryListing from '@/components/pantry-listing';
import Screen from '@/components/screen';
import { useApi } from '@/hooks/use-api';
import globalStyles, { colors } from '@/styles/global';
import { ItemCategory, Pantry, PantryItem, UpsertPantryItem } from '@/types/interfaces';
import { standardMutation } from '@/util/query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet } from 'react-native';
import ItemDialog from './_components/item-dialog';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({

    })
};

export default function PantryScreen() {
    const queryClient = useQueryClient();
    const navigation = useNavigation();
    const { getPantries, getItemCategories, upsertPantryItem } = useApi();

    const {
        data: pantries,
        refetch: refetchPantries
    } = useQuery<Pantry[]>({
        queryKey: ['pantry'],
        queryFn: () => getPantries()
    });

    const {
        data: itemCategories
    } = useQuery<ItemCategory[]>({
        queryKey: ['itemCategories'],
        queryFn: () => getItemCategories(pantries![0].id),
        enabled: !!pantries && pantries.length > 0
    });

    const { mutate: savePantryItem } = useMutation(
        standardMutation<any, UpsertPantryItem>(
            (patch: UpsertPantryItem) => upsertPantryItem(patch),
            queryClient,
            ['pantry']
        )
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerSearchBarOptions: {
                placeholder: 'search pantry...',
                tintColor: colors.primary,
                onChangeText: (event: any) => setSearchTerm(event.nativeEvent.text)
            },
        });
    }, [navigation]);

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showNewItemDialog, setShowNewItemDialog] = useState<boolean>(false);

    const handleSaveChanges = (patch: UpsertPantryItem, cb?: Function) => {
        savePantryItem(patch, {
            onSuccess: () => cb?.(),
        });
    };

    // TODO: Allow selection of pantry
    const pantry = pantries?.[0]?.pantryItems;
    const sortedPantry = pantry?.sort((a, b) => {
        if (a.isInStock === b.isInStock) {
            return a.name.localeCompare(b.name);
        }
        return a.isInStock ? -1 : 1;
    }).filter((item) => {
        return !item.category?.isNonFood && (item.isInStock || item.isFavorite);
    });

    const filteredPantry = searchTerm ?
        sortedPantry?.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())) :
        sortedPantry;

    const isLoading = !filteredPantry || !itemCategories;

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
        >
            <Heading
                title='Pantry'
                actions={[{
                    label: 'add item',
                    icon: 'plus',
                    onPress: () => setShowNewItemDialog(true)
                }]}
            />
            {itemCategories?.length && (
                <>
                    <ItemDialog
                        open={showNewItemDialog}
                        onOpenChange={setShowNewItemDialog}
                        categories={itemCategories}
                        onPressSave={handleSaveChanges}
                    >
                        <Pressable />
                    </ItemDialog>
                    {filteredPantry?.map((pantryItem: PantryItem) => (
                        <ItemDialog
                            key={pantryItem.id}
                            pantryItem={pantryItem}
                            categories={itemCategories}
                            onPressSave={handleSaveChanges}
                        >
                            <PantryListing pantryItem={pantryItem} onToggleFavorite={handleSaveChanges} />
                        </ItemDialog>
                    ))}
                </>
            )}
        </Screen>
    )
}