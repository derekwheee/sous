
const API_HOST: string | undefined = process.env.EXPO_PUBLIC_API_HOST;

if (!API_HOST) {
    throw new Error('API_HOST is not defined');
}

const makeRequest = async (url: string, options: RequestInit = {}) => {
    let response;

    try {
        response = await fetch(`${API_HOST}${url}`, options);

        return await response.json();
    } catch (err) {
        if (response) {
            console.log(response);
        }
        console.error(err);
        return null;
    }
};

export default {
    get: (url: string) => makeRequest(url, { method: 'GET' }),
    post: (url: string, body: object) => makeRequest(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
};