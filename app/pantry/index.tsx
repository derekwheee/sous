import { getPantry, updatePantryItem } from '@/api/pantry';
import Heading from '@/components/heading';
import PantryListing from '@/components/pantry-listing';
import globalStyles from '@/styles/global';
import { PantryItem, PatchPantryItem } from '@/types/interfaces';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet } from 'react-native';
import ItemDialog from './_components/item-dialog';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({

    })
};

export default function Index() {
    const {
        isFetching: isPantryLoading,
        error: pantryError,
        data: pantry = []
    } = useQuery<PantryItem[]>({
        queryKey: ['pantry'],
        queryFn: getPantry
    });

    const isLoading = isPantryLoading;

    const handleSaveChanges = async (patch: PatchPantryItem, cb?: Function) => {

        const res = await updatePantryItem(patch);

        if (res) {
            cb?.();
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Heading
                title='Pantry'
                linkTo='/pantry/new'
                linkText='add pantry item'
            />
            {isLoading && (
                <></>
            )}
            {!isLoading && pantry?.map((pantryItem: PantryItem) => (
                <ItemDialog
                    key={pantryItem.id}
                    pantryItem={pantryItem}
                    onPressSave={handleSaveChanges}
                >
                    <PantryListing pantryItem={pantryItem} />
                </ItemDialog>
            ))}
        </ScrollView>
    )
}