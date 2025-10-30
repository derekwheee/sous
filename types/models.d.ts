interface User {
    id: number;
    email: string;
    name: string;
    defaultHouseholdId?: number;
    createdAt: string;
    updatedAt: string;
    deleteAt?: Date;
    households?: Household[];
}

interface Household {
    id: number;
    name: string;
    joinToken: string;
    createdAt: string;
    updatedAt: string;
    deleteAt?: Date;
}

interface Pantry {
    id: number;
    name: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    deleteAt?: Date;
    pantryItems: PantryItem[];
    itemCategories: ItemCategory[];
}

interface PantryItem {
    id: number;
    name: string;
    isInStock: boolean;
    isFavorite: boolean;
    isInShoppingList: boolean;
    purchasedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    deleteAt?: Date;
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
    purchasedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    pantryId?: number;
    categoryId?: number;
    deletedAt?: Date;
}

interface Ingredient {
    id?: number;
    sentence?: string;
    amount?: any;
    unit?: string;
    item?: string;
    preparation?: string;
    pantryItemId?: number;
    pantryItem?: PantryItem;
    createdAt?: Date;
    updatedAt?: Date;
    deleteAt?: Date;
    json?: {
        amount?: {
            RANGE: boolean;
            quantity: number;
            quantity_max?: number;
        }[];
    } & any;
}

interface RecipeTag {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    deleteAt?: Date;
    recipes?: Recipe[];
}

interface UpsertRecipeTag {
    id?: number;
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deleteAt?: Date;
}

interface Recipe {
    id: number;
    name: string;
    prepTime: string;
    cookTime: string;
    servings?: string;
    createdAt: string;
    updatedAt: string;
    deleteAt?: Date;
    ingredients: Ingredient[];
    instructions: string[];
    tags?: RecipeTag[];
}

interface CreateRecipe {
    name: string;
    prepTime: string;
    cookTime: string;
    servings?: string;
    deleteAt?: Date;
    ingredients: string[];
    instructions: string[];
}

interface PatchRecipe {
    id: number;
    name?: string;
    prepTime?: string;
    cookTime?: string;
    servings?: string;
    deleteAt?: Date;
    ingredients?: string[];
    instructions?: string[];
    tags?: UpsertRecipeTag[];
}

interface UpsertRecipe {
    id?: number;
    name?: string;
    prepTime?: string;
    cookTime?: string;
    servings?: string;
    deleteAt?: Date;
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
    deletedAt?: Date;
    pantryItems: PantryItem[];
}

interface UpsertItemCategory {
    id?: number;
    name?: string;
    sortOrder?: number;
    icon?: string;
    isNonFood?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

interface RecipeSuggestion {
    name: string;
    description?: string;
    prepTime?: string;
    cookTime?: string;
    servings?: string;
    ingredients: string[];
    instructions: string[];
    explanation?: string;
}
