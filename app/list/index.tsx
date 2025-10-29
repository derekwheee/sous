import Button from '@/components/button';
import Heading from '@/components/heading';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import Screen from '@/components/screen';
import SystemIcon from '@/components/system-icon';
import Text from '@/components/text';
import { useCategory } from '@/hooks/use-category';
import { useHeader } from '@/hooks/use-header';
import { usePantry } from '@/hooks/use-pantry';
import globalStyles, { colors, fonts } from '@/styles/global';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';

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
    const router = useRouter();
    const [isAddingItems, setIsAddingItems] = useState<boolean>(false);
    const [newItemText, setNewItemText] = useState<string>('');
    const newItemInputRef = useRef<TextInput>(null);

    useHeader({
        headerItems: [
            {
                label: isAddingItems ? 'done' : 'new item',
                icon: isAddingItems
                    ? undefined
                    : {
                          name: ['plus', 'plus'],
                      },
                onPress: () => setIsAddingItems(!isAddingItems),
            },
        ],
    });

    const {
        categories: { data: categoryList },
    } = useCategory();
    const { pantry, savePantryItem } = usePantry();

    const categories = pantry?.pantryItems
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

    const handleRemoveItem = useCallback(
        async (id: number) => {
            await savePantryItem({ id, isInShoppingList: false });
        },
        [savePantryItem]
    );

    const confirmRemoveItem = useCallback(
        (id: number) =>
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
            ]),
        [handleRemoveItem]
    );

    const proposeRemoveItem = useCallback(
        (id: number, ref?: any) => {
            if (ref) {
                ref.close();
            }

            confirmRemoveItem(id);
        },
        [confirmRemoveItem]
    );

    const handleAddItem = async (id: number) => {
        await savePantryItem({ id, isInShoppingList: true });
    };

    const handleCreateItem = async (name: string, categoryId?: number) => {
        if (!categoryId) {
            categoryId = categoryList?.find((cat) => cat.name.toLowerCase() === 'other')?.id;
        }

        await savePantryItem({ name, isInShoppingList: true, categoryId });

        setNewItemText('');
    };

    const isLoading = !categoryList || !pantry;

    return (
        <Screen isLoading={isLoading}>
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
                    <List>
                        {itemCategory.pantryItems
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((pantryItem: any) => (
                                <ListItem
                                    dimmed={pantryItem.canBeAdded}
                                    key={pantryItem.id}
                                    text={pantryItem.name}
                                    onPress={
                                        pantryItem.canBeAdded
                                            ? () => handleAddItem(pantryItem.id)
                                            : undefined
                                    }
                                    rightAdornment={
                                        pantryItem.canBeAdded
                                            ? () => (
                                                  <Feather
                                                      name='plus'
                                                      size={24}
                                                      color={colors.primary}
                                                  />
                                              )
                                            : () => (
                                                  <SystemIcon
                                                      ios={'repeat'}
                                                      android={'repeat'}
                                                      size={24}
                                                      color={
                                                          pantryItem.isFavorite
                                                              ? colors.primary
                                                              : '#ccc'
                                                      }
                                                  />
                                              )
                                    }
                                    rightActions={
                                        !pantryItem.canBeAdded
                                            ? [
                                                  {
                                                      icon: 'edit-2',
                                                      color: colors.primary,
                                                      onPress: (ref: React.RefObject<any>) => {
                                                          ref?.current?.close();
                                                          router.push({
                                                              pathname: '/list/edit',
                                                              params: {
                                                                  pantryItemId: pantryItem.id,
                                                                  pantryId: pantryItem.pantryId,
                                                              },
                                                          });
                                                      },
                                                  },
                                                  {
                                                      icon: 'x',
                                                      color: colors.error,
                                                      onPress: (ref: React.RefObject<any>) => {
                                                          proposeRemoveItem(pantryItem.id, ref);
                                                      },
                                                  },
                                              ]
                                            : undefined
                                    }
                                />
                            ))}
                    </List>
                </View>
            ))}
            {!pantry?.pantryItems.length && (
                <View style={styles.onboarding}>
                    <Text style={styles.onboardingText}>
                        you don&apos;t have anything in your shopping list
                    </Text>
                    <Button text='add your first item' onPress={() => setIsAddingItems(true)} />
                    <Text style={styles.onboardingText}>or</Text>
                    <Button text='join a household' onPress={() => router.push('/profile/join')} />
                </View>
            )}
        </Screen>
    );
}
