enum SSEMessageType {
    RECIPE_UPDATE = 'recipe_update',
    RECIPE_DELETE = 'recipe_delete',
    PANTRY_UPDATE = 'pantry_update',
    CATEGORY_UPDATE = 'category_update',
    USER_UPDATE = 'user_update',
}

interface BroadcastMessage {
    type: SSEMessageType;
    from: string;
    data: any;
}
