import Button from '@/components/button';
import Heading from '@/components/heading';
import List from '@/components/list';
import ListItem from '@/components/list-item';
import Screen from '@/components/screen';
import TagPill from '@/components/tag-pill';
import Text from '@/components/text';
import { useHeader } from '@/hooks/use-header';
import { usePantry } from '@/hooks/use-pantry';
import { useRecipe } from '@/hooks/use-recipe';
import globalStyles, { colors, fonts } from '@/styles/global';
import { getAvailableIngredients } from '@/util/recipe';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useRef, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
        tagContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            paddingVertical: 16,
            paddingHorizontal: 16,
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

export default function RecipeScreen() {
    const router = useRouter();

    const {
        recipesQuery: { error: recipesError, refetch },
        recipesIsBusy,
        recipes,
        deleteRecipe,
    } = useRecipe();

    const {
        pantriesQuery: { error: pantryError },
        pantriesIsBusy,
        pantry,
    } = usePantry();

    const isLoading = recipesIsBusy || pantriesIsBusy;
    const pantryItems = pantry?.pantryItems;

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showTags, setShowTags] = useState<boolean>(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const searchBarRef = useRef<any>(null);

    const { isLegacyVersion, SearchBar } = useHeader({
        searchBarRef,
        searchPlaceholder: 'search recipes...',
        onChangeSearch: (event: any) => setSearchTerm(event.nativeEvent.text),
        onCancelSearch: () => setSearchTerm(''),
        headerItems: [
            {
                label: 'suggest recipes',
                icon: {
                    name: 'sparkles',
                },
                onPress: () =>
                    router.push({
                        pathname: '/recipes/suggest',
                        params: {
                            pantryId: pantry!.id,
                            tags,
                        },
                    }),
            },
            {
                label: 'new recipe',
                icon: {
                    name: 'plus',
                },
                onPress: () => router.push('/recipes/new'),
            },
        ],
    });

    const toggleTagSelected = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    if (recipesError) {
        console.log('Error fetching recipes:', recipesError);
    }

    if (pantryError) {
        console.log('Error fetching pantry:', pantryError);
    }

    const sortedRecipes = useMemo(() => {
        if (!recipes) return [];
        return [...recipes].sort((a, b) => {
            const aRatio =
                getAvailableIngredients(a, pantryItems || []).length / (a.ingredients.length || 1);
            const bRatio =
                getAvailableIngredients(b, pantryItems || []).length / (b.ingredients.length || 1);
            if (aRatio === bRatio) {
                return a.name.localeCompare(b.name);
            }
            return bRatio - aRatio;
        });
    }, [recipes, pantryItems]);

    const searchedRecipes = useMemo(() => {
        if (!searchTerm) return sortedRecipes;
        return sortedRecipes?.filter((recipe) =>
            recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedRecipes, searchTerm]);

    const tags = useMemo(() => {
        return Array.from(
            new Set(searchedRecipes?.flatMap((r) => r.tags?.map((t) => t.name) || []))
        );
    }, [searchedRecipes]);

    const filteredRecipes = useMemo(() => {
        if (!selectedTags.length) return searchedRecipes;
        return searchedRecipes?.filter((recipe) => {
            const recipeTagNames = recipe.tags?.map((t) => t.name) || [];
            return selectedTags.every((tag) => recipeTagNames.includes(tag));
        });
    }, [searchedRecipes, selectedTags]);

    return (
        <Screen
            isLoading={isLoading}
            footerItems={isLegacyVersion ? [<SearchBar key='search-bar' />] : undefined}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => {
                        setIsRefreshing(true);
                        refetch().finally(() => setIsRefreshing(false));
                    }}
                />
            }
        >
            <Heading title='Recipes' />
            <View style={{ paddingHorizontal: 16, marginBottom: showTags ? 0 : 16 }}>
                <Button
                    style={{ flex: 1 }}
                    outlined={!showTags}
                    variant='pill'
                    text={`filter recipes${selectedTags.length ? ` (${selectedTags.length})` : ''}`}
                    leftIcon='line.3.horizontal.decrease'
                    onPress={() => {
                        setShowTags(!showTags);
                    }}
                />
            </View>
            {showTags && (
                <View style={styles.tagContainer}>
                    {tags.map((tag) => (
                        <TagPill
                            key={tag}
                            text={tag}
                            onPress={() => toggleTagSelected(tag)}
                            isActive={selectedTags.includes(tag)}
                        />
                    ))}
                </View>
            )}
            {!!filteredRecipes?.length && (
                <GestureHandlerRootView>
                    <List>
                        {filteredRecipes?.map((recipe: Recipe) => {
                            const availableIngredients = getAvailableIngredients(
                                recipe,
                                pantryItems || []
                            );
                            const itemStatus =
                                availableIngredients.length === recipe.ingredients.length
                                    ? 'success'
                                    : availableIngredients.length > 0
                                      ? 'warning'
                                      : 'indeterminate';

                            return (
                                <ListItem
                                    key={recipe.id}
                                    text={recipe.name}
                                    status={itemStatus}
                                    onPress={() => router.push(`/recipes/${recipe.id}`)}
                                    rightAdornment={() => (
                                        <Text>
                                            {availableIngredients.length} /{' '}
                                            {recipe.ingredients.length}
                                        </Text>
                                    )}
                                    rightActions={[
                                        {
                                            icon: 'edit-2',
                                            color: colors.primary,
                                            onPress: () =>
                                                router.push(`/recipes/edit/${recipe.id}`),
                                        },
                                        {
                                            icon: 'trash-2',
                                            color: colors.error,
                                            onPress: (ref: React.RefObject<any>) =>
                                                deleteRecipe(recipe.id, () =>
                                                    ref?.current?.close()
                                                ),
                                        },
                                    ]}
                                />
                            );
                        })}
                    </List>
                </GestureHandlerRootView>
            )}
            {!filteredRecipes?.length && !!searchTerm && (
                <View style={styles.onboarding}>
                    <Text style={styles.onboardingText}>no items match your search</Text>
                    <Pressable
                        style={styles.addSearchTerm}
                        onPress={() => {
                            const newName = searchTerm;
                            setSearchTerm('');
                            searchBarRef.current?.clearText();
                            router.push({
                                pathname: '/recipes/new',
                                params: { newName },
                            });
                        }}
                    >
                        <Text style={styles.addSearchTermText}>
                            add a recipe for &ldquo;{searchTerm}&rdquo;
                        </Text>
                        <SymbolView name='chevron.right' size={12} tintColor={colors.primary} />
                    </Pressable>
                </View>
            )}
            {!isLoading && !recipes?.length && (
                <View style={styles.onboarding}>
                    <Text style={styles.onboardingText}>you don&lsquo;t have any recipes yet</Text>
                    <Button
                        text='create your first recipe'
                        onPress={() => router.push('/recipes/new')}
                    />
                    <Text style={styles.onboardingText}>or</Text>
                    <Button text='join a household' onPress={() => router.push('/profile/join')} />
                </View>
            )}
        </Screen>
    );
}
