import Button from '@/components/button';
import Heading from '@/components/heading';
import RecipeListing from '@/components/recipe-listing';
import Screen from '@/components/screen';
import TagPill from '@/components/tag-pill';
import Text from '@/components/text';
import { useHeader } from '@/hooks/use-header';
import { usePantry } from '@/hooks/use-pantry';
import { useRecipe } from '@/hooks/use-recipe';
import globalStyles, { colors, fonts } from '@/styles/global';
import { getAvailableIngredients } from '@/util/recipe';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { createRef, useCallback, useRef, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

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
            marginBottom: 8,
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
        recipes: { data: recipes, isFetching: isRecipesLoading, error: recipesError, refetch },
        deleteRecipe,
    } = useRecipe();

    const {
        pantries: { error: pantryError, isFetching: isPantryLoading },
        pantry,
    } = usePantry();

    const pantryItems = pantry?.pantryItems;

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showTags, setShowTags] = useState<boolean>(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [swipeHeight, setSwipeHeight] = useState<number>(0);
    const swipeRefs = useRef(new Map<number, React.RefObject<any>>());
    const searchBarRef = useRef<any>(null);

    const { isLegacyVersion, SearchBar } = useHeader({
        searchBarRef,
        searchPlaceholder: 'search recipes...',
        onChangeSearch: (event: any) => setSearchTerm(event.nativeEvent.text),
        onCancelSearch: () => setSearchTerm(''),
        dependencies: [showTags, router],
        headerItems: [
            {
                label: 'filter recipes',
                icon: {
                    name: 'line.3.horizontal.decrease.circle',
                },
                onPress: () => setShowTags(!showTags),
                selected: showTags,
            },
            {
                label: 'new recipe',
                icon: {
                    name: 'plus',
                },
                tintColor: colors.primary,
                onPress: () => router.push('/recipes/new'),
            },
        ],
    });

    const updateHeight = useCallback(
        (r: any) => {
            if (swipeHeight !== r.nativeEvent.layout.height) {
                setSwipeHeight(r.nativeEvent.layout.height);
            }
        },
        [swipeHeight]
    );

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

    const isLoading = isRecipesLoading || isPantryLoading;

    if (recipes && !recipes.sort) {
        console.log(recipes);
    }

    const sortedRecipes = recipes?.sort((a, b) => {
        const aRatio =
            getAvailableIngredients(a, pantryItems || []).length / (a.ingredients.length || 1);
        const bRatio =
            getAvailableIngredients(b, pantryItems || []).length / (b.ingredients.length || 1);
        if (aRatio === bRatio) {
            return a.name.localeCompare(b.name);
        }
        return bRatio - aRatio;
    });

    const searchedRecipes = searchTerm
        ? sortedRecipes?.filter((recipe) =>
              recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : sortedRecipes;

    const tags: string[] = Array.from(
        new Set(searchedRecipes?.flatMap((r) => r.tags?.map((t) => t.name) || []))
    );

    const taggedRecipes = searchedRecipes?.filter((recipe) => {
        if (selectedTags.length === 0) return true;
        const recipeTagNames = recipe.tags?.map((t) => t.name) || [];
        return selectedTags.every((tag) => recipeTagNames.includes(tag));
    });

    const filteredRecipes = taggedRecipes;

    return (
        <Screen
            isLoading={isLoading && !filteredRecipes}
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
                    {filteredRecipes?.map((recipe: Recipe) => {
                        if (!swipeRefs.current.has(recipe.id)) {
                            swipeRefs.current.set(recipe.id, createRef<any>());
                        }
                        const swipeRef = swipeRefs.current.get(recipe.id);

                        return (
                            <Swipeable
                                key={recipe.id}
                                ref={swipeRef}
                                renderRightActions={(prog, trans) =>
                                    RightAction(
                                        prog,
                                        trans,
                                        swipeHeight,
                                        recipe,
                                        (id, ref) => {
                                            deleteRecipe(id, () => ref?.close());
                                        },
                                        () => router.push(`/recipes/edit/${recipe.id}`),
                                        swipeRef
                                    )
                                }
                            >
                                <RecipeListing
                                    key={recipe.id}
                                    recipe={recipe}
                                    pantryItems={pantryItems!}
                                    onLayout={updateHeight}
                                />
                            </Swipeable>
                        );
                    })}
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
                            add a recipe for "{searchTerm}"
                        </Text>
                        <SymbolView name='chevron.right' size={12} tintColor={colors.primary} />
                    </Pressable>
                </View>
            )}
            {!recipes?.length && (
                <View style={styles.onboarding}>
                    <Text style={styles.onboardingText}>you don't have any recipes yet</Text>
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

function RightAction(
    prog: SharedValue<number>,
    drag: SharedValue<number>,
    width: number,
    recipe: Recipe,
    proposeRemoveItem: (id: number, ref?: any) => void,
    handleEditItem: () => void,
    swipeRef?: React.RefObject<any>
) {
    const styleAnimation = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: drag.value + width * 2 }],
        };
    });

    const close = (fn: Function, ...args: any) => {
        fn(...args);
        swipeRef?.current?.close();
    };

    return (
        <Reanimated.View style={styleAnimation}>
            <View style={{ flexDirection: 'row' }}>
                <Pressable onPress={() => close(handleEditItem)}>
                    <Feather name='edit-2' size={24} color='#fff' style={styles.editAction} />
                </Pressable>
                <Pressable onPress={() => close(proposeRemoveItem, recipe.id, swipeRef?.current)}>
                    <Feather name='trash-2' size={24} color='#fff' style={styles.deleteAction} />
                </Pressable>
            </View>
        </Reanimated.View>
    );
}
