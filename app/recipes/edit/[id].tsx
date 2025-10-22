import Autocomplete from '@/components/autocomplete';
import Heading from '@/components/heading';
import Screen from '@/components/screen';
import { useSnackbar } from '@/components/snackbar';
import Spinner from '@/components/spinner';
import Text from '@/components/text';
import TextInput from '@/components/text-input';
import { useApi } from '@/hooks/use-api';
import globalStyles, { brightness, colors } from '@/styles/global';
import {
    ImportedRecipe,
    Recipe,
    RecipeTag,
    UpsertRecipe,
    UpsertRecipeTag,
} from '@/types/interfaces';
import Feather from '@expo/vector-icons/Feather';
import { useQuery } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Alert, Animated, Pressable, StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        ingredientContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
        },
        addButton: {
            marginBottom: 32,
            paddingVertical: 0,
        },
        addButtonText: {
            textTransform: 'lowercase',
            color: colors.primary,
        },
        removeButton: {
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
            borderRadius: 16,
            backgroundColor: '#eee',
        },
        saveRecipeButton: {
            height: 80,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        saveRecipeButtonText: {
            fontSize: 24,
            fontFamily: 'Poppins_500Medium',
            textTransform: 'lowercase',
            color: '#fff',
        },
        tagWrapper: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16,
        },
        tagContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingLeft: 16,
            paddingRight: 4,
            paddingVertical: 4,
            borderRadius: 32,
            backgroundColor: brightness(colors.green, 40),
        },
    }),
};

