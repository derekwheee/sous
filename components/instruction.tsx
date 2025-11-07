import { useState, useCallback } from 'react';
import { Alert, Dimensions, GestureResponderEvent, Pressable, View } from 'react-native';
import { highlightInstructions } from '@/util/highligher';
import Text from '@/components/text';

interface InstructionProps {
    recipe: Recipe | null;
    instruction: string;
    style?: object;
    highlightedStyle?: object;
    onStartTimer?: (duration: number, unit: string) => void;
}

export default function Instruction({
    recipe,
    instruction,
    style,
    highlightedStyle,
    onStartTimer,
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

    const highlighted = highlightInstructions(
        recipe?.ingredients.map((i) => i.sentence || '') || [],
        instruction
    );

    const highlightedWithTimes: HighlightedSegment[] = !onStartTimer
        ? highlighted
        : highlighted
              .map((segment: HighlightedSegment) => {
                  if (segment.isHighlighted) {
                      return segment;
                  }

                  const [match, min, max, unit] =
                      /(\d+)(?:(?:-|\sto\s)(\d+))?\s?((?:min|sec|hour)\w*)\b/.exec(segment.text) ||
                      [];

                  if (!match) {
                      return segment;
                  }

                  const splitRegex = new RegExp(`(${match})`);

                  const newSegments: HighlightedSegment[] = segment.text
                      .split(splitRegex)
                      .map((part) => ({
                          text: part,
                          isHighlighted: false,
                          isTimer: part === match,
                          match: { item: match },
                          timeUnit: unit,
                          minTime: !!min ? Number(min) : undefined,
                          maxTime: !!max ? Number(max) : undefined,
                      }))
                      .flat();

                  return newSegments;
              })
              .flat();

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

            const x = Math.max(0, Math.min(locationX, windowWidth - width - 24));
            const y = Math.max(0, Math.min(locationY, windowHeight - height - 48));

            return { x, y };
        },
        [popoverCoords]
    );

    const handlePressHighlighted = useCallback(
        (e: GestureResponderEvent, text: string) => {
            setPopoverText(text);
            setPopoverCoords(calculateCoords(e, popoverDimensions));
        },
        [calculateCoords, popoverDimensions]
    );

    const handlePopoverLayout = useCallback(
        (event: any) => {
            const { width, height } = event.nativeEvent.layout;
            setPopoverDimensions({ width, height });
            setPopoverCoords(() => calculateCoords(undefined, { width, height }));
        },
        [calculateCoords]
    );

    const handleStartTimer = (time: number, timeUnit: string) =>
        Alert.alert('Start Timer', `Set a timer for ${time} ${timeUnit}?`, [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Start',
                onPress: () => {
                    onStartTimer?.(time, timeUnit);
                },
            },
        ]);

    return (
        <Pressable onPress={() => setPopoverText(null)}>
            <Text style={style}>
                {highlightedWithTimes.map(
                    ({ text, isHighlighted, match, isTimer, timeUnit, minTime }, key) => (
                        <Text
                            key={key}
                            style={[
                                style,
                                isHighlighted || isTimer ? highlightedStyle : {},
                                isTimer ? { textDecorationStyle: 'dotted' } : {},
                            ]}
                            {...(isHighlighted
                                ? {
                                      onPress: (e) =>
                                          handlePressHighlighted(e, match?.fullIngredient || ''),
                                  }
                                : {})}
                            {...(isTimer
                                ? {
                                      onPress: (e) => handleStartTimer(minTime!, timeUnit!),
                                  }
                                : {})}
                        >
                            {text}
                        </Text>
                    )
                )}
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
                        zIndex: 1000,
                    }}
                >
                    <Text style={{ fontSize: 16, color: '#000' }}>{popoverText}</Text>
                </View>
            )}
        </Pressable>
    );
}
