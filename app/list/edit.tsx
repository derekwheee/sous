import Autocomplete from '@/components/autocomplete';
import Loading from '@/components/loading';
import SystemIcon from '@/components/system-icon';
import Text from '@/components/text';
import TextInput from '@/components/text-input';
import { useCategory } from '@/hooks/use-category';
import { usePantry } from '@/hooks/use-pantry';
import globalStyles, { brightness } from '@/styles/global';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Spinner, Switch, XStack, YStack } from 'tamagui';
import { useColors } from '@/hooks/use-colors';

const useStyles = () => {
    const colors = useColors();
    return {
        ...globalStyles(colors),
        ...StyleSheet.create({
            dialog: {
                paddingTop: 48,
                paddingBottom: 32,
                paddingHorizontal: 16,
            },
            categoryTrigger: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderColor: colors.primary,
                borderBottomWidth: 2,
                padding: 16,
                backgroundColor: brightness(colors.background, -10),
                marginBottom: 32,
            },
        }),
    };
};

const SaveItemButton = ({
    onPressSave,
    onPress,
    disabled,
    isSaving,
    ...props
}: {
    onPressSave: (cb?: Function) => void;
    onPress?: Function;
    disabled: boolean;
    isSaving: boolean;
    props?: React.ComponentProps<typeof Pressable>;
}) => {
    const styles = useStyles();
    const colors = useColors();

    return (
        <Pressable
            style={[styles.button, disabled && styles.buttonDisabled]}
            disabled={disabled}
            {...props}
            onPress={() => onPressSave(onPress)}
        >
            {isSaving && <Spinner size='small' color={colors.text} />}
            {!isSaving && (
                <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>save</Text>
            )}
        </Pressable>
    );
};

