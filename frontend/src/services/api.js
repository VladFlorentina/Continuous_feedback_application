import axios from 'axios';

const api = axios.create({
    // In productie folosim URL-ul din variabila de mediu, altfel fallback la localhost
    baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000/api`
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default api;