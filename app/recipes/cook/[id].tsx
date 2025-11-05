import Text from '@/components/text';
import { useRecipe } from '@/hooks/use-recipe';
import { fonts } from '@/styles/global';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useStyles } from '@/hooks/use-style';
import { useHeader } from '@/hooks/use-header';
import PagerView from 'react-native-pager-view';
import Instruction from '@/components/instruction';

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
    };
};

export default function RecipeCookMode() {
    const params = useLocalSearchParams<{ id: string }>();
    const id = Number(params.id);

    const { styles, colors } = useStyles(moduleStyles);
    const [activeInstructionIndex, setActiveInstructionIndex] = useState<number>(0);

    const { recipe } = useRecipe({ recipeId: id });
    const router = useRouter();

    useHeader({
        headerItems: [
            activeInstructionIndex > 0
                ? {
                      label: 'back',
                      icon: {
                          name: ['chevron.left', 'logout'],
                      },
                      onPress: () => {
                          setActiveInstructionIndex((index) => Math.max(0, index - 1));
                      },
                  }
                : null,
            activeInstructionIndex < (recipe?.instructions.length || 1) - 1 && {
                label: 'next',
                icon: {
                    name: ['chevron.right', 'logout'],
                },
                onPress: () => {
                    setActiveInstructionIndex((index) =>
                        Math.min(index + 1, (recipe?.instructions.length || 1) - 1)
                    );
                },
            },
            activeInstructionIndex === (recipe?.instructions.length || 1) - 1 && {
                label: 'done',
                icon: {
                    name: ['checkmark', 'logout'],
                },
                onPress: () => {
                    router.replace(`/recipes/${id}` as any);
                },
            },
        ].filter(Boolean) as HeaderItem[],
    });

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
        </View>
    );
}
