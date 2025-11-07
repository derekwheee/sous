interface IngredientKeyword {
    keyword: string;
    fullIngredient: string;
}

interface HighlightedSegment {
    text: string;
    isHighlighted: boolean;
    match?: Partial<FuseResult<string>>;
    isTimer?: boolean;
    timeUnit?: string;
    minTime?: number;
    maxTime?: number;
}
