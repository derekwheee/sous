import Button from '@/components/button';
import Heading from '@/components/heading';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import Screen from '@/components/screen';
import { useCategory } from '@/hooks/use-category';
import { useHeader } from '@/hooks/use-header';
import { usePantry } from '@/hooks/use-pantry';
import globalStyles, { colors, fonts } from '@/styles/global';
import { getDefault } from '@/util/pantry';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        onboarding: {
            alignItems: 'center',
            marginVertical: 128,
            gap: 16,
        },
        onboardingText: {
            fontSize: 16,
            fontFamily: fonts.caprasimo,
        },
        addSearchTerm: {
            flexDirection: 'row',
            gap: 4,
            alignItems: 'center',
        },
        addSearchTermText: {
            color: colors.primary,
        },
    }),
};

export default function PantryScreen() {
    const router = useRouter();
    const {
        categories: { data: categories },
    } = useCategory();

    const { pantries, savePantryItem, finishPantryItem, deletePantryItem } = usePantry();

    const searchBarRef = useRef<any>(null);

    const { isLegacyVersion, SearchBar } = useHeader({
        searchBarRef,
        searchPlaceholder: 'search pantry...',
        onChangeSearch: (event: any) => setSearchTerm(event.nativeEvent.text),
        onCancelSearch: () => setSearchTerm(''),
        headerItems: [
            {
                label: 'new item',
                icon: {
                    name: 'plus',
                },
                onPress: () =>
                    router.push({
                        pathname: '/pantry/edit',
                        params: { pantryId: pantry!.id },
                    }),
            },
        ],
    });

    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSaveChanges = (patch: UpsertPantryItem, cb?: Function) => {
        savePantryItem(patch, {
            onSuccess: () => cb?.(),
        });
    };

    const pantry = getDefault(pantries);
    const pantryItems = pantry?.pantryItems;
    const sortedPantry = pantryItems
        ?.sort((a, b) => {
            if (a.isInStock === b.isInStock) {
                return a.name.localeCompare(b.name);
            }
            return a.isInStock ? -1 : 1;
        })
        .filter((item) => {
            return (
                !!searchTerm || (!item.category?.isNonFood && (item.isInStock || item.isFavorite))
            );
        });

    const filteredPantry = searchTerm
        ? sortedPantry?.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : sortedPantry;

    const isLoading = !filteredPantry || !categories;

    return (
        <Screen
            isLoading={isLoading}
            footerItems={isLegacyVersion ? [<SearchBar key='search-bar' />] : undefined}
        >
            <Heading title='Pantry' />
            {!!filteredPantry?.length && !!categories?.length && (
                <List>
                    {filteredPantry?.map((pantryItem: PantryItem) => {
                        return (
                            <ListItem
                                key={pantryItem.id}
                                text={pantryItem.name}
                                status={pantryItem.isInStock ? 'success' : 'indeterminate'}
                                rightAdornment={() => (
                                    <Pressable
                                        onPress={() =>
                                            handleSaveChanges({
                                                id: pantryItem.id,
                                                isFavorite: !pantryItem.isFavorite,
                                            })
                                        }
                                    >
                                        <SymbolView
                                            name={'repeat'}
                                            size={24}
                                            tintColor={
                                                pantryItem.isFavorite ? colors.primary : '#ccc'
                                            }
                                        />
                                    </Pressable>
                                )}
                                leftActions={[
                                    {
                                        icon: 'slash',
                                        iconColor: colors.text,
                                        color: colors.warning,
                                        onPress: (ref: React.RefObject<any>) => {
                                            finishPantryItem(pantryItem, () => {
                                                ref?.current?.close();
                                            });
                                        },
                                    },
                                ]}
                                rightActions={[
                                    {
                                        icon: 'edit-2',
                                        color: colors.primary,
                                        onPress: (ref: React.RefObject<any>) => {
                                            ref?.current?.close();
                                            router.push({
                                                pathname: '/pantry/edit',
                                                params: {
                                                    pantryItemId: pantryItem.id,
                                                    pantryId: pantry!.id,
                                                },
                                            });
                                        },
                                    },
                                    {
                                        icon: 'trash-2',
                                        color: colors.error,
                                        onPress: (ref: React.RefObject<any>) => {
                                            deletePantryItem(pantryItem.id, () => {
                                                ref?.current?.close();
                                            });
                                        },
                                    },
                                ]}
                            />
                        );
                    })}
                </List>
            )}
            {!filteredPantry?.length && !!searchTerm && (
                <View style={styles.onboarding}>
                    <Text style={styles.onboardingText}>no items match your search</Text>
                    <Pressable
                        style={styles.addSearchTerm}
                        onPress={() => {
                            const newName = searchTerm;
                            setSearchTerm('');
                            searchBarRef.current?.clearText();
                            router.push({
                                pathname: '/pantry/edit',
                                params: { pantryId: pantry!.id, newName },
                            });
                        }}
                    >
                        <Text style={styles.addSearchTermText}>
                            add &ldquo;{searchTerm}&rdquo; to your pantry
                        </Text>
                        <SymbolView name='chevron.right' size={12} tintColor={colors.primary} />
                    </Pressable>
                </View>
            )}
            {!isLoading && !pantry && (
                <View style={styles.onboarding}>
                    <Text style={styles.onboardingText}>
                        you don&apos;t have anything in your pantry
                    </Text>
                    <Button
                        text='add your first item'
                        onPress={() =>
                            router.push({
                                pathname: '/pantry/edit',
                                params: { pantryId: pantry!.id },
                            })
                        }
                    />
                    <Text style={styles.onboardingText}>or</Text>
                    <Button text='join a household' onPress={() => router.push('/profile/join')} />
                </View>
            )}
        </Screen>
    );
}
