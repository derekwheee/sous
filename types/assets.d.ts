declare module '*.png' {
    const value: any;
    export default value;
}

declare module '*.jpg' {
    const value: any;
    export default value;
}

declare module '*.jpeg' {
    const value: any;
    export default value;
}

declare module '*.gif' {
    const value: any;
    export default value;
}

declare module '*.svg' {
    const value: any;
    export default value;
}

declare module '*.webp' {
    const value: any;
    export default value;
}

interface User {
    id: number;
    email: string;
    name: string;
    defaultHouseholdId?: number;
    createdAt: string;
    updatedAt: string;
    deleteAt?: string;
    households?: Household[];
}

interface Household {
    id: number;
    name: string;
    joinToken: string;
    createdAt: string;
    updatedAt: string;
    deleteAt?: string;
}

interface Pantry {
    id: number;
    name: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    deleteAt?: string;
    pantryItems: PantryItem[];
    itemCategories: ItemCategory[];
}

interface PantryItem {
    id: number;
    name: string;
    isInStock: boolean;
    isFavorite: boolean;
    isInShoppingList: boolean;
    createdAt: string;
    updatedAt: string;
    deleteAt?: string;
    pantryId: number;
    categoryId?: number;
    category?: ItemCategory;
}

interface UpsertPantryItem {
    id?: number;
    name?: string;
    isInStock?: boolean;
    isFavorite?: boolean;
    isInShoppingList?: boolean;
    deleteAt?: string;
    pantryId?: number;
    categoryId?: number;
    deletedAt?: Date;
}

interface Ingredient {
    id?: number;
    sentence?: string;
    amount?: string;
    unit?: string;
    item?: string;
    preparation?: string;
    pantryItemId?: number;
    pantryItem?: PantryItem;
    createdAt?: string;
    updatedAt?: string;
    deleteAt?: string;
}

interface RecipeTag {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    deleteAt?: string;
    recipes?: Recipe[];
}

interface UpsertRecipeTag {
    id?: number;
    name?: string;
    createdAt?: string;
    updatedAt?: string;
    deleteAt?: string;
}

interface Recipe {
    id: number;
    name: string;
    prepTime: string;
    cookTime: string;
    servings?: number;
    createdAt: string;
    updatedAt: string;
    deleteAt?: string;
    ingredients: Ingredient[];
    instructions: string[];
    tags?: RecipeTag[];
}

interface CreateRecipe {
    name: string;
    prepTime: string;
    cookTime: string;
    servings?: number;
    deleteAt?: string;
    ingredients: string[];
    instructions: string[];
}

interface PatchRecipe {
    id: number;
    name?: string;
    prepTime?: string;
    cookTime?: string;
    servings?: number;
    deleteAt?: string;
    ingredients?: string[];
    instructions?: string[];
    tags?: UpsertRecipeTag[];
}

interface UpsertRecipe {
    id?: number;
    name?: string;
    prepTime?: string;
    cookTime?: string;
    servings?: number;
    deleteAt?: string;
    ingredients?: string[];
    instructions?: string[];
    tags?: UpsertRecipeTag[];
}

interface DeleteRecipe {
    id: number;
}

interface ImportedRecipe {
    name: string;
    prepTime: string;
    cookTime: string;
    recipeYield: string;
    ingredients: string[];
    instructions: string[];
    error?: any;
}

interface ItemCategory {
    id: number;
    name: string;
    sortOrder: number;
    icon?: string;
    isNonFood: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    pantryItems: PantryItem[];
}

interface UpsertItemCategory {
    id?: number;
    name?: string;
    sortOrder: number;
    icon?: string;
    isNonFood?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}

interface UseHeaderParams {
    searchBarRef?: any;
    searchPlaceholder?: string;
    onChangeSearch?: ({ nativeEvent: { text } }: { nativeEvent: { text: string } }) => void;
    onCancelSearch?: () => void;
    headerItems?: HeaderItem[];
    dependencies?: React.DependencyList;
}

interface UseHeader {
    isLegacyVersion: boolean;
    SearchBar?: React.Element;
}

interface HeaderMenuItem {
    type: 'action' | 'submenu';
    label?: string;
    icon?: {
        type: 'sfSymbol' | 'image';
        name?: string;
        source?: any;
    };
    onPress?: () => void;
    state?: 'on' | 'off' | 'mixed';
    disabled?: boolean;
    destructive?: boolean;
    hidden?: boolean;
    keepsMenuPresented?: boolean;
    discoverabilityLabel?: string;
    items?: HeaderMenuItem[];
}

interface HeaderItem {
    type?: 'button' | 'menu';
    label: string;
    labelStyle?: {
        fontFamily?: string;
        fontSize?: number;
        fontWeight?: string;
        color?: string;
    };
    icon?: {
        type?: 'sfSymbol' | 'image';
        name?: any;
        source?: any;
    };
    variant?: 'prominent' | 'plain' | 'done';
    tintColor?: string;
    disabled?: boolean;
    width?: number;
    hidesSharedBackground?: boolean;
    sharesBackground?: boolean;
    identifier?: string;
    badge?: {
        value: string | number;
        style?: {
            fontFamily?: string;
            fontSize?: number;
            fontWeight?: string;
            color?: string;
        };
    };
    accessibilityLabel?: string;
    accessibilityHint?: string;
    onPress?: () => void;
    selected?: boolean;
    changesSelectionAsPrimaryAction?: boolean;
    menu?: {
        items: HeaderMenuItem[];
    };
}
