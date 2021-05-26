// == Import : npm
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.API_IMMO_APP,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
});

export default api;
