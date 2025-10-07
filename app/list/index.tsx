import { getItemCategories } from '@/api/item-categories';
import { upsertPantryItem } from '@/api/pantry';
import ItemDialog from '@/app/pantry/_components/item-dialog';
import Heading from '@/components/heading';
import Loading from '@/components/loading';
import Text from '@/components/text';
import { useHeader } from '@/hooks/use-header';
import globalStyles, { colors, fonts } from '@/styles/global';
import { ItemCategory, PantryItem, UpsertPantryItem } from '@/types/interfaces';
import Feather from '@expo/vector-icons/Feather';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createRef, useCallback, useRef, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        categoryWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 16,
            backgroundColor: '#eee'
        },
        categoryText: {
            fontFamily: fonts.poppins.medium,
            fontSize: 16,
            color: colors.text,
            textTransform: 'lowercase'
        },
        listItemWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd'
        },
        listItemText: {

        },
        listItemTextDimmed: {
            color: '#999'
        },
        deleteAction: {
            alignContent: 'center',
            justifyContent: 'center',
            padding: 16,
            aspectRatio: 1,
            height: '100%',
            backgroundColor: colors.error
        },
        editAction: {
            alignContent: 'center',
            justifyContent: 'center',
            padding: 16,
            aspectRatio: 1,
            height: '100%',
            backgroundColor: colors.primary
        },
        search: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 14,
            backgroundColor: colors.primary
        },
        searchInput: {
            flexGrow: 1,
            color: 'white'
        }
    })
};

