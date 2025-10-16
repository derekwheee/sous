export interface User {
    id: number;
    email: string;
    name: string;
    defaultHouseholdId?: number;
    createdAt: string;
    updatedAt: string;
    deleteAt?: string;
    households?: Household[];
}

export interface Household {
    id: number;
    name: string;
    joinToken: string;
    createdAt: string;
    updatedAt: string;
    deleteAt?: string;
}

export interface Pantry {
    id: number;
    name: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    deleteAt?: string;
    pantryItems: PantryItem[];
    itemCategories: ItemCategory[];
}

export interface PantryItem {
    id: number;
    name: string;
    isInStock: boolean;
    isFavorite: boolean;
    isInShoppingList: boolean;
    createdAt: string;
    updatedAt: string;
    deleteAt?: string;
    categoryId?: number;
    category?: ItemCategory;
}

export interface UpsertPantryItem {
    id?: number;
    name?: string;
    isInStock?: boolean;
    isFavorite?: boolean;
    isInShoppingList?: boolean;
    deleteAt?: string;
    categoryId?: number;
}

export interface Ingredient {
    id?: number;
    sentence?: string;
    amount?: string;
    unit?: string;
    item?: string;
    pantryItemId?: number;
    pantryItem?: PantryItem;
    createdAt?: string;
    updatedAt?: string;
    deleteAt?: string;
}

export interface RecipeTag {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    deleteAt?: string;
    recipes?: Recipe[];
}

export interface UpsertRecipeTag {
    id?: number;
    name?: string;
    createdAt?: string;
    updatedAt?: string;
    deleteAt?: string;
}

export interface Recipe {
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

export interface CreateRecipe {
    name: string;
    prepTime: string;
    cookTime: string;
    servings?: number;
    deleteAt?: string;
    ingredients: string[];
    instructions: string[];
}

export interface PatchRecipe {
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

export interface UpsertRecipe {
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

export interface DeleteRecipe {
    id: number;
}

export interface ImportedRecipe {
    name: string;
    prepTime: string;
    cookTime: string;
    recipeYield: string;
    ingredients: string[];
    instructions: string[];
    error?: any;
}

export interface ItemCategory {
        id: number,
        name: string,
        sortOrder: number,
        icon?: string,
        isNonFood: boolean,
        createdAt: string,
        updatedAt: string,
        deletedAt?: string,
        pantryItems: PantryItem[]
}

export interface UpsertItemCategory {
        id?: number,
        name?: string,
        sortOrder: number,
        icon?: string,
        isNonFood?: boolean,
        createdAt?: string,
        updatedAt?: string,
        deletedAt?: string
}