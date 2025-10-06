import Text from '@/components/text';
import TextInput from '@/components/text-input';
import globalStyles, { colors } from '@/styles/global';
import { PantryItem, PatchPantryItem } from '@/types/interfaces';
import { X } from '@tamagui/lucide-icons';
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
    XStack
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
    pantryItem,
    onPressSave,
    children,
    ...props
}: {
    pantryItem: PantryItem,
    onPressSave: (patch: PatchPantryItem, cb?: Function) => void,
} & DialogProps) {

    const [isDirty, setIsDirty] = useState(false);
    const [name, setName] = useState(pantryItem.name);
    const [isInStock, setIsInStock] = useState(pantryItem.isInStock);

    const patch: PatchPantryItem = {
        id: pantryItem.id,
        name,
        isInStock
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
                    moveOnKeyboardChange
                    snapPoints={[300]}
                    snapPointsMode='constant'
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
                                <Text style={styles.dialogHeading}>{`Edit Item`}</Text>
                                <Dialog.Close displayWhenAdapted asChild>
                                    <SaveItemButton
                                        disabled={!isDirty}
                                        onPressSave={(cb) => onPressSave(patch, cb)}
                                    />
                                </Dialog.Close>
                            </XStack>
                        </Dialog.Title>
                        <Dialog.Description />

                        <TextInput
                            autoFocus
                            id="name"
                            label='Name'
                            value={name}
                            onChangeText={(...args) => change(() => setName(...args))}
                        />
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