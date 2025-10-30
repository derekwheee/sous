import DragHandle from '@/components/drag-handle';
import Text from '@/components/text';
import globalStyles from '@/styles/global';
import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useColors } from '@/hooks/use-colors';

const useStyles = () => {
    const colors = useColors();
    return {
        ...globalStyles(colors),
        ...StyleSheet.create({
            wrapper: {
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'row',
                gap: 16,
                alignItems: 'center',
                padding: 16,
                backgroundColor: colors.surface,
            },
            wrapperHighlight: {
                backgroundColor: colors.primary,
                borderBottomColor: colors.primary,
            },
            statusDot: {
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: colors.success,
            },
            text: {
                flexShrink: 1,
                fontSize: 16,
                textTransform: 'lowercase',
            },
            textHighlight: {
                color: colors.background,
            },
            textDimmed: {
                opacity: 0.5,
            },
            leftAdornment: {},
            rightAdornment: {
                marginLeft: 'auto',
            },
            actionButton: {
                alignContent: 'center',
                justifyContent: 'center',
                padding: 16,
                aspectRatio: 1,
                height: '100%',
            },
        }),
    };
};

interface SwipeAction {
    icon?: any;
    iconColor?: string;
    color: string;
    onPress: (ref: React.RefObject<any>) => void;
}

interface ListItemProps {
    key: string | number;
    text: string;
    status?: 'success' | 'warning' | 'indeterminate' | 'error';
    dimmed?: boolean;
    highlight?: boolean;
    draggable?: boolean;
    leftAdornment?:
        | React.ReactNode
        | ((props: { highlight: boolean; status?: string }) => React.ReactNode);
    rightAdornment?:
        | React.ReactNode
        | ((props: { highlight: boolean; status?: string }) => React.ReactNode);
    onPress?: () => void;
    leftActions?: SwipeAction[];
    rightActions?: SwipeAction[];
}

function ListItem(props: ListItemProps & PressableProps) {
    const [swipeHeight, setSwipeHeight] = useState<number>(0);

    const ref = useRef<any>(null);

    return props.rightActions || props.leftActions ? (
        <SwipeableListItem {...props} width={swipeHeight} ref={ref}>
            <ListItemContent
                {...props}
                onLayout={(e) => setSwipeHeight(e.nativeEvent.layout.height)}
            />
        </SwipeableListItem>
    ) : (
        <ListItemContent {...props} ref={ref} />
    );
}

export default React.memo(ListItem);

function ListItemContent({
    key,
    text,
    status,
    dimmed = false,
    highlight = false,
    draggable = false,
    leftAdornment,
    rightAdornment,
    ref,
    onLayout,
    onPress,
}: ListItemProps & PressableProps & { ref?: React.RefObject<any> }) {
    const styles = useStyles();
    const colors = useColors();

    const Content = () => (
        <>
            {!!draggable && <DragHandle color={highlight ? colors.background : colors.text} />}
            {!!leftAdornment && (
                <View style={styles.leftAdornment}>
                    {typeof leftAdornment === 'function'
                        ? (leftAdornment as any)({ highlight, status })
                        : leftAdornment}
                </View>
            )}
            {!!status && (
                <View
                    style={[
                        styles.statusDot,
                        {
                            backgroundColor: colors[status],
                        },
                    ]}
                />
            )}
            <Text
                style={[
                    styles.text,
                    highlight && styles.textHighlight,
                    dimmed && styles.textDimmed,
                ]}
            >
                {text}
            </Text>
            <View style={styles.rightAdornment}>
                {typeof rightAdornment === 'function'
                    ? (rightAdornment as any)({ highlight, status })
                    : rightAdornment}
            </View>
        </>
    );

    return !!onPress ? (
        <Pressable
            key={key}
            ref={ref}
            style={[styles.wrapper, highlight && styles.wrapperHighlight]}
            onLayout={onLayout}
            onPress={onPress}
        >
            <Content />
        </Pressable>
    ) : (
        <View
            key={key}
            ref={ref}
            style={[styles.wrapper, highlight && styles.wrapperHighlight]}
            onLayout={onLayout}
        >
            <Content />
        </View>
    );
}

function SwipeableListItem({
    key,
    ref,
    width,
    leftActions,
    rightActions,
    children,
}: ListItemProps & { ref?: React.RefObject<any>; width?: number; children: React.ReactNode }) {
    return (
        <Swipeable
            key={key}
            ref={ref}
            renderLeftActions={(_, trans) => (
                <Actions
                    drag={trans}
                    width={(width || 0) * -1}
                    swipeRef={ref}
                    actions={leftActions}
                />
            )}
            renderRightActions={(_, trans) => (
                <Actions drag={trans} width={width} swipeRef={ref} actions={rightActions} />
            )}
        >
            {children}
        </Swipeable>
    );
}

interface ActionsProps {
    drag: SharedValue<number>;
    width?: number;
    swipeRef?: React.RefObject<any>;
    actions?: SwipeAction[];
}

function Actions({ drag, width = 64, swipeRef, actions }: ActionsProps) {
    const styles = useStyles();
    const colors = useColors();
    const styleAnimation = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: drag.value + width * actions?.length! }],
        };
    });

    const close = (fn: Function) => {
        fn(swipeRef);
        swipeRef?.current?.close();
    };

    return (
        <Reanimated.View style={styleAnimation}>
            <View style={{ flexDirection: 'row' }}>
                {actions?.map(({ onPress, icon, iconColor = colors.background, color }) => (
                    <Pressable key={icon} onPress={() => close(onPress)}>
                        <Feather
                            name={icon}
                            size={24}
                            color={iconColor}
                            style={[styles.actionButton, { backgroundColor: color }]}
                        />
                    </Pressable>
                ))}
            </View>
        </Reanimated.View>
    );
}
