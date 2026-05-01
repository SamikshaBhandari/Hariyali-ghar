import axios from 'axios';

// Create Axios Instance 
const API = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api',
});
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;