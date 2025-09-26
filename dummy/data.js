export default {
    recipes: [
        {
            id: 1,
            name: 'Avocado Toast',
            ingredients: {
                quantity: 1,
                measurement: 'slice thick cut',
                pantryId: 1
            }
        },
        {
            id: 2,
            name: 'Spaghetti & Meatballs',
            ingredients: {
                quantity: 1,
                measurement: 'pound',
                pantryId: 2
            }
        }
    ],
    pantry: [
        {
            id: 1,
            name: 'bread',
            inStock: true
        },
        {
            id: 2,
            name: 'spaghetti',
            inStock: false
        }
    ]
}