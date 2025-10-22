import Button from '@/components/button';
import Heading from '@/components/heading';
import Screen from '@/components/screen';
import Text from '@/components/text';
import { useApi } from '@/hooks/use-api';
import globalStyles, { colors, fonts } from '@/styles/global';
import { ItemCategory, Pantry, PantryItem, UpsertPantryItem } from '@/types/interfaces';
import { getDefault } from '@/util/pantry';
import { pantryItemMutation } from '@/util/query';
import Feather from '@expo/vector-icons/Feather';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useNavigation } from 'expo-router';
import { createRef, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Alert, Pressable, RefreshControl, StyleSheet, TextInput, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        categoryWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 16,
            backgroundColor: '#eee',
        },
        categoryText: {
            fontFamily: fonts.poppins.medium,
            fontSize: 16,
            color: colors.text,
            textTransform: 'lowercase',
        },
        listItemWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
        },
        listItemText: {
            textTransform: 'lowercase',
        },
        listItemTextDimmed: {
            color: '#999',
            textTransform: 'lowercase',
        },
        deleteAction: {
            alignContent: 'center',
            justifyContent: 'center',
            padding: 16,
            aspectRatio: 1,
            height: '100%',
            backgroundColor: colors.error,
        },
        editAction: {
            alignContent: 'center',
            justifyContent: 'center',
            padding: 16,
            aspectRatio: 1,
            height: '100%',
            backgroundColor: colors.primary,
        },
        search: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 14,
            backgroundColor: colors.primary,
        },
        searchInput: {
            flexGrow: 1,
            color: 'white',
        },
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

