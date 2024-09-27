import axios from "axios";

const customFetch = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

customFetch.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default customFetch;