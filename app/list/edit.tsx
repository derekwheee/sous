import Autocomplete from '@/components/autocomplete';
import Loading from '@/components/loading';
import Text from '@/components/text';
import TextInput from '@/components/text-input';
import { useApi } from '@/hooks/use-api';
import { usePantry } from '@/hooks/use-pantry';
import globalStyles, { colors } from '@/styles/global';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Spinner, Switch, XStack, YStack } from 'tamagui';

const styles = {
    ...globalStyles,
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
            backgroundColor: '#eee',
            marginBottom: 32,
        },
    }),
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
    return (
        <Pressable
            style={[styles.button, disabled && styles.buttonDisabled]}
            disabled={disabled}
            {...props}
            onPress={() => onPressSave(onPress)}
        >
            {isSaving && <Spinner size='small' color='#000' />}
            {!isSaving && (
                <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>save</Text>
            )}
        </Pressable>
    );
};

export default function EditItemModal() {
    const {
        pantryItemId,
        pantryId,
        newName,
    }: {
        pantryItemId?: string;
        pantryId?: string;
        newName?: string;
    } = useLocalSearchParams();

    const { user, getItemCategories } = useApi();
    const router = useRouter();

    const {
        pantryItem: { data: pantryItem },
        savePantryItem,
        isPantryItemSaving,
    } = usePantry({
        pantryItemId: pantryItemId ? Number(pantryItemId) : undefined,
    });

    const { data: categoryList } = useQuery<ItemCategory[]>({
        queryKey: ['itemCategories'],
        queryFn: () => getItemCategories(Number(pantryId)),
        enabled: !!user && !!pantryId,
    });

    const [isDirty, setIsDirty] = useState(false);
    const [name, setName] = useState(pantryItem?.name || newName || '');
    const [category, setCategory] = useState(
        pantryItem?.category?.name ||
            categoryList?.find((c) => c.name.toLowerCase() === 'other')?.name
    );
    const [isInStock, setIsInStock] = useState(!!pantryItem?.isInStock);
    const [isInShoppingList, setIsInShoppingList] = useState(!!pantryItem?.isInShoppingList);
    const [isFavorite, setIsFavorite] = useState(!!pantryItem?.isFavorite);
    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [categoryEntry, setCategoryEntry] = useState('');

    useEffect(() => {
        if (pantryItem) {
            setName(pantryItem?.name);
            setCategory(pantryItem?.category?.name);
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
        categoryId: categoryList?.find((cat) => cat.name === category)?.id,
    };

    const change = (fn: Function) => {
        if (!isDirty) {
            setIsDirty(true);
        }
        fn();
    };

    const handleSave = (patch: UpsertPantryItem, cb?: Function) => {
        savePantryItem(patch, {
            onSuccess: () => {
                router.dismiss();
            },
        });
    };

    return (
        <>
            <Loading isLoading={(pantryItemId && !pantryItem) || !categoryList} />
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
                            <SymbolView
                                name={isFavorite ? 'repeat.circle.fill' : 'repeat.circle'}
                                size={40}
                                tintColor={isFavorite ? colors.primary : '#ccc'}
                            />
                        </Pressable>
                    </XStack>
                    <Text weight='regular'>Category</Text>
                    <Pressable
                        onPress={() => setShowCategoryInput(true)}
                        style={styles.categoryTrigger}
                    >
                        <Text weight='regular'>
                            {categoryList?.find((c) => c.name === category)?.icon}{' '}
                            {categoryList?.find((c) => c.name === category)?.name}
                        </Text>
                        <SymbolView name='chevron.right' size={16} tintColor={colors.text} />
                    </Pressable>
                </YStack>
                <YStack gap='$2'>
                    <XStack alignItems='center' gap='$4'>
                        <Switch
                            id='isInStock'
                            size='$2'
                            borderColor={isInStock ? colors.primary : '#ccc'}
                            onCheckedChange={(checked) => change(() => setIsInStock(!!checked))}
                            checked={isInStock}
                        >
                            <Switch.Thumb
                                animation='quicker'
                                style={{
                                    backgroundColor: isInStock ? colors.primary : '#ccc',
                                }}
                            />
                        </Switch>
                        <Text weight='regular'>In Stock</Text>
                    </XStack>
                    <XStack alignItems='center' gap='$4'>
                        <Switch
                            id='isInShoppingList'
                            size='$2'
                            borderColor={isInShoppingList ? colors.primary : '#ccc'}
                            onCheckedChange={(checked) =>
                                change(() => setIsInShoppingList(!!checked))
                            }
                            checked={isInShoppingList}
                        >
                            <Switch.Thumb
                                animation='quicker'
                                style={{
                                    backgroundColor: isInShoppingList ? colors.primary : '#ccc',
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
                items={categoryList?.map((cat) => ({
                    label: `${cat.icon} ${cat.name}`,
                    value: cat.name,
                }))}
            />
        </>
    );
}
