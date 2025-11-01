import Button from '@/components/button';
import Heading from '@/components/heading';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import Screen from '@/components/screen';
import SystemIcon from '@/components/system-icon';
import { useCategory } from '@/hooks/use-category';
import { useHeader } from '@/hooks/use-header';
import { usePantry } from '@/hooks/use-pantry';
import { fonts } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAI } from '@/hooks/use-ai';
import { useStyles } from '@/hooks/use-style';

const moduleStyles: CreateStyleFunc = (colors) => ({
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
});

export default function PantryScreen() {
    const { styles, colors, brightness } = useStyles(moduleStyles);
    const router = useRouter();
    const {
        categories: { data: categories },
    } = useCategory();

    const { pantry, savePantryItem, finishPantryItem, deletePantryItem } = usePantry();
    const { expiringPantryItems } = useAI({ pantryId: pantry?.id });

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
                    name: ['plus', 'plus'],
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

    const handleSaveChanges = (patch: Partial<PantryItem>, cb?: Function) => {
        savePantryItem(patch, {
            onSuccess: () => cb?.(),
        });
    };

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
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            gap: 12,
                                            alignItems: 'center',
                                        }}
                                    >
                                        {expiringPantryItems?.some(
                                            (i: any) => i.id === pantryItem.id
                                        ) && (
                                            <SystemIcon
                                                ios='calendar.badge.exclamationmark'
                                                android='alert-circle-outline'
                                                color={colors.pink}
                                                size={24}
                                            />
                                        )}
                                        <Pressable
                                            onPress={() =>
                                                handleSaveChanges({
                                                    id: pantryItem.id,
                                                    isFavorite: !pantryItem.isFavorite,
                                                })
                                            }
                                        >
                                            <SystemIcon
                                                ios='repeat'
                                                android='repeat'
                                                size={24}
                                                color={
                                                    pantryItem.isFavorite
                                                        ? colors.primary
                                                        : brightness(colors.background, -40)
                                                }
                                            />
                                        </Pressable>
                                    </View>
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
                        <SystemIcon
                            ios='chevron.right'
                            android='chevron-right'
                            size={12}
                            color={colors.primary}
                        />
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
