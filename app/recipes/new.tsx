import { createRecipe, importRecipe } from '@/api/recipes';
import Heading from '@/components/heading';
import Text from '@/components/text';
import TextInput from '@/components/text-input';
import globalStyles, { colors } from '@/styles/global';
import Feather from '@expo/vector-icons/Feather';
import { useHeaderHeight } from '@react-navigation/elements';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        importContainer: {
            marginBottom: 16
        },
        importToggle: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 16,
            backgroundColor: colors.primary
        },
        importSubmit: {
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
            borderRadius: 24,
            backgroundColor: colors.primary
        },
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
            padding: 24,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center'
        },
        saveRecipeButtonDisabled: {
            display: 'none'
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
    const queryClient = useQueryClient();
    const router = useRouter();
    const headerHeight = useHeaderHeight();
    const [isSaving, setIsSaving] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [importUrl, setImportUrl] = useState('');
    const [name, setName] = useState('');
    const [prepTime, setPrepTime] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [servings, setServings] = useState('');
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [instructions, setInstructions] = useState<string[]>(['']);

    const recipe = {
        name,
        prepTime,
        cookTime,
        servings: servings ? Number(servings) : null,
        ingredients: ingredients.filter(i => i.trim() !== ''),
        instructions: instructions.filter(i => i.trim() !== '')
    };

    const canBeSaved = recipe.name.trim() !== '';

    const handleImportRecipe = async () => {
        // TODO: Show loading state
        if (!importUrl.trim()) {
            return;
        }

        const res: ImportedRecipe = await importRecipe(importUrl);

        if (res && !res.error) {
            setName(res.name || '');
            setPrepTime(res.prepTime || '');
            setCookTime(res.cookTime || '');
            setServings(res.recipeYield || '');
            setIngredients(res.ingredients || ['']);
            setInstructions(res.instructions || ['']);
            setShowImport(false);
            setImportUrl('');
        }
    };

    const handleSaveRecipe = async () => {
        setIsSaving(true);
        const res = await createRecipe(recipe);

        queryClient.invalidateQueries({ queryKey: ['recipes', 'pantry'] });

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

    // TODO: Add onSubmitEditing to each TextInput to move to next input
    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={headerHeight}
            >
                <ScrollView>
                    <Heading title='New Recipe' />
                    <View style={[styles.content, styles.importContainer]}>
                        <Pressable onPress={() => setShowImport(!showImport)} style={styles.importToggle}>
                            <Feather name='external-link' size={16} color='#fff' />
                            <Text style={{ color: '#fff' }}>Import Recipe From URL</Text>
                        </Pressable>
                        {showImport && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    onChangeText={setImportUrl}
                                    value={importUrl}
                                    placeholder=""
                                    style={{ marginBottom: 0 }}
                                />
                                <Pressable onPress={handleImportRecipe} style={styles.importSubmit}>
                                    <Feather name="search" size={24} color='#FFF' />
                                </Pressable>
                            </View>
                        )}
                    </View>
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
                </ScrollView>
            </KeyboardAvoidingView>

            <Pressable
                onPress={handleSaveRecipe}
                style={[
                    styles.saveRecipeButton,
                    canBeSaved && !isSaving ? {} : styles.saveRecipeButtonDisabled
                ]}
                disabled={!canBeSaved || isSaving}
            >
                {/* TODO: Display loading indicator when isSaving is true */}
                <Text style={styles.saveRecipeButtonText}>Save Recipe</Text>
            </Pressable>
        </>
    );
}
