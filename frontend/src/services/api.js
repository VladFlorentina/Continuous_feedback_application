// configurare axios si interceptori pentru call-uri api
import axios from 'axios';

const getBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        // daca render ne da doar host-ul (fara https), il adaugam noi
        return envUrl.startsWith('http') ? envUrl : `https://${envUrl}`;
    }
    // fallback pentru local development
    return `http://${window.location.hostname}:3000/api`;
};

const api = axios.create({
    baseURL: getBaseUrl()
});

// adauga token-ul de autentificare la fiecare request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default api;