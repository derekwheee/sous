import Button from '@/components/button';
import Heading from '@/components/heading';
import PantryListing from '@/components/pantry-listing';
import Screen from '@/components/screen';
import { useApi } from '@/hooks/use-api';
import { useHeader } from '@/hooks/use-header';
import { usePantry } from '@/hooks/use-pantry';
import globalStyles, { colors, fonts } from '@/styles/global';
import { getDefault } from '@/util/pantry';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigation, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import { Platform, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

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
    const queryClient = useQueryClient();
    const navigation = useNavigation();
    const router = useRouter();
    const { user, getItemCategories } = useApi();
    const { OS, Version } = Platform;

    const shouldHideSearchBar = OS !== 'ios' || Number(Version) < 26;

    const {
        pantries: { data: pantries, refetch: refetchPantries },
        savePantryItem,
    } = usePantry();

    const { data: itemCategories } = useQuery<ItemCategory[]>({
        queryKey: ['itemCategories'],
        queryFn: () => getItemCategories(getDefault(pantries)!.id),
        enabled: !!user && !!pantries && pantries.length > 0,
    });

    const searchBarRef = useRef<any>(null);

    useHeader({
        searchBarRef,
        searchPlaceholder: 'search pantry...',
        onChangeSearch: (event: any) => setSearchTerm(event.nativeEvent.text),
        onCancelSearch: () => setSearchTerm(''),
        dependencies: [router],
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

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
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

    const isLoading = !user || !filteredPantry || !itemCategories;

    return (
        <Screen
            isLoading={isLoading}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => {
                        setIsRefreshing(true);
                        refetchPantries().finally(() => setIsRefreshing(false));
                    }}
                />
            }
        >
            <Heading title='Pantry' />
            {!!filteredPantry?.length &&
                !!itemCategories?.length &&
                filteredPantry?.map((pantryItem: PantryItem) => (
                    <PantryListing
                        key={pantryItem.id}
                        pantryItem={pantryItem}
                        onToggleFavorite={handleSaveChanges}
                    />
                ))}
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
                            add "{searchTerm}" to your pantry
                        </Text>
                        <SymbolView name='chevron.right' size={12} tintColor={colors.primary} />
                    </Pressable>
                </View>
            )}
            {!pantry && (
                <View style={styles.onboarding}>
                    <Text style={styles.onboardingText}>
                        you don't have anything in your pantry
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
