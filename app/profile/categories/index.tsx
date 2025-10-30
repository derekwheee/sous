import Heading from '@/components/heading';
import ListItem from '@/components/list-item';
import Screen from '@/components/screen';
import SystemIcon from '@/components/system-icon';
import { useCategory } from '@/hooks/use-category';
import { useHeader } from '@/hooks/use-header';
import { brightness } from '@/styles/global';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { useColors } from '@/hooks/use-colors';

const useStyles = () => {
    const colors = useColors();
    return StyleSheet.create({
        rowItem: {
            flex: 1,
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
};

type Item = {
    key: string;
    icon?: string;
    name?: string;
    isNonFood: boolean;
};

export default function CategoriesPage() {
    const styles = useStyles();
    const colors = useColors();
    const router = useRouter();
    const [data, setData] = useState<Item[]>([]);
    const [isDragReady, setIsDragReady] = useState(false);
    const {
        categories: { data: categories },
        saveSortOrder,
        deleteCategory,
    } = useCategory();
    const tabBarHeight = useBottomTabBarHeight();

    useHeader({
        headerItems: [
            {
                label: 'new category',
                icon: {
                    name: ['plus', 'plus'],
                },
                onPress: () => router.push('/profile/categories/new'),
            },
        ],
    });

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
                    <ListItem
                        key={item.key}
                        draggable
                        highlight={isActive}
                        text={`${item.icon}  ${item.name}`}
                        rightAdornment={() => (
                            <SystemIcon
                                ios={
                                    item.isNonFood ? 'fork.knife.circle' : 'fork.knife.circle.fill'
                                }
                                android='silverware-fork-knife'
                                color={
                                    item.isNonFood
                                        ? brightness(colors.background, -40)
                                        : isActive
                                          ? colors.background
                                          : colors.primary
                                }
                                style={{ marginLeft: 'auto' }}
                            />
                        )}
                        rightActions={[
                            {
                                icon: 'trash-2',
                                color: colors.error,
                                onPress: () => deleteCategory(Number(item.key)),
                            },
                        ]}
                    />
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    const handleDragEnd = async ({ data: newData }: { data: Item[] }) => {
        setData(newData);

        const sortOrder = newData.map((item) => Number(item.key));

        await saveSortOrder(sortOrder);
    };

    return (
        <Screen withoutScroll isLoading={!categories || !isDragReady}>
            <Heading title='Categories' />
            <DraggableFlatList
                onLayout={() => setIsDragReady(!!categories)}
                data={data}
                onDragEnd={handleDragEnd}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                autoscrollSpeed={200}
                autoscrollThreshold={200}
                contentContainerStyle={{
                    paddingBottom: tabBarHeight + 102,
                    backgroundColor: brightness(colors.background, -20),
                    gap: 1,
                }}
            />
        </Screen>
    );
}
