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
import { fonts } from '@/styles/global';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { useStyles } from '@/hooks/use-style';

const moduleStyles: CreateStyleFunc = (colors, brightness) => ({
    categoryWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: brightness(colors.background, -10),
    },
    categoryText: {
        fontFamily: fonts.poppins.medium,
        fontSize: 16,
        color: colors.text,
        textTransform: 'lowercase',
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
        color: colors.white,
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
});

export default function ListScreen() {
    const { styles, colors, brightness } = useStyles(moduleStyles);
    const router = useRouter();
    const [showAllItems, setShowAllItems] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchBarRef = useRef<any>(null);

    useHeader({
        searchBarRef: searchBarRef,
        searchPlaceholder: 'search list...',
        onChangeSearch: (event: any) => setSearchTerm(event.nativeEvent.text),
        onCancelSearch: () => setSearchTerm(''),
        headerItems: [
            {
                label: 'new item',
                icon: {
                    name: ['list.bullet', 'list'],
                },
                onPress: () => setShowAllItems(!showAllItems),
                selected: showAllItems,
            },
            {
                label: 'new item',
                icon: {
                    name: ['plus', 'plus'],
                },
                onPress: () => router.push('/list/edit'),
            },
        ],
    });

    const {
        categories: { data: categoryList },
    } = useCategory();
    const { pantry, savePantryItem, deletePantryItem } = usePantry();

    const filteredPantryItems = pantry?.pantryItems.filter((item: PantryItem) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = filteredPantryItems
        ?.reduce<any[]>((acc, item: PantryItem) => {
            const shouldInclude = showAllItems || !!searchTerm ? true : item.isInShoppingList;
            if (!shouldInclude) return acc;

            const entryItem =
                (showAllItems || !!searchTerm) && !item.isInShoppingList
                    ? { ...item, canBeAdded: true }
                    : item;

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

    const handleAddItem = async (id: number) => {
        await savePantryItem({ id, isInShoppingList: true });
    };

    const isLoading = !categoryList || !pantry;

    return (
        <Screen isLoading={isLoading}>
            <Heading title='Shopping List' />
            {categories?.map((itemCategory: ItemCategory) => (
                <View key={itemCategory.id}>
                    <View style={styles.categoryWrapper}>
                        <Text style={styles.categoryText}>{itemCategory.icon}</Text>
                        <Text style={styles.categoryText}>{itemCategory.name}</Text>
                    </View>
                    <List>
                        {itemCategory.pantryItems
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((pantryItem: any, index: number) => (
                                <ListItem
                                    dimmed={pantryItem.canBeAdded}
                                    key={pantryItem.id || `new-${index}`}
                                    text={pantryItem.name}
                                    onPress={
                                        pantryItem.canBeAdded
                                            ? () => handleAddItem(pantryItem.id)
                                            : () =>
                                                  savePantryItem({
                                                      id: pantryItem.id,
                                                      isInShoppingList: false,
                                                      isInStock: true,
                                                      purchasedAt: new Date(),
                                                  })
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
                                                              : brightness(colors.background, -40)
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
                                                      onPress: () =>
                                                          deletePantryItem(pantryItem.id),
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
                    <Button text='add your first item' onPress={() => {}} />
                    <Text style={styles.onboardingText}>or</Text>
                    <Button text='join a household' onPress={() => router.push('/profile/join')} />
                </View>
            )}
        </Screen>
    );
}
