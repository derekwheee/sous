const API_HOST = process.env.API_HOST || 'https://rude-tigers-hang.loca.lt';

console.log('API_HOST:', API_HOST);

const get = async (url) => {
    const response = await fetch(`${API_HOST}${url}`);

    return await response.json();
};

export const getRecipes = async () => {
    try {
        return await get('/recipes');
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const getRecipe = async (id) => {
    try {
        return await get(`/recipes/${id}`);
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const createRecipe = async (recipe) => {
    try {
        const response = await fetch(`${API_HOST}/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipe)
        });
        return await response.json();
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const importRecipe = async (url) => {
    try {
        return await get('/recipes/scrape?url=' + encodeURIComponent(url))
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const getPantry = async () => {
    try {
        return await get('/pantry');
    } catch (err) {
        console.error(err);
        return [];
    }
}