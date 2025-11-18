import axios from 'axios';

const ENDPOINT_URL = 'http://localhost:3001';

const axiosInstance = axios.create({
    baseURL: ENDPOINT_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default axiosInstance;
