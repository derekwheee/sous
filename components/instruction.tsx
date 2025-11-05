import { useState, useCallback } from 'react';
import { Dimensions, GestureResponderEvent, Pressable, View } from 'react-native';
import { highlightInstructions } from '@/util/highligher';
import Text from '@/components/text';

interface InstructionProps {
    recipe: Recipe | null;
    instruction: string;
    style?: object;
    highlightedStyle?: object;
}

export default function Instruction({
    recipe,
    instruction,
    style,
    highlightedStyle,
}: InstructionProps) {
    const [popoverText, setPopoverText] = useState<string | null>(null);
    const [popoverCoords, setPopoverCoords] = useState<{ x: number; y: number } | undefined>(
        undefined
    );
    const [popoverDimensions, setPopoverDimensions] = useState<
        | {
              width: number;
              height: number;
          }
        | undefined
    >(undefined);

    const highlight = () =>
        highlightInstructions(recipe?.ingredients.map((i) => i.sentence || '') || [], instruction);

    // Calculates coords given an optional event and popover dimensions
    const calculateCoords = useCallback(
        (e?: GestureResponderEvent, dimensions?: { width: number; height: number }) => {
            let locationX = 0;
            let locationY = 0;

            if (e) {
                ({ locationX, locationY } = e.nativeEvent);
            } else if (popoverCoords) {
                locationX = popoverCoords.x;
                locationY = popoverCoords.y;
            }

            const windowWidth = Dimensions.get('window').width;
            const windowHeight = Dimensions.get('window').height;

            const width = dimensions?.width || 0;
            const height = dimensions?.height || 0;

            const x = Math.max(0, Math.min(locationX, windowWidth - width - 16));
            const y = Math.max(0, Math.min(locationY, windowHeight - height - 32));

            return { x, y };
        },
        [popoverCoords]
    );

    const handlePressHighlighted = useCallback(
        (e: GestureResponderEvent, text: string) => {
            setPopoverText(text);
            // Use existing dimensions if available
            setPopoverCoords(calculateCoords(e, popoverDimensions));
        },
        [calculateCoords, popoverDimensions]
    );

    const handlePopoverLayout = useCallback(
        (event: any) => {
            const { width, height } = event.nativeEvent.layout;
            setPopoverDimensions({ width, height });

            // Recalculate coords now that dimensions are known
            setPopoverCoords((prev) => calculateCoords(undefined, { width, height }));
        },
        [calculateCoords]
    );

    return (
        <Pressable onPress={() => setPopoverText(null)}>
            <Text style={style}>
                {highlight().map(({ text, isHighlighted, match }, key) => (
                    <Text
                        key={key}
                        style={[style, isHighlighted ? highlightedStyle : {}]}
                        {...(isHighlighted
                            ? {
                                  onPress: (e) => handlePressHighlighted(e, match?.item || ''),
                              }
                            : {})}
                    >
                        {text}
                    </Text>
                ))}
            </Text>
            {!!popoverText && (
                <View
                    onLayout={handlePopoverLayout}
                    style={{
                        position: 'absolute',
                        top: popoverCoords?.y,
                        left: popoverCoords?.x,
                        marginTop: 8,
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: '#eee',
                    }}
                >
                    <Text style={{ fontSize: 16 }}>{popoverText}</Text>
                </View>
            )}
        </Pressable>
    );
}
