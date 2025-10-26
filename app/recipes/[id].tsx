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
    const params = useLocalSearchParams<{ id: string; suggestion: string }>();
    const id = Number(params.id);
    const suggestion: RecipeSuggestion | null = params.suggestion
        ? JSON.parse(params.suggestion)
        : null;

    console.log(suggestion);

    const suggestedRecipe: Recipe | null = suggestion
        ? {
              id: -1,
              name: suggestion.name,
              prepTime: suggestion.prepTime || '',
              cookTime: suggestion.cookTime || '',
              servings: suggestion.servings || '',
              ingredients:
                  suggestion.ingredients?.map((ingredient) => ({ sentence: ingredient })) || [],
              instructions: suggestion.instructions,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
          }
        : null;

    const router = useRouter();
    const { user } = useApi();

    const {
        recipe: { isFetching, data: recipe, refetch },
        deleteRecipe,
    } = useRecipe({ recipeId: id, enabled: !suggestion });

    const { pantry, savePantryItem } = usePantry();

    useHeader({
        dependencies: [router],
        headerItems: !id ? [
            {
                label: 'save recipe',
                onPress: () => {}
            }
        ] : [
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

    const renderRecipe = recipe || suggestedRecipe;
    const highlight = (instruction: string) =>
        highlightInstructions(recipe?.ingredients.map((i) => i.item || '') || [], instruction);

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    return (
        <Screen
            isLoading={!user || (isFetching && !renderRecipe)}
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
            <PageTitle>{renderRecipe?.name}</PageTitle>
            <View style={[styles.content, styles.timeLabels]}>
                <TimeLabel label={'prep time'} time={renderRecipe?.prepTime ?? ''} />
                <TimeLabel label={'cook time'} time={renderRecipe?.cookTime ?? ''} />
            </View>
            <View style={styles.content}>
                <Text style={styles.h2}>Ingredients</Text>
                <View>
                    {renderRecipe?.ingredients?.map((ingredient, index) => (
                        <Ingredient
                            key={
                                typeof ingredient === 'object' &&
                                'id' in ingredient &&
                                ingredient.id
                                    ? ingredient.id
                                    : index
                            }
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
                    {renderRecipe?.instructions?.map((instruction, i) => (
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
                                                                  renderRecipe?.ingredients[
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
