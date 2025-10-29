export function getDefault(pantries: Pantry[] | undefined): Pantry | undefined {
    return pantries?.find((p) => p.isDefault) || pantries?.[0];
}
