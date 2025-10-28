import Text from '@/components/text';
import globalStyles, { colors } from '@/styles/global';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useRef, useState } from 'react';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

const styles = {
    ...globalStyles,
    ...StyleSheet.create({
        wrapper: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
        },
        statusDot: {
            width: 16,
            height: 16,
            marginRight: 16,
            borderRadius: 8,
            backgroundColor: colors.success,
        },
        name: {
            flexGrow: 1,
            fontSize: 16,
            textTransform: 'lowercase',
        },
        deleteAction: {
            alignContent: 'center',
            justifyContent: 'center',
            padding: 16,
            aspectRatio: 1,
            height: '100%',
            backgroundColor: colors.error,
        },
        editAction: {
            alignContent: 'center',
            justifyContent: 'center',
            padding: 16,
            aspectRatio: 1,
            height: '100%',
            backgroundColor: colors.primary,
        },
        finishAction: {
            alignContent: 'center',
            justifyContent: 'center',
            padding: 16,
            aspectRatio: 1,
            height: '100%',
            backgroundColor: colors.warning,
        },
    }),
};

export default function PantryListing({
    pantryItem,
    finishPantryItem,
    deletePantryItem,
    onToggleFavorite,
    onRemoveItem,
    style = {},
    ...rest
}: {
    pantryItem: PantryItem;
    finishPantryItem: (pantryItem:PantryItem) => void;
    deletePantryItem: (id: number, callback: Function) => void;
    onToggleFavorite: ({ id, isFavorite }: { id: number; isFavorite: boolean }) => void;
    onRemoveItem?: (id: number, ref?: any) => void;
    style?: any;
} & PressableProps) {

    const router = useRouter();
    const [swipeHeight, setSwipeHeight] = useState<number>(0);

    const swipeRef = useRef(null);

    const updateHeight = useCallback(
        (r: any) => {
            if (swipeHeight !== r.nativeEvent.layout.height) {
                setSwipeHeight(r.nativeEvent.layout.height);
            }
        },
        [swipeHeight]
    );

    return (
        <Swipeable
            key={pantryItem.id}
            ref={swipeRef}
            renderLeftActions={(prog, trans) => (
                <LeftAction
                    prog={prog}
                    drag={trans}
                    pantryItem={pantryItem}
                    width={swipeHeight}
                    onFinishItem={() => finishPantryItem(pantryItem)}
                    swipeRef={swipeRef}
                />
            )}
            renderRightActions={(prog, trans) => (
                <RightAction
                    prog={prog}
                    drag={trans}
                    pantryItem={pantryItem}
                    width={swipeHeight}
                    onEditItem={(pantryItemId, pantryId) =>
                        router.push({
                            pathname: '/pantry/edit',
                            params: {
                                pantryItemId,
                                pantryId,
                            },
                        })
                    }
                    onRemoveItem={(id, ref) => {
                        deletePantryItem(id, () => {
                            ref?.close();
                        });
                    }}
                    swipeRef={swipeRef}
                />
            )}
        >
            <Pressable style={[styles.wrapper, style]} onLayout={updateHeight} {...rest}>
                <View
                    style={[
                        styles.statusDot,
                        { backgroundColor: getStatusDotColor(pantryItem.isInStock) },
                    ]}
                />
                <Text style={styles.name}>{pantryItem.name}</Text>
                <Pressable
                    onPress={() =>
                        onToggleFavorite({ id: pantryItem.id, isFavorite: !pantryItem.isFavorite })
                    }
                >
                    <SymbolView
                        name={'repeat'}
                        size={24}
                        tintColor={pantryItem.isFavorite ? colors.primary : '#ccc'}
                    />
                </Pressable>
            </Pressable>
        </Swipeable>
    );
}

function getStatusDotColor(isInStock: boolean) {
    if (isInStock) {
        return colors.success;
    }

    return colors.indeterminate;
}

function LeftAction({
    prog,
    drag,
    pantryItem,
    width,
    onFinishItem,
    swipeRef,
}: {
    prog: SharedValue<number>;
    drag: SharedValue<number>;
    pantryItem: PantryItem;
    width: number;
    onFinishItem?: (id: number) => void;
    swipeRef?: React.RefObject<any>;
}) {
    const styleAnimation = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: drag.value - width }],
        };
    });

    swipeRef?.current?.close;

    return (
        <Reanimated.View style={styleAnimation}>
            <View style={{ flexDirection: 'row' }}>
                <Pressable
                    onPress={() => {
                        swipeRef?.current?.close();
                        onFinishItem?.(pantryItem.id);
                    }}
                >
                    <Feather name='slash' size={24} color='#000' style={styles.finishAction} />
                </Pressable>
            </View>
        </Reanimated.View>
    );
}

function RightAction({
    prog,
    drag,
    pantryItem,
    width,
    onEditItem,
    onRemoveItem,
    swipeRef,
}: {
    prog: SharedValue<number>;
    drag: SharedValue<number>;
    pantryItem: PantryItem;
    width: number;
    onEditItem?: (pantryItemId: number, pantryId: number) => void;
    onRemoveItem?: (id: number, ref?: any) => void;
    swipeRef?: React.RefObject<any>;
}) {
    const styleAnimation = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: drag.value + width * 2 }],
        };
    });

    swipeRef?.current?.close;

    return (
        <Reanimated.View style={styleAnimation}>
            <View style={{ flexDirection: 'row' }}>
                <Pressable
                    onPress={() => {
                        swipeRef?.current?.close();
                        onEditItem?.(pantryItem.id, pantryItem.pantryId);
                    }}
                >
                    <Feather name='edit-2' size={24} color='#fff' style={styles.editAction} />
                </Pressable>
                <Pressable onPress={() => onRemoveItem?.(pantryItem.id, swipeRef?.current)}>
                    <Feather name='trash-2' size={24} color='#fff' style={styles.deleteAction} />
                </Pressable>
            </View>
        </Reanimated.View>
    );
}
