import Heading from '@/components/heading';
import Screen from '@/components/screen';
import Text from '@/components/text';
import TextInput from '@/components/text-input';
import { useApi } from '@/hooks/use-api';
import globalStyles, { colors } from '@/styles/global';
import Feather from '@expo/vector-icons/Feather';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
// import { SymbolView } from 'expo-symbols';
import Spinner from '@/components/spinner';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Pressable, StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        ingredientContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32
        },
        addButton: {
            marginBottom: 32,
            paddingVertical: 0
        },
        addButtonText: {
            textTransform: 'lowercase',
            color: colors.primary
        },
        removeButton: {
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
            borderRadius: 16,
            backgroundColor: '#eee'
        },
        saveRecipeButton: {
            height: 80,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center'
        },
        saveRecipeButtonText: {
            fontSize: 24,
            fontFamily: 'Poppins_500Medium',
            textTransform: 'lowercase',
            color: '#fff'
        }
    })
};

interface ImportedRecipe {
    name: string;
    prepTime: string;
    cookTime: string;
    recipeYield: string;
    ingredients: string[];
    instructions: string[];
    error?: any;
}

export default function CreateNewRecipe(props: any) {
    const { user, createRecipe, importRecipe } = useApi();
    const router = useRouter();
    // animate save button into view when canBeSaved is true
    const translateY = useRef(new Animated.Value(80)).current;
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [instructions, setInstructions] = useState<string[]>(['']);
    const [isImporting, setIsImporting] = useState(false);

    const recipe = {
        name,
        prepTime,
        cookTime,
        servings: servings ? Number(servings) : null,
        ingredients: ingredients.filter(i => i.trim() !== ''),
        instructions: instructions.filter(i => i.trim() !== '')
    };

    const canBeSaved = recipe.name.trim() !== '';

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: canBeSaved ? 0 : 80,
            duration: 300,
            useNativeDriver: true
        }).start();
    }, [canBeSaved, translateY]);

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

    const handleSaveRecipe = async () => {
        setIsSaving(true);
        const res = await createRecipe(recipe);

        if (res.error) {
            console.log(res.error);
            setIsSaving(false);
            return;
        }

        if (res.id) {
            router.push(`/recipes/${res.id}`);
        }

        setIsSaving(false);
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
    }

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

    const confirmImport = (url: string) =>
        Alert.alert(
            'Is this the correct recipe?',
            url,
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        await handleImportRecipe(url);
                    },
                    style: 'default',
                    isPreferred: true
                },
            ]);

    const alertInvalidUrl = (pasted: string) =>
        Alert.alert(
            'Try copying a different link',
            `"${pasted}" isn't something we can work with`,
            [
                {
                    text: 'Ok',
                    onPress: () => { },
                    style: 'cancel'
                }
            ]);

    const isValidUrl = (text: string) => {
        try {
            new URL(text);
            return true;
        } catch {
            return false;
        }
    };

    // TODO: Add onSubmitEditing to each TextInput to move to next input
    return (
        <>
            <Screen isLoading={!user || isImporting}>
                <Heading
                    title='New Recipe'
                    actions={[{
                        icon: 'square.and.arrow.down',
                        nudge: -2,
                        onPress: async () => {
                            const pasted = await Clipboard.getStringAsync();
                            if (!pasted || !isValidUrl(pasted)) {
                                alertInvalidUrl(pasted);
                                return;
                            }
                            confirmImport(pasted);
                        }
                    }]}
                />
                <View style={styles.content}>
                    <TextInput
                        label="name"
                        onChangeText={setName}
                        value={name}
                        placeholder="hot tamales"
                    />
                    <TextInput
                        label="prep time"
                        onChangeText={setPrepTime}
                        value={prepTime}
                        placeholder="1 hour"
                    />
                    <TextInput
                        label="cook time"
                        onChangeText={setCookTime}
                        value={cookTime}
                        placeholder="20 mins"
                    />
                    <TextInput
                        label="servings"
                        onChangeText={setServings}
                        value={servings}
                        placeholder="4"
                    />
                    <Text style={styles.h3}>ingredients</Text>
                    {ingredients.map((ingredient, i) => (
                        <View key={i} style={styles.ingredientContainer}>
                            <TextInput
                                key={i}
                                label=""
                                onChangeText={(text) => handleChangeIngredient(i, text)}
                                value={ingredient}
                                placeholder="e.g. 1 cup of flour"
                                style={{ marginBottom: 0 }}
                            />
                            <Pressable onPress={() => handleRemoveIngredient(i)} style={styles.removeButton}>
                                <Feather name="minus" size={24} color={colors.error} />
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
                                numberOfLines={2}
                                label=""
                                onChangeText={(text) => handleChangeInstruction(i, text)}
                                value={instruction}
                                placeholder="e.g. Mix all ingredients"
                                style={{ marginBottom: 0 }}
                            />
                            <Pressable onPress={() => handleRemoveInstruction(i)} style={styles.removeButton}>
                                <Feather name="minus" size={24} color={colors.error} />
                            </Pressable>
                        </View>
                    ))}
                    <Pressable onPress={handleAddInstruction} style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ Add Instruction</Text>
                    </Pressable>
                </View>
            </Screen>
            <Animated.View
                style={[
                    { transform: [{ translateY }] },
                ]}
            >
                <Pressable
                    onPress={handleSaveRecipe}
                    style={[
                        styles.saveRecipeButton
                    ]}
                    disabled={!canBeSaved}
                >
                    {isSaving && <Spinner />}
                    {!isSaving && (
                        <Text style={styles.saveRecipeButtonText}>
                            save recipe
                        </Text>
                    )}
                </Pressable>
            </Animated.View>
        </>
    );
}
