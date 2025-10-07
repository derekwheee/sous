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

export interface Recipe {
    id: number;
    name: string;
    prepTime: string;
    cookTime: string;
    createdAt: string;
    updatedAt: string;
    deleteAt?: string;
    ingredients: Ingredient[];
    instructions: string[];
}

export interface CreateRecipe {
    name: string;
    prepTime: string;
    cookTime: string;
    deleteAt?: string;
    ingredients: string[];
    instructions: string[];
}

export interface PatchRecipe {
    id: number;
    name?: string;
    prepTime?: string;
    cookTime?: string;
    deleteAt?: string;
    ingredients?: Ingredient[];
    instructions?: string[];
}

export interface ItemCategory {
        id: number,
        name: string,
        sortOrder: number,
        icon?: string,
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
        createdAt?: string,
        updatedAt?: string,
        deletedAt?: string
}