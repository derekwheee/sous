export interface PantryItem {
    id: number;
    name: string;
    isInStock: boolean;
    createdAt: string;
    updatedAt: string;
    deleteAt?: string;
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