export default function EditItemModal() {
    const {
        pantryItemId,
        newName,
    }: {
        pantryItemId?: string;
        newName?: string;
    } = useLocalSearchParams();

    const {
        categories: { data: categories },
    } = useCategory();
    const router = useRouter();

    const { pantryItem, savePantryItem, isPantryItemSaving } = usePantry({
        pantryItemId: pantryItemId ? Number(pantryItemId) : undefined,
    });

    const styles = useStyles();
    const colors = useColors();
    const [isDirty, setIsDirty] = useState(false);
    const [name, setName] = useState(pantryItem?.name || newName || '');
    const [isInStock, setIsInStock] = useState(!!pantryItem?.isInStock);
    const [isInShoppingList, setIsInShoppingList] = useState(!!pantryItem?.isInShoppingList);
    const [isFavorite, setIsFavorite] = useState(!!pantryItem?.isFavorite);
    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [categoryEntry, setCategoryEntry] = useState('');
    const [newCategory, setCategory] = useState('');

    const categoryName = useMemo(
        () =>
            newCategory ||
            pantryItem?.category?.name ||
            categories?.find((c) => c.name.toLowerCase() === 'other')?.name,
        [newCategory, categories, pantryItem]
    );

    const category = useMemo(
        () => categories?.find((c) => c.name === categoryName || c.name.toLowerCase() === 'other'),
        [categories, categoryName]
    );

    useEffect(() => {
        if (pantryItem) {
            setName(pantryItem?.name);
            setIsInStock(!!pantryItem?.isInStock);
            setIsInShoppingList(!!pantryItem?.isInShoppingList);
            setIsFavorite(!!pantryItem?.isFavorite);
        }
    }, [pantryItem]);

    const patch: UpsertPantryItem = {
        id: pantryItem?.id,
        name,
        isInStock,
        isInShoppingList,
        isFavorite,
        categoryId: category?.id,
    };

    const change = useCallback((fn: () => void) => {
        fn();
        setIsDirty(true);
    }, []);

    const handleSave = (patch: UpsertPantryItem, cb?: Function) => {
        savePantryItem(patch, {
            onSuccess: () => {
                router.dismiss();
            },
        });
    };

    return (
        <>
            <Loading isLoading={(pantryItemId && !pantryItem) || !categories} />
            <View style={styles.dialog}>
                <XStack
                    style={{ width: '100%' }}
                    justifyContent='space-between'
                    alignItems='center'
                    marginBottom={16}
                >
                    <Text style={styles.dialogHeading}>
                        {!!pantryItem?.id ? 'Edit Item' : 'Add Item'}
                    </Text>
                    <SaveItemButton
                        disabled={!isDirty || !name?.trim() || isPantryItemSaving}
                        onPressSave={(cb) => handleSave(patch, cb)}
                        isSaving={isPantryItemSaving}
                    />
                </XStack>
                <YStack>
                    {/* TODO: Figure out why I can click away to lose focus */}
                    <XStack gap='$2' alignItems='center'>
                        <TextInput
                            autoFocus
                            id='name'
                            label='Name'
                            value={name}
                            onChangeText={(...args) => change(() => setName(...args))}
                        />
                        <Pressable
                            onPress={() => change(() => setIsFavorite(!isFavorite))}
                            style={{
                                position: 'relative',
                                top: -4,
                            }}
                        >
                            <SystemIcon
                                ios={isFavorite ? 'repeat.circle.fill' : 'repeat.circle'}
                                android={'repeat'}
                                size={40}
                                color={
                                    isFavorite ? colors.primary : brightness(colors.background, -40)
                                }
                            />
                        </Pressable>
                    </XStack>
                    <Text weight='regular'>Category</Text>
                    <Pressable
                        onPress={() => setShowCategoryInput(true)}
                        style={styles.categoryTrigger}
                    >
                        <Text weight='regular'>
                            {category?.icon} {category?.name}
                        </Text>
                        <SystemIcon
                            ios='chevron.right'
                            android='chevron-right'
                            size={16}
                            color={colors.text}
                        />
                    </Pressable>
                </YStack>
                <YStack gap='$2'>
                    <XStack alignItems='center' gap='$4'>
                        <Switch
                            id='isInStock'
                            size='$2'
                            borderColor={
                                isInStock ? colors.primary : brightness(colors.background, -40)
                            }
                            onCheckedChange={(checked) => change(() => setIsInStock(!!checked))}
                            checked={isInStock}
                        >
                            <Switch.Thumb
                                animation='quicker'
                                style={{
                                    backgroundColor: isInStock
                                        ? colors.primary
                                        : brightness(colors.background, -40),
                                }}
                            />
                        </Switch>
                        <Text weight='regular'>In Stock</Text>
                    </XStack>
                    <XStack alignItems='center' gap='$4'>
                        <Switch
                            id='isInShoppingList'
                            size='$2'
                            borderColor={
                                isInShoppingList
                                    ? colors.primary
                                    : brightness(colors.background, -40)
                            }
                            onCheckedChange={(checked) =>
                                change(() => setIsInShoppingList(!!checked))
                            }
                            checked={isInShoppingList}
                        >
                            <Switch.Thumb
                                animation='quicker'
                                style={{
                                    backgroundColor: isInShoppingList
                                        ? colors.primary
                                        : brightness(colors.background, -40),
                                }}
                            />
                        </Switch>
                        <Text weight='regular'>In Shopping List</Text>
                    </XStack>
                </YStack>
            </View>
            <Autocomplete
                open={showCategoryInput}
                mode='select'
                keyboardOffset={0}
                label='select category'
                value={categoryEntry}
                onChange={setCategoryEntry}
                onSelect={(value, close) => {
                    change(() => setCategory(value));
                    setCategoryEntry('');
                    close();
                }}
                onClose={() => {
                    setShowCategoryInput(false);
                    setCategoryEntry('');
                }}
                items={categories?.map((cat) => ({
                    label: `${cat.icon} ${cat.name}`,
                    value: cat.name,
                }))}
            />
        </>
    );
}
