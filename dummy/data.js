export default {
    recipes: [
        {
            id: 1,
            name: 'Avocado Toast',
            prepTime: '20 mins',
            cookTime: '5 mins',
            ingredients: [
                {
                    id: 1,
                    quantity: '1',
                    measurement: 'slice thick cut',
                    pantryId: 1
                },
                {
                    id: 2,
                    quantity: '1/2',
                    measurement: 'large ripe',
                    pantryId: 3
                },
                {
                    id: 3,
                    quantity: '1-2',
                    measurement: 'tsp',
                    pantryId: 4
                },
                {
                    id: 4,
                    quantity: '',
                    measurement: '',
                    pantryId: 5
                },
                {
                    id: 5,
                    quantity: '',
                    measurement: '',
                    pantryId: 6
                }
            ]
        },
        {
            id: 2,
            name: 'Spaghetti & Meatballs',
            prepTime: '30 mins',
            cookTime: '20 mins',
            ingredients: [
                {
                    id: 1,
                    quantity: '1',
                    measurement: 'pound',
                    pantryId: 2
                }
            ]
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
        },
        {
            id: 3,
            name: 'avocado',
            inStock: false
        },
        {
            id: 4,
            name: 'lemon juice',
            inStock: false
        },
        {
            id: 5,
            name: 'kosher salt',
            inStock: false
        },
        {
            id: 6,
            name: 'black pepper',
            inStock: false
        }
    ]
}