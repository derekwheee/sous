import Button from '@/components/button';
import NetworkActivityIndicator from '@/components/network-activity';
import TagPill from '@/components/tag-pill';
import Text from '@/components/text';
import TextInput from '@/components/text-input';
import TimeLabel from '@/components/time-label';
import { useApi } from '@/hooks/use-api';
import globalStyles, { brightness, colors, fonts } from '@/styles/global';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        dialog: {
            flex: 1,
            paddingTop: 48,
            paddingHorizontal: 16,
        },
        sparkleContainer: {
            width: 196 + 64,
            padding: 32,
            borderRadius: (196 + 64) / 2,
            backgroundColor: brightness(colors.background, -20),
        },
        suggestionsWrapper: {
            marginBottom: 16,
            padding: 16,
            borderRadius: 8,
            backgroundColor: brightness(colors.background, -20),
        },
        titleWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
        },
        title: {
            fontSize: 24,
            fontFamily: fonts.poppins.medium,
        },
        tagContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16,
        },
        recipeTitle: {
            marginBottom: 8,
            fontSize: 20,
            fontFamily: fonts.poppins.medium,
            textTransform: 'lowercase',
        },
        recipeDescription: {
            marginTop: 8,
        },
        sectionHeading: {
            marginBottom: 8,
            fontFamily: fonts.poppins.medium,
        },
        loadingWrapper: {
            flex: 1,
            paddingBottom: 96,
            justifyContent: 'center',
            alignItems: 'center',
        },
    }),
};

export default function SuggestRecipesModal() {
    const router = useRouter();
    const [suggestionState, setSuggestionState] = useState<RecipeSuggestion[] | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<string>('');

    let {
        pantryId,
        tags,
    }: {
        pantryId?: string;
        tags: string[];
    } = useLocalSearchParams();
    const { getRecipeSuggestions } = useApi();

    tags = tags && Array.isArray(tags) ? tags : (tags as string).split(',');

    const {
        data: suggestions,
        isFetching,
        refetch: getSuggestions,
    } = useQuery({
        queryKey: ['suggestions', pantryId],
        queryFn: () => getRecipeSuggestions(Number(pantryId), selectedTags, keywords),
        enabled: false,
    });

    useEffect(() => {
        if (suggestions) {
            setSuggestionState(suggestions);
        }
    }, [suggestions]);

    const toggleTagSelected = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <View style={styles.dialog}>
            <View style={styles.titleWrapper}>
                <SymbolView name='sparkles' size={32} tintColor={colors.primary} />
                <Text style={styles.title}>suggested recipes</Text>
            </View>
            {isFetching && (
                <View style={styles.loadingWrapper}>
                    <View style={styles.sparkleContainer}>
                        <SymbolView name='sparkles' size={196} tintColor={colors.primary} />
                    </View>
                </View>
            )}
            {!isFetching && !suggestionState && (
                <View>
                    <Text style={styles.sectionHeading}>select tags</Text>
                    <View style={styles.tagContainer}>
                        {tags?.map((tag) => (
                            <TagPill
                                key={tag}
                                text={tag}
                                onPress={() => toggleTagSelected(tag)}
                                isActive={selectedTags.includes(tag)}
                            />
                        ))}
                    </View>
                    <Text style={styles.sectionHeading}>add keywords</Text>
                    <TextInput
                        placeholder='e.g. pasta, chicken, vegan'
                        value={keywords}
                        onChangeText={(text) => setKeywords(text)}
                    />
                    <Button
                        leftIcon='sparkles'
                        text='suggest recipes'
                        onPress={() => getSuggestions()}
                    />
                </View>
            )}
            {!isFetching && !!suggestionState && (
                <>
                    <Button
                        variant='pill'
                        text='start over'
                        leftIcon='arrow.clockwise'
                        style={{ marginBottom: 16 }}
                        onPress={() => setSuggestionState(null)}
                    />
                    <ScrollView contentContainerStyle={{ paddingBottom: 64 }}>
                        {suggestionState.map((suggestion: RecipeSuggestion, i: number) => (
                            <View key={i} style={styles.suggestionsWrapper}>
                                <Text style={styles.recipeTitle}>{suggestion.name}</Text>
                                <View style={{ flexDirection: 'row', gap: 16 }}>
                                    <TimeLabel
                                        label={'prep time'}
                                        time={(suggestion.prepTime ?? '').replace(
                                            / minutes/,
                                            ' mins'
                                        )}
                                    />
                                    <TimeLabel
                                        label={'cook time'}
                                        time={(suggestion.cookTime ?? '').replace(
                                            / minutes/,
                                            ' mins'
                                        )}
                                    />
                                </View>
                                <TimeLabel label={'servings'} time={suggestion.servings ?? ''} />
                                <Text style={styles.recipeDescription}>
                                    {suggestion.description}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        marginTop: 8,
                                    }}
                                >
                                    <Button
                                        outlined
                                        variant='pill'
                                        text='view recipe'
                                        rightIcon='chevron.right'
                                        style={{ flexShrink: 1 }}
                                        onPress={() => router.push({
                                            pathname: '/recipes/suggested',
                                            params: {
                                                suggestion: JSON.stringify(suggestion),
                                            }
                                        })}
                                    />
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </>
            )}
            <NetworkActivityIndicator />
        </View>
    );
}
