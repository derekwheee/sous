import DragHandle from '@/components/drag-handle';
import Heading from '@/components/heading';
import Screen from '@/components/screen';
import Text from '@/components/text';
import { useCategory } from '@/hooks/use-category';
import { brightness, colors } from '@/styles/global';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from 'react-native-draggable-flatlist';

type Item = {
    key: string;
    icon?: string;
    name?: string;
    isNonFood: boolean;
};

export default function App() {
    const router = useRouter();
    const [data, setData] = useState<Item[]>([]);
    const [isDragReady, setIsDragReady] = useState(false);
    const { categories: { data: categories }, saveSortOrder, isSortOrderUpdating } = useCategory();
    const tabBarHeight = useBottomTabBarHeight();

    useEffect(() => {
        if (categories) {
            const mappedData = categories.map((category) => ({
                key: String(category.id),
                icon: category.icon,
                name: category.name,
                isNonFood: category.isNonFood,
            }));
            setData(mappedData);
        }
    }, [categories]);

    const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
        return (
            <ScaleDecorator activeScale={1.05}>
                <TouchableOpacity
                    onLongPress={drag}
                    onPress={() => router.push(`/profile/categories/edit/${item.key}`)}
                    disabled={isActive}
                    style={[styles.rowItem, isActive && styles.rowItemActive]}
                >
                    <View style={styles.categoryWrapper}>
                        <DragHandle color={isActive ? colors.background : undefined} />
                        <Text>{item.icon}</Text>
                        <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                            {item.name}
                        </Text>
                        <SymbolView
                            name={item.isNonFood ? 'fork.knife.circle' : 'fork.knife.circle.fill'}
                            tintColor={
                                item.isNonFood ? brightness(colors.background, -40) : colors.primary
                            }
                            style={{ marginLeft: 'auto' }}
                        />
                    </View>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    const handleDragEnd = async ({ data: newData }: { data: Item[] }) => {
        setData(newData);

        const sortOrder = newData.map((item) => (Number(item.key)));

        await saveSortOrder(sortOrder);
    }

    const listRef = useRef(null);

    return (
        <Screen withoutScroll isLoading={!categories || !isDragReady}>
            <Heading title='Categories' />
            <DraggableFlatList
                onLayout={(e) => setIsDragReady(!!categories)}
                data={data}
                onDragEnd={handleDragEnd}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                autoscrollSpeed={200}
                autoscrollThreshold={200}
                contentContainerStyle={{
                    paddingTop: 1,
                    paddingBottom: tabBarHeight + 102,
                    backgroundColor: brightness(colors.background, -40),
                    gap: 1,
                }}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    rowItem: {
        flex: 1,
        backgroundColor: colors.background,
    },
    rowItemActive: {
        backgroundColor: colors.primary,
    },
    categoryWrapper: {
        width: '100%',
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
    },
    categoryText: {
        textTransform: 'lowercase',
    },
    categoryTextActive: {
        color: colors.background,
    },
});
