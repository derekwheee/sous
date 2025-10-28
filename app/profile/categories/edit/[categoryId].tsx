import Loading from '@/components/loading';
import SaveButton from '@/components/save-button';
import Text from '@/components/text';
import TextInput from '@/components/text-input';
import { useCategory } from '@/hooks/use-category';
import globalStyles, { brightness, colors } from '@/styles/global';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { EmojiPopup } from 'react-native-emoji-popup';
import { Switch, XStack, YStack } from 'tamagui';

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
        emojiTrigger: {
            position: 'relative',
            top: -4,
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: brightness(colors.background, -40),
            borderRadius: 999,
            backgroundColor: brightness(colors.background, -20),
        },
        emojiText: {
            fontSize: 36,
        },
    }),
};

export default function EditItemModal() {
    const {
        categoryId,
    }: {
        categoryId?: string;
    } = useLocalSearchParams();

    const {
        category: { data: category },
        categories: { data: categories },
        saveCategory,
        isCategorySaving,
    } = useCategory({
        categoryId: categoryId ? Number(categoryId) : undefined,
    });

    const nextSortOrder = categories
        ? Math.max(...categories.map((c) => c.sortOrder || 0)) + 1
        : -1;

    const [isDirty, setIsDirty] = useState(false);
    const [name, setName] = useState(category?.name || '');
    const [icon, setIcon] = useState(category?.icon || '❓');
    const [isNonFood, setIsNonFood] = useState(!!category?.isNonFood);
    const [sortOrder, setSortOrder] = useState(category?.sortOrder || -1);

    useEffect(() => {
        if (category) {
            setName(category?.name);
            setIcon(category?.icon || '❓');
            setIsNonFood(!!category?.isNonFood);
            setSortOrder(category?.sortOrder);
        }
        if (categories && !category) {
            // New category
            setSortOrder(nextSortOrder);
        }
        console.log({ categoryId, category });
    }, [category?.name]);

    const patch: UpsertItemCategory = {
        id: category?.id,
        name,
        icon,
        isNonFood,
        sortOrder,
    };

    const change = (fn: Function) => {
        if (!isDirty) {
            setIsDirty(true);
        }
        fn();
    };

    const handleSave = (patch: UpsertItemCategory, cb?: Function) => {
        saveCategory(patch, {
            // onSuccess: () => {
            //     router.dismiss();
            // },
        });
    };

    return (
        <>
            <Loading isLoading={(!!categoryId && !category)} />
            <View style={styles.dialog} key={category?.id ?? 'new'}>
                <XStack
                    style={{ width: '100%' }}
                    justifyContent='space-between'
                    alignItems='center'
                    marginBottom={16}
                >
                    <Text style={styles.dialogHeading}>
                        {!!category?.id ? 'Edit Category' : 'Add Category'}
                    </Text>
                    <SaveButton
                        disabled={!isDirty || !name?.trim() || isCategorySaving}
                        onPressSave={() => handleSave(patch)}
                        isSaving={isCategorySaving}
                    />
                </XStack>
                <YStack>
                    <XStack gap='$2' alignItems='center'>
                        <TextInput
                            autoFocus
                            id='name'
                            label='Name'
                            value={name}
                            onChangeText={(...args) => change(() => setName(...args))}
                        />
                        <EmojiPopup onEmojiSelected={(emoji) => change(() => setIcon(emoji))}>
                            <View style={styles.emojiTrigger}>
                                <Text style={styles.emojiText}>{icon}</Text>
                            </View>
                        </EmojiPopup>
                    </XStack>
                </YStack>
                <YStack gap='$2'>
                    <XStack alignItems='center' gap='$4'>
                        <Switch
                            id='isNonFood'
                            size='$2'
                            borderColor={isNonFood ? colors.primary : '#ccc'}
                            onCheckedChange={(checked) => change(() => setIsNonFood(!!checked))}
                            checked={isNonFood}
                        >
                            <Switch.Thumb
                                animation='quicker'
                                style={{
                                    backgroundColor: isNonFood ? colors.primary : '#ccc',
                                }}
                            />
                        </Switch>
                        <Text weight='regular'>Non-Food Category</Text>
                    </XStack>
                </YStack>
            </View>
        </>
    );
}
