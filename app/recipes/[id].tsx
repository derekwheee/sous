import Ingredient from '@/components/ingredient';
import PageTitle from '@/components/page-title';
import Screen from '@/components/screen';
import Text from '@/components/text';
import TimeLabel from '@/components/time-label';
import { useApi } from '@/hooks/use-api';
import globalStyles, { colors, fonts } from '@/styles/global';
import { Recipe } from '@/types/interfaces';
import { findIngredientMatches } from '@/util/recipe';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        timeLabels: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        instructionContainer: {
            flex: 1,
            flexDirection: 'row',
            marginBottom: 16
        },
        instructionIndex: {
            position: 'relative',
            top: -8,
            width: 48,
            fontFamily: fonts.poppins.bold,
            fontSize: 32
        },
        instructionText: {
            flexShrink: 1,
            fontSize: 14
        }
    })
};

export default function RecipeDetail() {
    const id = Number(useLocalSearchParams<{ id: string }>().id);

    const { user, getRecipe } = useApi();
    const { isFetching, data: recipe, refetch } = useQuery<Recipe | null>({
        queryKey: ['recipe', id],
        queryFn: () => getRecipe(id),
        enabled: !!user
    });

    const matchingWords = findIngredientMatches(recipe);

    // small normalizers to compare tokens to matched terms
    const normalize = (s?: string) => s?.toLowerCase().replace(/[^a-z0-9]/g, '').trim() ?? '';
    const singularize = (w: string) => w.replace(/(ies|ses|es|s)$/, (m) => (m === 'ies' ? 'y' : ''));

    const renderHighlighted = (instruction: string, matches: string[]) => {
        const matchSet = new Set(matches.map(m => m.toLowerCase()));
        // stop words to avoid accidental substring matches (e.g. "in" in "spinach")
        const stopWords = new Set([
            'a','an','the','in','on','and','or','of','to','with','for','by','at','from',
            'is','are','be','as','that','this','these','those','it','its','was','were',
            'but','if','then','so','into','about','over','under','near','per'
        ]);

        // keep separators so we can recompose text with spacing/punctuation preserved
        const parts = instruction.split(/(\s+|[^A-Za-z0-9]+)/);
        return parts.map((part, idx) => {
            if (!part) return null;
            // whitespace or punctuation: render as-is
            if (/^\s+$/.test(part) || (/[^A-Za-z0-9]/.test(part) && part.trim() === '')) {
                return <Text key={`${idx}-${part}`}>{part}</Text>;
            }

            const norm = normalize(part);
            if (!norm || stopWords.has(norm)) {
                // don't attempt to match stop words
                return <Text key={`${idx}-${part}`}>{part}</Text>;
            }

            const sing = singularize(norm);
            const isMatch =
                (norm && (matchSet.has(norm) || matchSet.has(sing))) ||
                Array.from(matchSet).some(m => m.includes(norm) || norm.includes(m));

            if (isMatch) {
                return (
                    <Text key={`${idx}-${part}`} style={{ color: colors.primary }}>
                        {part}
                    </Text>
                );
            }
            return <Text key={`${idx}-${part}`}>{part}</Text>;
        });
    };

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
            <PageTitle
                actions={[
                    {
                        icon: 'square.and.arrow.up',
                        nudge: -2,
                        onPress: () => {}
                    },
                    {
                        icon: 'pencil',
                        onPress: () => {}
                    }
                ]}
            >
                {recipe?.name}
            </PageTitle>
            <View style={[styles.content, styles.timeLabels]}>
                <TimeLabel label={'prep time'} time={recipe?.prepTime ?? ''} />
                <TimeLabel label={'cook time'} time={recipe?.cookTime ?? ''} />
            </View>
            <View style={styles.content}>
                <Text style={styles.h2}>Ingredients</Text>
                <View>
                    {recipe?.ingredients?.map((ingredient) => (
                        <Ingredient key={ingredient.id} ingredient={ingredient} />
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
                                {renderHighlighted(instruction, matchingWords)}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </Screen>
    );
}
