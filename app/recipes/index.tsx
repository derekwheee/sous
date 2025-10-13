import Button from '@/components/button';
import Heading from '@/components/heading';
import RecipeListing from '@/components/recipe-listing';
import Screen from '@/components/screen';
import TagPill from '@/components/tag-pill';
import Text from '@/components/text';
import { useApi } from '@/hooks/use-api';
import globalStyles, { colors, fonts } from '@/styles/global';
import { Pantry, Recipe } from '@/types/interfaces';
import { getAvailableIngredients } from '@/util/recipe';
import { useQuery } from '@tanstack/react-query';
import { useNavigation, useRouter } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        onboarding: {
            alignItems: 'center',
            marginVertical: 128,
            gap: 16
        },
        onboardingText: {
            fontSize: 16,
            fontFamily: fonts.caprasimo
        },
        tagContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            paddingVertical: 16,
            paddingHorizontal: 16,
            marginBottom: 8
        }
    })
};

export default function RecipeScreen() {
    const { user, getRecipes, getPantries } = useApi();

    const {
        isFetching: isRecipeLoadingerror,
        error: recipeError,
        data: recipes,
        refetch
    } = useQuery<Recipe[]>({
        queryKey: ['recipes'],
        queryFn: () => getRecipes(),
        enabled: !!user
    });

    const {
        isFetching: isPantryLoading,
        error: pantryError,
        data: pantries,
        refetch: refetchPantries
    } = useQuery<Pantry[]>({
        queryKey: ['pantry'],
        queryFn: () => getPantries(),
        enabled: !!user
    });

    const pantry = pantries?.[0]?.pantryItems;
    const navigation = useNavigation();
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showTags, setShowTags] = useState<boolean>(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerSearchBarOptions: {
                placeholder: 'search recipes...',
                tintColor: colors.primary,
                onChangeText: (event: any) => setSearchTerm(event.nativeEvent.text)
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

    if (recipeError) {
        console.log('Error fetching recipes:', recipeError);
    }

    if (pantryError) {
        console.log('Error fetching pantry:', pantryError);
    }

    const isLoading = !user || isRecipeLoadingerror || isPantryLoading;

    const sortedRecipes = recipes?.sort((a, b) => {
        const aRatio = getAvailableIngredients(a, pantry || []).length / (a.ingredients.length || 1);
        const bRatio = getAvailableIngredients(b, pantry || []).length / (b.ingredients.length || 1);
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

    const tags: string[] = Array.from(new Set(searchedRecipes?.flatMap((r) => r.tags?.map((t) => t.name) || [])));

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
        >
            <Heading
                title='Recipes'
                actions={[
                    {
                        label: 'new recipe',
                        icon: 'plus',
                        onPress: () => router.push('/recipes/new')
                    },
                    {
                        icon: showTags ? 'tag.fill' : 'tag',
                        onPress: () => setShowTags(!showTags)
                    }
                ]}
            />
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
            {filteredRecipes?.map((recipe: Recipe) => (
                <RecipeListing key={recipe.id} recipe={recipe} pantry={pantry!} />
            ))}
            {!recipes?.length && (
                <View style={styles.onboarding}>
                    <Text style={styles.onboardingText}>you don't have any recipes yet</Text>
                    <Button
                        text='create your first recipe'
                        onPress={() => router.push('/recipes/new')}
                    />
                    <Text style={styles.onboardingText}>or</Text>
                    <Button
                        text='join a household'
                        onPress={() => router.push('/profile/join')}
                    />
                </View>
            )}
        </Screen>
    );
}