export default function EditRecipe(props: any) {
    const navigation = useNavigation();
    const params = useLocalSearchParams<{ id: string, newName: string }>();
    const id = params.id ? Number(params.id) : undefined;
    const isNewRecipe = !id;
    const { showSnackbar } = useSnackbar();
    const { user, getRecipe, upsertRecipe, getAllRecipeTags, importRecipe } = useApi();
    const router = useRouter();
    const translateY = useRef(new Animated.Value(80)).current;
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [instructions, setInstructions] = useState<string[]>(['']);
    const [tags, setTags] = useState<UpsertRecipeTag[]>([]);
    const [showTagInput, setShowTagInput] = useState(false);
    const [tagEntry, setTagEntry] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    const { data: recipe } = useQuery<Recipe | null>({
        queryKey: ['recipe', id],
        queryFn: () => getRecipe(id || 0),
        enabled: !!user && !!id,
    });

    const { data: allTags } = useQuery<RecipeTag[]>({
        queryKey: ['recipe-tags'],
        queryFn: () => getAllRecipeTags(),
        enabled: !!user,
    });

    const patched: UpsertRecipe = {
        id,
        name,
        prepTime,
        cookTime,
        servings: servings ? Number(servings) : undefined,
        ingredients: ingredients.filter((i) => i.trim() !== ''),
        instructions: instructions.filter((i) => i.trim() !== ''),
        tags,
    };

    const canBeSaved = recipe?.name?.trim() !== '';

    useEffect(() => {
        if (recipe) {
            setName(recipe.name || params.newName || '');
            setPrepTime(recipe.prepTime || '');
            setCookTime(recipe.cookTime || '');
            setServings(recipe.servings ? String(recipe.servings) : '');
            setIngredients(recipe.ingredients.map((i) => i.sentence || ''));
            setInstructions(recipe.instructions || []);
            setTags(recipe.tags || []);
        }
    }, [recipe]);

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: canBeSaved ? 0 : 80,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [canBeSaved, translateY]);

    useLayoutEffect(() => {
        console.log('setting header right items');
        navigation.setOptions({
            unstable_headerRightItems: () => headingActions,
        });
    }, [navigation]);

    const handleSaveRecipe = async () => {
        setIsSaving(true);
        const res = await upsertRecipe(patched);

        if (res.error) {
            console.log(res.error);
            setIsSaving(false);
            return;
        }

        setIsSaving(false);

        if (isNewRecipe && res.id) {
            router.push(`/recipes/${res.id}`);
        }
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const handleRemoveIngredient = (index: number) => {
        const patched = [...ingredients];
        patched.splice(index, 1);

        if (patched.length === 0) {
            patched.push('');
        }

        setIngredients(patched);
    };

    const handleChangeIngredient = (index: number, sentence: string) => {
        const patched = [...ingredients];
        patched[index] = sentence;
        setIngredients(patched);
    };

    const handleAddInstruction = () => {
        setInstructions([...instructions, '']);
    };

    const handleRemoveInstruction = (index: number) => {
        const patched = [...instructions];
        patched.splice(index, 1);

        if (patched.length === 0) {
            patched.push('');
        }

        setInstructions(patched);
    };

    const handleChangeInstruction = (index: number, sentence: string) => {
        const patched = [...instructions];
        patched[index] = sentence;
        setInstructions(patched);
    };

    const handleRemoveTag = (index: number) => {
        const patched = [...tags];
        patched.splice(index, 1);
        setTags(patched);
    };

    const alertInvalidUrl = (pasted: string) =>
        Alert.alert(
            'Try copying a different link',
            `"${pasted}" isn't something we can work with`,
            [
                {
                    text: 'Ok',
                    onPress: () => {},
                    style: 'cancel',
                },
            ]
        );

    const isValidUrl = (text: string) => {
        try {
            new URL(text);
            return true;
        } catch {
            return false;
        }
    };

    const confirmImport = (url: string) =>
        Alert.alert('Is this the correct recipe?', url, [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            {
                text: 'Yes',
                onPress: async () => {
                    await handleImportRecipe(url);
                },
                style: 'default',
                isPreferred: true,
            },
        ]);

    const handleImportRecipe = async (url: string) => {
        setIsImporting(true);
        if (!url.trim()) {
            return;
        }

        const res: ImportedRecipe = await importRecipe(url);

        if (res && !res.error) {
            setName(res.name || '');
            setPrepTime(res.prepTime || '');
            setCookTime(res.cookTime || '');
            setServings(res.recipeYield || '');
            setIngredients(res.ingredients || ['']);
            setInstructions(res.instructions || ['']);
        }
        setIsImporting(false);
    };

    const headingActions = isNewRecipe
        ? [
              {
                  label: 'import',
                  icon: {
                      type: 'sfSymbol',
                      name: 'square.and.arrow.down',
                  },
                  type: 'button',
                  onPress: async () => {
                      const pasted = await Clipboard.getStringAsync();
                      if (!pasted || !isValidUrl(pasted)) {
                          alertInvalidUrl(pasted);
                          return;
                      }
                      confirmImport(pasted);
                  },
                  tintColor: colors.primary,
              },
          ]
        : [
              {
                  type: 'button',
                  label: 'view',
                  icon: {
                      type: 'sfSymbol',
                      name: 'arrow.right',
                  },
                  tintColor: colors.primary,
                  onPress: () => router.push(`/recipes/${id}`),
              },
          ];

    // TODO: Add onSubmitEditing to each TextInput to move to next input
    return (
        <>
            <Screen
                isLoading={!user || !!(params?.id && !recipe) || isImporting}
                // actions={headingActions}
            >
                <Heading title={params?.id ? 'edit recipe' : 'new recipe'} />
                <View style={styles.content}>
                    <TextInput
                        label='name'
                        onChangeText={setName}
                        value={name}
                        placeholder='hot tamales'
                    />
                    <TextInput
                        label='prep time'
                        onChangeText={setPrepTime}
                        value={prepTime}
                        placeholder='1 hour'
                    />
                    <TextInput
                        label='cook time'
                        onChangeText={setCookTime}
                        value={cookTime}
                        placeholder='20 mins'
                    />
                    <TextInput
                        label='servings'
                        onChangeText={setServings}
                        value={servings}
                        placeholder='4'
                    />
                    <Text style={styles.h3}>ingredients</Text>
                    {ingredients.map((ingredient, i) => (
                        <View key={i} style={styles.ingredientContainer}>
                            <TextInput
                                key={i}
                                label=''
                                onChangeText={(text) => handleChangeIngredient(i, text)}
                                value={ingredient}
                                placeholder='e.g. 1 cup of flour'
                                style={{ marginBottom: 0 }}
                            />
                            <Pressable
                                onPress={() => handleRemoveIngredient(i)}
                                style={styles.removeButton}
                            >
                                <Feather name='minus' size={24} color={colors.error} />
                            </Pressable>
                        </View>
                    ))}
                    <Pressable onPress={handleAddIngredient} style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ Add Ingredient</Text>
                    </Pressable>
                    <Text style={styles.h3}>instructions</Text>
                    {instructions.map((instruction, i) => (
                        <View key={i} style={styles.ingredientContainer}>
                            <TextInput
                                key={i}
                                multiline
                                numberOfLines={10}
                                label=''
                                onChangeText={(text) => handleChangeInstruction(i, text)}
                                value={instruction}
                                placeholder='e.g. Mix all ingredients'
                                style={{ marginBottom: 0 }}
                            />
                            <Pressable
                                onPress={() => handleRemoveInstruction(i)}
                                style={styles.removeButton}
                            >
                                <Feather name='minus' size={24} color={colors.error} />
                            </Pressable>
                        </View>
                    ))}
                    <Pressable onPress={handleAddInstruction} style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ Add Instruction</Text>
                    </Pressable>
                    <Text style={styles.h3}>tags</Text>
                    {!!tags?.length && (
                        <View style={styles.tagWrapper}>
                            {tags.map((tag, i) => (
                                <Pressable
                                    key={i}
                                    style={styles.tagContainer}
                                    onPress={() => handleRemoveTag(i)}
                                >
                                    <Text>{tag.name}</Text>
                                    <SymbolView name='x.circle.fill' size={24} tintColor='#000' />
                                </Pressable>
                            ))}
                        </View>
                    )}
                    <Pressable onPress={() => setShowTagInput(true)} style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ Add Tag</Text>
                    </Pressable>
                </View>
            </Screen>
            <Animated.View style={[{ transform: [{ translateY }] }]}>
                <Pressable
                    onPress={handleSaveRecipe}
                    style={[styles.saveRecipeButton]}
                    disabled={!canBeSaved}
                >
                    {isSaving && <Spinner />}
                    {!isSaving && <Text style={styles.saveRecipeButtonText}>save recipe</Text>}
                </Pressable>
            </Animated.View>
            <Autocomplete
                open={showTagInput}
                label='select tags'
                value={tagEntry}
                onChange={setTagEntry}
                onSelect={(name) => {
                    setTags([...tags, { name }]);
                    setTagEntry('');
                    showSnackbar({
                        message: `added tag: ${name}`,
                        type: 'success',
                    });
                }}
                onClose={() => {
                    setShowTagInput(false);
                    setTagEntry('');
                }}
                items={
                    allTags
                        ?.map((t) => t.name || '')
                        .filter((t) => !tags.find((tag) => tag.name === t)) || []
                }
            />
        </>
    );
}
