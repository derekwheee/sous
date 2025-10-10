import Select from '@/components/select-input';
import Text from '@/components/text';
import TextInput from '@/components/text-input';
import globalStyles, { colors } from '@/styles/global';
import { ItemCategory, PantryItem, UpsertPantryItem } from '@/types/interfaces';
import { X } from '@tamagui/lucide-icons';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import {
    Adapt,
    Button,
    Dialog,
    DialogProps,
    Sheet,
    Switch,
    Unspaced,
    XStack,
    YStack
} from 'tamagui';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({

    })
};

const SaveItemButton = ({
    onPressSave,
    onPress,
    disabled,
    ...props
}: {
    onPressSave: (cb?: Function) => void,
    onPress?: Function,
    disabled: boolean,
    props?: React.ComponentProps<typeof Pressable>
}) => {
    return (
        <Pressable style={[styles.button, disabled && styles.buttonDisabled]} disabled={disabled} {...props} onPress={() => onPressSave(onPress)}>
            <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>save</Text>
        </Pressable>
    );
};

export default function ItemDialog({
    pantryItem = {
        name: '',
        isInStock: false
    } as PantryItem,
    categories = [] as ItemCategory[],
    onPressSave,
    children,
    ...props
}: {
    pantryItem?: PantryItem,
    categories: ItemCategory[],
    onPressSave: (patch: UpsertPantryItem, cb?: Function) => void,
} & DialogProps) {

    const [isDirty, setIsDirty] = useState(false);
    const [name, setName] = useState(pantryItem.name);
    const [category, setCategory] = useState(pantryItem.category?.name);
    const [isInStock, setIsInStock] = useState(!!pantryItem.isInStock);
    const [isInShoppingList, setIsInShoppingList] = useState(!!pantryItem.isInShoppingList);
    const [isFavorite, setIsFavorite] = useState(!!pantryItem.isFavorite);

    const patch: UpsertPantryItem = {
        id: pantryItem.id,
        name,
        isInStock,
        isInShoppingList,
        isFavorite,
        categoryId: categories.find(cat => cat.name === category)?.id
    };

    const change = (fn: Function) => {
        if (!isDirty) {
            setIsDirty(true);
        }
        fn();
    }

    return (
        <Dialog modal {...props}>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>

            <Adapt platform="touch">
                <Sheet
                    animation="medium"
                    zIndex={200000}
                    modal
                    snapPoints={[90]}
                >
                    <Sheet.Frame padding="$4">
                        <Adapt.Contents />
                    </Sheet.Frame>
                    <Sheet.Overlay
                        backgroundColor="$shadow6"
                        animation="medium"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                </Sheet>
            </Adapt>

            <Dialog.Portal>
                <Dialog.Overlay
                    key="overlay"
                    backgroundColor="$shadow6"
                    animateOnly={['transform', 'opacity']}
                    animation={[
                        'quicker',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />

                <Dialog.FocusScope focusOnIdle>
                    <Dialog.Content
                        bordered
                        paddingVertical="$4"
                        paddingHorizontal="$6"
                        elevate
                        key="content"
                        animateOnly={['transform', 'opacity']}
                        animation={[
                            'quicker',
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ]}
                        enterStyle={{ x: 0, y: 20, opacity: 0 }}
                        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    >
                        <Dialog.Title>
                            <XStack style={{ width: '100%' }} justifyContent="space-between" alignItems="center">
                                <Text style={styles.dialogHeading}>{!!pantryItem?.id ? 'Edit Item' : 'Add Item'}</Text>
                                <Dialog.Close displayWhenAdapted asChild>
                                    <SaveItemButton
                                        disabled={!isDirty || !name.trim()}
                                        onPressSave={(cb) => onPressSave(patch, cb)}
                                    />
                                </Dialog.Close>
                            </XStack>
                        </Dialog.Title>
                        <Dialog.Description />
                        <YStack>
                            {/* TODO: Figure out why I can click away to lose focus */}
                            <XStack gap="$2" alignItems="center">
                                <TextInput
                                    id="name"
                                    label='Name'
                                    value={name}
                                    onChangeText={(...args) => change(() => setName(...args))}
                                />
                                <Pressable
                                    onPress={() => change(() => setIsFavorite(!isFavorite))}
                                    style={{ 
                                        position: 'relative',
                                        top: -4
                                     }}
                                >
                                    <SymbolView
                                        name={isFavorite ? 'star.fill' : 'star'}
                                        size={32}
                                        tintColor={isFavorite ? colors.sous : '#ccc'}
                                    />
                                </Pressable>
                            </XStack>
                            <Select
                                label="Category"
                                placeholder="Category..."
                                value={category}
                                onValueChange={(value) => change(() => setCategory(value))}
                                selectLabel="select a category"
                                selectItems={categories.map(cat => ({ label: `${cat.icon} ${cat.name}`, value: cat.name }))}
                            />
                        </YStack>
                        <YStack gap="$2">
                            <XStack alignItems="center" gap="$4">
                                <Switch
                                    id='isInStock'
                                    size='$2'
                                    onCheckedChange={(checked) => change(() => setIsInStock(!!checked))}
                                    checked={isInStock}
                                >
                                    <Switch.Thumb
                                        animation="quicker"
                                        style={{
                                            backgroundColor: isInStock ? colors.primary : '#ccc'
                                        }}
                                    />
                                </Switch>
                                <Text size={16} weight='regular'>In Stock</Text>
                            </XStack>
                            <XStack alignItems="center" gap="$4">
                                <Switch
                                    id='isInShoppingList'
                                    size='$2'
                                    onCheckedChange={(checked) => change(() => setIsInShoppingList(!!checked))}
                                    checked={isInShoppingList}
                                >
                                    <Switch.Thumb
                                        animation="quicker"
                                        style={{
                                            backgroundColor: isInShoppingList ? colors.primary : '#ccc'
                                        }}
                                    />
                                </Switch>
                                <Text size={16} weight='regular'>In Shopping List</Text>
                            </XStack>
                        </YStack>

                        <Unspaced>
                            <Dialog.Close asChild>
                                <Button position="absolute" right="$3" size="$2" circular icon={X} />
                            </Dialog.Close>
                        </Unspaced>
                    </Dialog.Content>
                </Dialog.FocusScope>
            </Dialog.Portal>
        </Dialog>
    )
}