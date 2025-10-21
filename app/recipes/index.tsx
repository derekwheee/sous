import Button from '@/components/button';
import Heading from '@/components/heading';
import RecipeListing from '@/components/recipe-listing';
import Screen from '@/components/screen';
import TagPill from '@/components/tag-pill';
import Text from '@/components/text';
import { useApi } from '@/hooks/use-api';
import globalStyles, { colors, fonts } from '@/styles/global';
import { DeleteRecipe, Pantry, Recipe } from '@/types/interfaces';
import { standardMutation } from '@/util/query';
import { getAvailableIngredients } from '@/util/recipe';
import Feather from '@expo/vector-icons/Feather';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigation, useRouter } from 'expo-router';
import { createRef, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Alert, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
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
    }),
};

export default function RecipeScreen() {
    const { user, getRecipes, getPantries, deleteRecipe } = useApi();
    const queryClient = useQueryClient();

    const {
        isFetching: isRecipeLoadingerror,
        error: recipeError,
        data: recipes,
        refetch,
    } = useQuery<Recipe[]>({
        queryKey: ['recipes'],
        queryFn: () => getRecipes(),
        enabled: !!user,
    });

    const {
        isFetching: isPantryLoading,
        error: pantryError,
        data: pantries,
    } = useQuery<Pantry[]>({
        queryKey: ['pantry'],
        queryFn: () => getPantries(),
        enabled: !!user,
    });

    const { mutate: handleDeleteRecipe } = useMutation(
        standardMutation<any, DeleteRecipe>(
            ({ id }: DeleteRecipe) => deleteRecipe(id),
            queryClient,
            ['recipes'],
            { isDelete: true }
        )
    );

    const pantryItems = pantries?.[0]?.pantryItems;
    const navigation = useNavigation();
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showTags, setShowTags] = useState<boolean>(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [swipeHeight, setSwipeHeight] = useState<number>(0);
    const swipeRefs = useRef(new Map<number, React.RefObject<any>>());

    const updateHeight = useCallback(
        (r: any) => {
            if (swipeHeight !== r.nativeEvent.layout.height) {
                setSwipeHeight(r.nativeEvent.layout.height);
            }
        },
        [swipeHeight]
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerSearchBarOptions: {
                placeholder: 'search recipes...',
                tintColor: colors.primary,
                onChangeText: (event: any) => setSearchTerm(event.nativeEvent.text),
            },
        });
    }, [navigation]);

    const toggleTagSelected = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

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
        await handleDeleteRecipe({ id });
    };

    if (recipeError) {
        console.log('Error fetching recipes:', recipeError);
    }

    if (pantryError) {
        console.log('Error fetching pantry:', pantryError);
    }

    const isLoading = !user || isRecipeLoadingerror || isPantryLoading;

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
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => {
                        setIsRefreshing(true);
                        refetch().finally(() => setIsRefreshing(false));
                    }}
                />
            }
            actions={[
                {
                    label: 'filter',
                    icon: showTags
                        ? 'line.3.horizontal.decrease.circle.fill'
                        : 'line.3.horizontal.decrease.circle',
                    onPress: () => setShowTags(!showTags),
                },
                {
                    icon: 'plus',
                    onPress: () => router.push('/recipes/new'),
                },
            ]}
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
                                    proposeRemoveItem,
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
