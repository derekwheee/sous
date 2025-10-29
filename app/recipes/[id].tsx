import Button from '@/components/button';
import Ingredient from '@/components/ingredient';
import PageTitle from '@/components/page-title';
import Screen from '@/components/screen';
import Text from '@/components/text';
import TimeLabel from '@/components/time-label';
import { useApi } from '@/hooks/use-api';
import { useHeader } from '@/hooks/use-header';
import { usePantry } from '@/hooks/use-pantry';
import { useRecipe } from '@/hooks/use-recipe';
import globalStyles, { brightness, colors, fonts } from '@/styles/global';
import { highlightInstructions } from '@/util/highligher';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Fraction } from 'fraction.js';
import { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { Slider } from 'tamagui';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        timeLabels: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
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

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [scaleValue, setScaleValue] = useState<number | null>(null);
    const [scaledRecipe, setScaledRecipe] = useState<Recipe | null>(null);
    const [disableScroll, setDisableScroll] = useState<boolean>(false);
    const [disableSwipe, setDisableSwipe] = useState<boolean>(false);

    const scaleRecipe: boolean = scaleValue !== null;

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
        recipeQuery: { refetch },
        recipeIsBusy,
        recipe,
        deleteRecipe,
    } = useRecipe({ recipeId: id, enabled: !suggestion });

    const { pantry, savePantryItem } = usePantry();

    useHeader({
        gestureEnabled: !disableSwipe,
        headerItems: !id
            ? [
                  {
                      label: 'save recipe',
                      onPress: () => {},
                  },
              ]
            : [
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

    useEffect(() => {
        if (renderRecipe) {
            const toScale = { ...renderRecipe };
            const scaledIngredients = toScale.ingredients.map((ingredient) =>
                scaleIngredientSentence(ingredient, scaleValue)
            );
            toScale.ingredients = scaledIngredients;
            setScaledRecipe(toScale);
        }
    }, [scaleValue, renderRecipe]);

    const highlight = (instruction: string) =>
        highlightInstructions(recipe?.ingredients.map((i) => i.item || '') || [], instruction);

    return (
        <Screen
            scrollEnabled={!disableScroll}
            isLoading={!user || recipeIsBusy || !scaledRecipe}
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
            <PageTitle>{scaledRecipe?.name}</PageTitle>
            <View style={[styles.content, styles.timeLabels]}>
                <TimeLabel label={'prep time'} time={scaledRecipe?.prepTime ?? ''} />
                <TimeLabel label={'cook time'} time={scaledRecipe?.cookTime ?? ''} />
            </View>
            <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 16 }}>
                <Button
                    style={{ flex: 1 }}
                    variant='pill'
                    text='scale recipe'
                    leftIcon={
                        !scaleRecipe
                            ? 'arrow.up.left.and.arrow.down.right'
                            : 'arrow.down.right.and.arrow.up.left'
                    }
                    onPress={() => {
                        setDisableSwipe((prev) => !prev);
                        setScaleValue((prev) => (prev !== null ? null : 0));
                    }}
                />
                <Button
                    // invert={scaleRecipe}
                    outlined={!scaleRecipe}
                    variant='pill'
                    text={`${scaleServings(scaledRecipe?.servings, scaleValue)} servings`}
                    // leftIcon='arrow.up.left.and.arrow.down.right'
                    onPress={() => {}}
                />
            </View>
            {scaleRecipe && (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 16,
                        flex: 1,
                        paddingTop: 59,
                        paddingBottom: 16,
                        paddingHorizontal: 16,
                        marginHorizontal: 16,
                        marginTop: -43,
                        borderRadius: 20,
                        backgroundColor: colors.primary,
                        zIndex: -1,
                    }}
                >
                    <Slider
                        style={{ flex: 1 }}
                        value={[scaleValue || 0]}
                        min={-3}
                        max={3}
                        onValueChange={([value]) => setScaleValue(value)}
                        onSlideStart={() => setDisableScroll(true)}
                        onSlideEnd={() => setDisableScroll(false)}
                    >
                        <Slider.Track
                            style={{
                                backgroundColor: brightness(colors.primary, 128),
                            }}
                        >
                            <Slider.TrackActive
                                style={{
                                    backgroundColor: brightness(colors.primary, 128),
                                }}
                            />
                        </Slider.Track>
                        <Slider.Thumb
                            size='$1'
                            index={0}
                            circular
                            chromeless
                            style={{
                                backgroundColor: '#fff',
                            }}
                        />
                    </Slider>
                    <Button
                        invert
                        outlined
                        variant='pill'
                        text={convertScale(scaleValue).toString()}
                        style={{ width: 72 }}
                    />
                </View>
            )}
            <View style={styles.content}>
                <Text style={styles.h2}>Ingredients</Text>
                <View>
                    {scaledRecipe?.ingredients?.map((ingredient, index) => (
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
                    {scaledRecipe?.instructions?.map((instruction, i) => (
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
                                                                  scaledRecipe?.ingredients[
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

function convertScale(x: number | null): string {
    if (x === null) {
        return '--';
    }

    return (
        {
            '-3': '1/4',
            '-2': '1/3',
            '-1': '1/2',
            '0': '1',
            '1': '1 1/2',
            '2': '2',
            '3': '3',
        }[x.toString()] || x.toString()
    );
}

function convertScaleToNumber(x: number): number {
    return (
        {
            '-3': 0.25,
            '-2': 0.3333,
            '-1': 0.5,
            '0': 1,
            '1': 1.5,
            '2': 2,
            '3': 3,
        }[x.toString()] || x
    );
}

function decimalToFraction(decimal: number): string {
    const fraction = new Fraction(decimal);

    return fraction.simplify(0.001).toFraction(true);
}

function scaleIngredientSentence(ingredient: Ingredient, scaleValue: number | null): Ingredient {
    const amount = ingredient.json.amount[0];

    if (!amount) {
        return ingredient;
    }

    const factor = convertScaleToNumber(scaleValue || 0);

    const scaledAmount = amount.RANGE
        ? `${decimalToFraction(amount.quantity * factor)}-${decimalToFraction(
              amount.quantity_max * factor
          )}`
        : `${decimalToFraction(amount.quantity * factor)}`;

    const [, , fragment, rest] = ingredient.sentence?.split(/(\d)\s([A-z])/) || [];

    if (!fragment || !rest) {
        return ingredient;
    }

    ingredient.sentence = `${scaledAmount} ${fragment}${rest}`;

    return ingredient;
}

function scaleServings(
    servings: string | undefined,
    scaleValue: number | null
): string | undefined {
    if (!servings || scaleValue === null) {
        return servings;
    }

    const [min, max = null] = servings.split('-').map((s) => (s ? parseFloat(s.trim()) : NaN));

    if (isNaN(min)) {
        return servings;
    }

    const factor = convertScaleToNumber(scaleValue);

    const scaledMin = decimalToFraction(min * factor);
    const scaledMax = max !== null ? decimalToFraction(max * factor) : null;

    return `${scaledMin}${scaledMax ? `-${scaledMax}` : ''}`;
}