export default function ListScreen() {
    const navigation = useNavigation();
    const [isAddingItems, setIsAddingItems] = useState<boolean>(false);
    const [swipeHeight, setSwipeHeight] = useState<number>(0);
    const [newItemText, setNewItemText] = useState<string>('');
    const newItemInputRef = useRef<TextInput>(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            // headerSearchBarOptions: {
            //     placeholder: 'search pantry...',
            //     tintColor: colors.primary,
            //     onChangeText: (event: any) => setSearchTerm(event.nativeEvent.text),
            // },
            unstable_headerRightItems: () => [
                {
                    type: 'button',
                    label: isAddingItems ? 'done' : 'new item',
                    icon: isAddingItems ? null : {
                        type: 'sfSymbol',
                        name: 'plus',
                    },
                    tintColor: colors.primary,
                    onPress: () => setIsAddingItems(!isAddingItems),
                },
            ],
        });
    }, [navigation, isAddingItems]);

    const queryClient = useQueryClient();
    const { user, getPantries, upsertPantryItem, getItemCategories } = useApi();

    const { data: pantries, refetch: refetchPantries } = useQuery<Pantry[]>({
        queryKey: ['pantry'],
        queryFn: () => getPantries(),
        enabled: !!user,
    });

    const { data: categoryList } = useQuery<ItemCategory[]>({
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

    const pantry = getDefault(pantries)?.pantryItems;
    const categories = pantry
        ?.reduce<any[]>((acc, item: PantryItem) => {
            const shouldInclude = isAddingItems ? true : item.isInShoppingList;
            if (!shouldInclude) return acc;

            const entryItem =
                isAddingItems && !item.isInShoppingList ? { ...item, canBeAdded: true } : item;

            if (!item.category) {
                item.category = categoryList?.find((cat) => cat.name.toLowerCase() === 'other');
                item.categoryId = item.category?.id;
            }

            const category = acc.find((cat) => cat.id === item.categoryId);
            if (!category) {
                acc.push({
                    ...(item.category as ItemCategory),
                    pantryItems: [entryItem],
                });
            } else {
                category.pantryItems.push(entryItem);
            }

            return acc;
        }, [])
        .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

    const updateHeight = useCallback(
        (r: any) => {
            if (swipeHeight !== r.nativeEvent.layout.height) {
                setSwipeHeight(r.nativeEvent.layout.height);
            }
        },
        [swipeHeight]
    );

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
                onPress: () => {},
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: () => handleRemoveItem(id),
                style: 'destructive',
            },
        ]);

    const handleRemoveItem = async (id: number) => {
        await savePantryItem({ id, isInShoppingList: false });
    };

    const handleAddItem = async (id: number) => {
        await savePantryItem({ id, isInShoppingList: true });
    };

    const handleCreateItem = async (name: string, categoryId?: number) => {
        if (!categoryId) {
            categoryId = categoryList?.find((cat) => cat.name.toLowerCase() === 'other')?.id;
        }

        await savePantryItem({ name, isInShoppingList: true, categoryId });

        setNewItemText('');
        newItemInputRef.current?.blur();
    };

    const isLoading = !user || !categories;

    return (
        <Screen
            isLoading={isLoading}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetchPantries} />}
        >
            <Heading title='Shopping List' />
            {isAddingItems && (
                <View style={styles.search}>
                    <TextInput
                        ref={newItemInputRef}
                        style={[styles.searchInput]}
                        placeholder='add new item'
                        placeholderTextColor='rgba(255, 255, 255, 0.7)'
                        autoCapitalize='none'
                        clearButtonMode='never'
                        selectionColor={'white'}
                        value={newItemText}
                        onChangeText={setNewItemText}
                    />
                    <Feather
                        name='plus'
                        size={24}
                        color={newItemText ? 'white' : 'rgba(255, 255, 255, 0.5)'}
                        onPress={() => {
                            handleCreateItem(newItemText);
                        }}
                    />
                </View>
            )}
            {categories?.map((itemCategory: ItemCategory) => (
                <View key={itemCategory.id}>
                    <View style={styles.categoryWrapper}>
                        <Text style={styles.categoryText}>{itemCategory.icon}</Text>
                        <Text style={styles.categoryText}>{itemCategory.name}</Text>
                    </View>
                    {itemCategory.pantryItems
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((pantryItem: any) => {
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
                                        <Text
                                            style={[styles.listItemText, styles.listItemTextDimmed]}
                                        >
                                            {pantryItem.name}
                                        </Text>
                                        <Feather name='plus' size={24} color={colors.primary} />
                                    </Pressable>
                                );
                            }

                            return (
                                <Swipeable
                                    key={pantryItem.id}
                                    ref={swipeRef}
                                    renderRightActions={(prog, trans) => (
                                        <RightAction
                                            prog={prog}
                                            drag={trans}
                                            pantryItem={pantryItem}
                                            width={swipeHeight}
                                            proposeRemoveItem={proposeRemoveItem}
                                            swipeRef={swipeRef}
                                        />
                                    )}
                                >
                                    <Pressable
                                        onLayout={updateHeight}
                                        style={styles.listItemWrapper}
                                        onPress={() =>
                                            savePantryItem({
                                                id: pantryItem.id,
                                                isInShoppingList: false,
                                                isInStock: true,
                                            })
                                        }
                                    >
                                        <Text style={styles.listItemText}>{pantryItem.name}</Text>
                                    </Pressable>
                                </Swipeable>
                            );
                        })}
                </View>
            ))}
            {!pantry?.length && (
                <View style={styles.onboarding}>
                    <Text style={styles.onboardingText}>
                        you don't have anything in your shopping list
                    </Text>
                    <Button text='add your first item' onPress={() => setIsAddingItems(true)} />
                    <Text style={styles.onboardingText}>or</Text>
                    <Button text='join a household' onPress={() => router.push('/profile/join')} />
                </View>
            )}
        </Screen>
    );
}

function RightAction({
    prog,
    drag,
    pantryItem,
    width,
    proposeRemoveItem,
    swipeRef,
}: {
    prog: SharedValue<number>;
    drag: SharedValue<number>;
    pantryItem: PantryItem;
    width: number;
    proposeRemoveItem: (id: number, ref?: any) => void;
    swipeRef?: React.RefObject<any>;
}) {
    const styleAnimation = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: drag.value + width * 2 }],
        };
    });

    swipeRef?.current?.close;

    return (
        <Reanimated.View style={styleAnimation}>
            <View style={{ flexDirection: 'row' }}>
                <Pressable
                    onPress={() => {
                        swipeRef?.current?.close();
                        router.push({
                            pathname: '/list/edit',
                            params: {
                                pantryItemId: pantryItem.id,
                                pantryId: pantryItem.pantryId,
                            },
                        });
                    }}
                >
                    <Feather name='edit-2' size={24} color='#fff' style={styles.editAction} />
                </Pressable>
                <Pressable onPress={() => proposeRemoveItem(pantryItem.id, swipeRef?.current)}>
                    <Feather name='trash-2' size={24} color='#fff' style={styles.deleteAction} />
                </Pressable>
            </View>
        </Reanimated.View>
    );
}
