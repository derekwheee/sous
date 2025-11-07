import Text from '@/components/text';
import { useRecipe } from '@/hooks/use-recipe';
import { fonts } from '@/styles/global';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useStyles } from '@/hooks/use-style';
import PagerView from 'react-native-pager-view';
import Instruction from '@/components/instruction';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { SymbolView } from 'expo-symbols';
import { usePrevious } from '@/hooks/use-previous';

const AUDIO_SOURCE = require('@/assets/alarm.mp3');
const TIMER_ENDING_THRESHOLD = 60; // seconds

const moduleStyles: CreateStyleFunc = (colors, brightness, opacity) => {
    return {
        pager: {
            flex: 1,
        },
        pageDots: {
            position: 'absolute',
            left: '50%',
            transform: [{ translateX: '-50%' }],
            bottom: 16,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: brightness(colors.primary, 80),
        },
        pageDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: opacity(colors.white, 0.5),
        },
        pageDotActive: {
            backgroundColor: colors.white,
        },
        instructionContainer: {
            flex: 1,
            marginBottom: 16,
            paddingVertical: 120,
            paddingHorizontal: 16,
            backgroundColor: colors.primary,
        },
        instructionIndex: {
            fontFamily: fonts.poppins.bold,
            fontSize: 64,
            color: colors.white,
        },
        instructionText: {
            flexShrink: 1,
            fontFamily: fonts.poppins.regular,
            fontSize: 32,
            color: colors.white,
        },
        timer: {
            position: 'absolute',
            top: 72,
            right: -48,
            transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 99,
            backgroundColor: colors.sous,
            zIndex: 1000,
        },
        timerText: {
            fontFamily: 'ui-monospace',
            fontWeight: 'bold',
            fontSize: 24,
            color: colors.black,
        },
        timerEnding: {
            backgroundColor: colors.error,
        },
        timerEndingText: {
            color: colors.white,
        },
    };
};

export default function RecipeCookMode() {
    const params = useLocalSearchParams<{ id: string }>();
    const id = Number(params.id);

    const { styles, colors } = useStyles(moduleStyles);
    const [activeInstructionIndex, setActiveInstructionIndex] = useState<number>(0);
    const [timer, setTimer] = useState<number>(0);
    const [showTimer, setShowTimer] = useState<boolean>(false);
    const prevTimer = usePrevious(timer);

    const { recipe } = useRecipe({ recipeId: id });
    const player = useAudioPlayer(AUDIO_SOURCE);
    const status = useAudioPlayerStatus(player);
    player.loop = true;

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((t) => t - 1);
            }, 1000);
            return () => clearInterval(interval);
        }

        if (prevTimer && prevTimer > 0 && timer === 0) {
            player.play();
        }
    }, [timer, prevTimer, player, status.playing]);

    const startTimer = (seconds: number) => {
        setTimer(seconds);
    };

    const stopTimer = () => {
        setTimer(0);
        player.pause();
    };

    const parseTime = (duration: number, unit: string) => {
        if (unit.startsWith('sec')) {
            return duration;
        } else if (unit.startsWith('min')) {
            return duration * 60;
        } else if (unit.startsWith('hour')) {
            return duration * 3600;
        }
        return duration;
    };

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        if (hours > 0) {
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    };

    const handleStartTimer = (duration: number, unit: string) => {
        const seconds = parseTime(duration, unit);
        startTimer(seconds);
        setShowTimer(true);
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.primary }}>
            <PagerView
                initialPage={0}
                style={styles.pager}
                overdrag
                onPageSelected={(e) => {
                    setActiveInstructionIndex(e.nativeEvent.position);
                }}
            >
                {recipe?.instructions.map((instruction, pageIndex) => (
                    <ScrollView key={pageIndex} style={styles.instructionContainer}>
                        <Text style={styles.instructionIndex}>{pageIndex + 1}</Text>
                        <Instruction
                            recipe={recipe}
                            instruction={instruction}
                            style={styles.instructionText}
                            highlightedStyle={{ textDecorationLine: 'underline' }}
                            onStartTimer={handleStartTimer}
                        />
                        <View style={{ height: 120 }} />
                    </ScrollView>
                ))}
            </PagerView>
            <View style={styles.pageDots}>
                {recipe?.instructions.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.pageDot,
                            index === activeInstructionIndex && styles.pageDotActive,
                        ]}
                    />
                ))}
            </View>
            {showTimer && (
                <Pressable
                    style={[styles.timer, timer < TIMER_ENDING_THRESHOLD && styles.timerEnding]}
                    onPress={() => {
                        stopTimer();
                        setShowTimer(false);
                    }}
                >
                    <SymbolView
                        name='timer'
                        size={20}
                        tintColor={timer < TIMER_ENDING_THRESHOLD ? colors.white : colors.black}
                    />
                    <Text
                        style={[
                            styles.timerText,
                            timer < TIMER_ENDING_THRESHOLD && styles.timerEndingText,
                        ]}
                    >
                        {formatTime(timer)}
                    </Text>
                </Pressable>
            )}
        </View>
    );
}
