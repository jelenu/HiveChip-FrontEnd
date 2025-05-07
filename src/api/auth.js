import { saveTokens } from "../helpers/tokenManager";

const BASE_URL = 'http://192.168.1.16:8000';

const HandleLogin = async (username, password) => {
    try {
        console.log('Sending login request to:', `${BASE_URL}/auth/jwt/create/`);
        console.log('Request body:', { username, password });

        const response = await fetch(`${BASE_URL}/auth/jwt/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response from backend:', errorData);
            throw new Error(errorData.detail || 'Login failed!');
        }

        const data = await response.json();
        console.log('Response data:', data);

        // Guardar ambos tokens
        await saveTokens(data.access, data.refresh);
        return data;
    }
    catch (error) {
        console.error('Error during login:', error);
        throw error; // Rethrow the error to be handled in the calling function
    }
};

export { HandleLogin };