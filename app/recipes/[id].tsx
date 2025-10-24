import Ingredient from '@/components/ingredient';
import PageTitle from '@/components/page-title';
import Screen from '@/components/screen';
import Text from '@/components/text';
import TimeLabel from '@/components/time-label';
import { useApi } from '@/hooks/use-api';
import { useHeader } from '@/hooks/use-header';
import { usePantry } from '@/hooks/use-pantry';
import { useRecipe } from '@/hooks/use-recipe';
import globalStyles, { colors, fonts } from '@/styles/global';
import { highlightInstructions } from '@/util/highligher';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        timeLabels: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        instructionContainer: {
            flex: 1,
            flexDirection: 'row',
            marginBottom: 16,
        },
        instructionIndex: {
            position: 'relative',
            top: -8,
            width: 48,
            fontFamily: fonts.poppins.bold,
            fontSize: 32,
        },
        instructionText: {
            flexShrink: 1,
            fontSize: 14,
        },
    }),
};

export default function RecipeDetail() {
    const id = Number(useLocalSearchParams<{ id: string }>().id);

    const router = useRouter();
    const { user } = useApi();

    const {
        recipe: { isFetching, data: recipe, refetch },
        deleteRecipe,
    } = useRecipe({ recipeId: id });

    const { pantry, savePantryItem } = usePantry();

    useHeader({
        dependencies: [router],
        headerItems: [
            {
                type: 'menu',
                label: 'edit recipe',
                icon: {
                    name: 'ellipsis',
                },
                menu: {
                    items: [
                        {
                            type: 'action',
                            label: 'I made this',
                            icon: {
                                type: 'sfSymbol',
                                name: 'checkmark',
                            },
                            onPress: () => router.push(`/recipes/edit/${id}`),
                        },
                        {
                            type: 'action',
                            label: 'edit recipe',
                            icon: {
                                type: 'sfSymbol',
                                name: 'pencil',
                            },
                            onPress: () => router.push(`/recipes/edit/${id}`),
                        },
                        {
                            destructive: true,
                            type: 'action',
                            label: 'delete recipe',
                            icon: {
                                type: 'sfSymbol',
                                name: 'trash',
                            },
                            onPress: () => deleteRecipe(id, () => router.push('/recipes')),
                        },
                    ],
                },
            },
        ],
    });

    const handleAddToShoppingList = async (ingredient: Ingredient, pantryItem?: PantryItem) => {
        if (pantryItem?.isInShoppingList) {
            return;
        }

        await savePantryItem({
            name: pantryItem?.name || ingredient.item,
            isInShoppingList: true,
        });
    };

    const highlight = (instruction: string) =>
        highlightInstructions(recipe?.ingredients.map((i) => i.item || '') || [], instruction);

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    return (
        <Screen
            isLoading={!user || (isFetching && !recipe)}
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
            <PageTitle>{recipe?.name}</PageTitle>
            <View style={[styles.content, styles.timeLabels]}>
                <TimeLabel label={'prep time'} time={recipe?.prepTime ?? ''} />
                <TimeLabel label={'cook time'} time={recipe?.cookTime ?? ''} />
            </View>
            <View style={styles.content}>
                <Text style={styles.h2}>Ingredients</Text>
                <View>
                    {recipe?.ingredients?.map((ingredient) => (
                        <Ingredient
                            key={ingredient.id}
                            ingredient={ingredient}
                            pantry={pantry}
                            onPress={handleAddToShoppingList}
                        />
                    ))}
                </View>
            </View>
            <View style={styles.content}>
                <Text style={styles.h2}>Instructions</Text>
                <View style={{ flex: 1 }}>
                    {recipe?.instructions?.map((instruction, i) => (
                        <View key={i} style={styles.instructionContainer}>
                            <Text style={styles.instructionIndex}>{i + 1}</Text>
                            <Text style={styles.instructionText}>
                                {highlight(instruction).map(
                                    ({ text, isHighlighted, match }, key) => {
                                        return (
                                            <Text
                                                key={key}
                                                style={
                                                    isHighlighted ? { color: colors.primary } : {}
                                                }
                                                {...(isHighlighted
                                                    ? {
                                                          onPress: () => {
                                                              console.log(
                                                                  text,
                                                                  match,
                                                                  recipe?.ingredients[
                                                                      match.refIndex
                                                                  ]?.sentence
                                                              );
                                                          },
                                                      }
                                                    : {})}
                                            >
                                                {text}
                                            </Text>
                                        );
                                    }
                                )}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </Screen>
    );
}
