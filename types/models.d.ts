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
    servings?: string;
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
    servings?: string;
    deleteAt?: string;
    ingredients: string[];
    instructions: string[];
}

interface PatchRecipe {
    id: number;
    name?: string;
    prepTime?: string;
    cookTime?: string;
    servings?: string;
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
    servings?: string;
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
