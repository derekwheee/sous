import Heading from '@/components/heading';
import PantryListing from '@/components/pantry-listing';
import Screen from '@/components/screen';
import { useApi } from '@/hooks/use-api';
import globalStyles, { colors } from '@/styles/global';
import { ItemCategory, PantryItem, UpsertPantryItem } from '@/types/interfaces';
import { useQuery } from '@tanstack/react-query';
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
    const { getPantry, getItemCategories, upsertPantryItem } = useApi();
    const {
        isFetching: isPantryLoading,
        error: pantryError,
        data: pantry = [],
        refetch: refetchPantry
    } = useQuery<PantryItem[]>({
        queryKey: ['pantry'],
        queryFn: getPantry
    });

    const {
        isFetched: isItemCategoriesLoading,
        data: itemCategories = []
    } = useQuery<ItemCategory[]>({
        queryKey: ['itemCategories'],
        queryFn: getItemCategories
    });

    const navigation = useNavigation();

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

    const isLoading = isPantryLoading || isItemCategoriesLoading;

    const handleSaveChanges = async (patch: UpsertPantryItem, cb?: Function) => {

        const res = await upsertPantryItem(patch);

        if (res) {
            cb?.();
        }
    };

    const sortedPantry = pantry.sort((a, b) => {
        if (a.isInStock === b.isInStock) {
            return a.name.localeCompare(b.name);
        }
        return a.isInStock ? -1 : 1;
    }).filter((item) => {
        return !item.category?.isNonFood && (item.isInStock || item.isFavorite);
    });

    const filteredPantry = searchTerm ?
        sortedPantry.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())) :
        sortedPantry;

    return (
        <Screen
            isLoading={isLoading && !filteredPantry?.length}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => {
                        setIsRefreshing(true);
                        refetchPantry().finally(() => setIsRefreshing(false));
                    }}
                />
            }
        >
            <Heading
                title='Pantry'
                actions={[{
                    label: 'Add Item',
                    icon: 'plus',
                    onPress: () => setShowNewItemDialog(true)
                }]}
            />
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
                    <PantryListing pantryItem={pantryItem} />
                </ItemDialog>
            ))}
        </Screen>
    )
}