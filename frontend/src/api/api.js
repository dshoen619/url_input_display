import axios from 'axios';

// Determine the base URL based on the environment
const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://url-input-backend-5b90ccdc2031.herokuapp.com' // Corrected URL
        : 'http://localhost:5005',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 50000, // Timeout set to 10 seconds (10,000 milliseconds)
});

export const sendInputs = async (inputs) => {
    try {
        const response = await api.post('/urlInputs', inputs);
        return response.data;
    } catch (error) {
        console.error('Error in sendInputs:', error);
        throw error;
    }
};
