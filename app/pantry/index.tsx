
import { getPantry } from '@/api/pantry';
import Heading from '@/components/heading';
import PantryListing from '@/components/pantry-listing';
import globalStyles from '@/styles/global';
import { PantryItem } from '@/types/interfaces';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({

    })
};

const Spacer = ({ height = 16 }) => <View style={{ height }} />;

export default function PantryList() {

    const {
        isFetching: isPantryLoading,
        error: pantryError,
        data: pantry = []
    } = useQuery<PantryItem[]>({
        queryKey: ['pantry'],
        queryFn: getPantry
    });

    const isLoading = isPantryLoading;

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
                <PantryListing key={pantryItem.id} pantryItem={pantryItem} />
            ))}
        </ScrollView>
    );
}