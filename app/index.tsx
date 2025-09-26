import Heading from '@/components/heading';
import globalStyles from '@/styles/global';
import { ScrollView, StyleSheet } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({

    })
};

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container}>
            <Heading
                title='Recipes'
                linkTo='/(recipes)'
                linkText='see all recipes'
            />
            <Heading
                title='Pantry'
                linkTo='/(recipes)'
                linkText='add items'
            />
        </ScrollView>
    );
}