export default function ListIndex() {
    const [isAddingItems, setIsAddingItems] = useState<boolean>(false);
    const [swipeHeight, setSwipeHeight] = useState<number>(0);
    const [newItemText, setNewItemText] = useState<string>('');
    const newItemInputRef = useRef<TextInput>(null);
    
    const { HeaderSpacer } = useHeader({
        rightAction: () => setIsAddingItems(!isAddingItems),
        rightActionText: isAddingItems ? 'done' : 'add items',
        rightActionIcon: isAddingItems ? 'check' : 'plus'
    });
    const queryClient = useQueryClient();
    const {
        isFetching,
        error,
        data: itemCategories = [],
        refetch
    } = useQuery<ItemCategory[]>({
        queryKey: ['list'],
        queryFn: getItemCategories
    });

    const isLoading = isFetching;
    const filteredItemCategories = itemCategories.reduce<any[]>((acc, cat) => {
        const items = cat?.pantryItems;
        if (!items || items.length === 0) return acc;

        const pantryItems = items.reduce<any[]>((out, item) => {
            if (isAddingItems) {
                out.push(item.isInShoppingList ? item : { ...item, canBeAdded: true });
            } else {
                if (item.isInShoppingList) {
                    out.push(item);
                }
            }
            return out;
        }, []);

        if (pantryItems.length) {
            acc.push({ ...cat, pantryItems });
        }

        return acc;
    }, []);

    const updateHeight = useCallback((r: any) => {
        if (swipeHeight !== r.nativeEvent.layout.height) {
            setSwipeHeight(r.nativeEvent.layout.height);
        }
    }, [swipeHeight]);

    const swipeRefs = useRef(new Map<number, React.RefObject<any>>());

    const proposeRemoveItem = useCallback((id: number, ref?: any) => {
        if (ref) {
            ref.close();
        }

        confirmRemoveItem(id);
    }, []);

    const confirmRemoveItem = (id: number) =>
        Alert.alert('Remove item', 'Do you want to remove this item from your list?', [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel'
            },
            {
                text: 'Delete',
                onPress: () => handleRemoveItem(id),
                style: 'destructive'
            },
        ]);

    const handleRemoveItem = async (id: number) => {
        await upsertPantryItem({ id, isInShoppingList: false });
        queryClient.invalidateQueries({ queryKey: ['pantry', 'list'] });
    };

    const handleAddItem = async (id: number) => {
        await upsertPantryItem({ id, isInShoppingList: true });
        queryClient.invalidateQueries({ queryKey: ['pantry', 'list'] });
    };

    const handleCreateItem = async (name: string, categoryId?: number) => {

        if (!categoryId) {
            categoryId = itemCategories.find(cat => cat.name.toLowerCase() === 'other')?.id;
        }

        await upsertPantryItem({ name, isInShoppingList: true, categoryId });
        queryClient.invalidateQueries({ queryKey: ['pantry', 'list'] });

        setNewItemText('');
        newItemInputRef.current?.blur();
    };

    const handleEditItem = async (patch: UpsertPantryItem, cb?: Function) => {

        const res = await upsertPantryItem(patch);
        queryClient.invalidateQueries({ queryKey: ['pantry', 'list'] });


        if (res) {
            cb?.();
        }
    };

    return (
        <>
            <Loading isLoading={isLoading && !filteredItemCategories?.length} />
            <HeaderSpacer />
            <Heading
                title='Shopping List'
            />
            {isAddingItems && (
                <View style={styles.search}>
                    <TextInput
                        ref={newItemInputRef}
                        style={[styles.searchInput]}
                        placeholder="add new item"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        autoCapitalize='none'
                        clearButtonMode='never'
                        selectionColor={'white'}
                        value={newItemText}
                        onChangeText={setNewItemText}
                    />
                    <Feather name="plus" size={24} color={newItemText ? 'white' : 'rgba(255, 255, 255, 0.5)'} onPress={() => {
                        handleCreateItem(newItemText);
                    }} />
                </View>
            )}
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={refetch}
                    />
                }
            >
                <GestureHandlerRootView>
                    {filteredItemCategories?.map((itemCategory: ItemCategory) => (
                        <View key={itemCategory.id}>
                            <View style={styles.categoryWrapper}>
                                <Text style={styles.categoryText}>{itemCategory.icon}</Text>
                                <Text style={styles.categoryText}>{itemCategory.name}</Text>
                            </View>
                            {itemCategory.pantryItems.map((pantryItem: any) => {
                                if (!swipeRefs.current.has(pantryItem.id)) {
                                    swipeRefs.current.set(pantryItem.id, createRef<any>());
                                }
                                const swipeRef = swipeRefs.current.get(pantryItem.id);

                                if (pantryItem.canBeAdded) {
                                    return (
                                        <Pressable
                                            key={pantryItem.id}
                                            style={styles.listItemWrapper}
                                            onPress={() => handleAddItem(pantryItem.id)}
                                        >
                                            <Text style={[styles.listItemText, styles.listItemTextDimmed]}>{pantryItem.name}</Text>
                                            <Feather name="plus" size={24} color={colors.primary} />
                                        </Pressable>
                                    );
                                }

                                return (
                                    <Swipeable
                                        key={pantryItem.id}
                                        ref={swipeRef}
                                        renderRightActions={(prog, trans) =>
                                            RightAction(
                                                prog,
                                                trans,
                                                pantryItem,
                                                itemCategories,
                                                swipeHeight,
                                                proposeRemoveItem,
                                                handleEditItem,
                                                swipeRef
                                            )
                                        }
                                    >
                                        <View onLayout={updateHeight} style={styles.listItemWrapper}>
                                            <Text style={styles.listItemText}>{pantryItem.name}</Text>
                                        </View>
                                    </Swipeable>
                                );
                            })}
                        </View>
                    ))}
                </GestureHandlerRootView>
            </ScrollView>
        </>
    )
}

function RightAction(
    prog: SharedValue<number>,
    drag: SharedValue<number>,
    pantryItem: PantryItem,
    itemCategories: ItemCategory[],
    width: number,
    proposeRemoveItem: (id: number, ref?: any) => void,
    handleEditItem: (patch: UpsertPantryItem, cb?: Function) => void,
    swipeRef?: React.RefObject<any>
) {

    const styleAnimation = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: drag.value + (width * 2) }],
        };
    });

    return (
        <Reanimated.View style={styleAnimation}>
            <View style={{ flexDirection: 'row' }}>
                <ItemDialog
                    pantryItem={pantryItem}
                    categories={itemCategories}
                    onPressSave={handleEditItem}
                >
                    <Pressable>
                        <Feather name="edit-2" size={24} color="#fff" style={styles.editAction} />
                    </Pressable>
                </ItemDialog>
                <Pressable onPress={() => proposeRemoveItem(pantryItem.id, swipeRef?.current)}>
                    <Feather name="trash-2" size={24} color="#fff" style={styles.deleteAction} />
                </Pressable>
            </View>
        </Reanimated.View>
    );
};
