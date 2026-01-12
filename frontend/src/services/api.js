import axios from 'axios';

const getBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        // Dacă Render ne dă doar host-ul (fara https), îl adăugăm noi
        return envUrl.startsWith('http') ? envUrl : `https://${envUrl}`;
    }
    // Fallback pentru local development
    return `http://${window.location.hostname}:3000/api`;
};

const api = axios.create({
    baseURL: getBaseUrl()
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default api;