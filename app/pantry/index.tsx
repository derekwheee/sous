import { getPantry, upsertPantryItem } from '@/api/pantry';
import Heading from '@/components/heading';
import Loading from '@/components/loading';
import PantryListing from '@/components/pantry-listing';
import Search from '@/components/search';
import Text from '@/components/text';
import globalStyles, { colors } from '@/styles/global';
import { PantryItem, UpsertPantryItem } from '@/types/interfaces';
import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import ItemDialog from './_components/item-dialog';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        newItemButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginLeft: 'auto'
        },
        newItemButtonText: {
            color: colors.primary
        }
    })
};

export default function Index() {
    const {
        isFetching: isPantryLoading,
        error: pantryError,
        data: pantry = [],
        refetch: refetchPantry
    } = useQuery<PantryItem[]>({
        queryKey: ['pantry'],
        queryFn: getPantry
    });

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const isLoading = isPantryLoading;

    const handleSaveChanges = async (patch: UpsertPantryItem, cb?: Function) => {

        const res = await upsertPantryItem(patch);

        if (res) {
            await refetchPantry();
            cb?.();
        }
    };

    const sortedPantry = pantry.sort((a, b) => {
        if (a.isInStock === b.isInStock) {
            return a.name.localeCompare(b.name);
        }
        return a.isInStock ? -1 : 1;
    });

    const filteredPantry = searchTerm ?
        sortedPantry.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) :
        sortedPantry;

    return (
        <>
            <Loading isLoading={isLoading && !filteredPantry?.length} />
            <Heading
                title='Pantry'
                action={(
                    <ItemDialog
                        onPressSave={handleSaveChanges}
                    >
                        <Pressable style={styles.newItemButton}>
                            <Text style={styles.newItemButtonText}>add pantry item</Text>
                            <Feather name="chevron-right" size={16} color={colors.primary} />
                        </Pressable>
                    </ItemDialog>
                )}
            />
            <Search
                value={searchTerm}
                onChangeText={setSearchTerm}
                inputProps={{
                    placeholder: 'search pantry...'
                }}
            />
            <ScrollView
                style={styles.container}
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
                {isLoading && !filteredPantry?.length && (
                    <></>
                )}
                {filteredPantry?.map((pantryItem: PantryItem) => (
                    <ItemDialog
                        key={pantryItem.id}
                        pantryItem={pantryItem}
                        onPressSave={handleSaveChanges}
                    >
                        <PantryListing pantryItem={pantryItem} />
                    </ItemDialog>
                ))}
            </ScrollView>
        </>
    )
}