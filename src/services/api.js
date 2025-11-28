import axios from 'axios';
import { Platform } from 'react-native';

// Determine Base URL based on Platform
// Android Emulator uses 10.0.2.2 to access localhost of the host machine
// Web uses localhost
// Physical Device uses PC's LAN IP
const BASE_URL = Platform.OS === 'android'
    ? 'http://192.168.0.14:3000'
    : 'http://localhost:3000';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token if available
// TODO: Integrate with AsyncStorage or SecureStore to retrieve token
// api.interceptors.request.use(async (config) => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

const ApiService = {
    // Auth
    login: async (email, password) => {
        try {
            const response = await api.post('/auth', { email, password });
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Users
    createUser: async (userData) => {
        try {
            // userData should contain: name, email, birth_date, cpf, password
            const response = await api.post('/users/create', userData);
            return response.data;
        } catch (error) {
            console.error('Create User error:', error.response?.data || error.message);
            throw error;
        }
    },

    getUserByCPF: async (cpf) => {
        try {
            const response = await api.post('/users/', { cpf });
            return response.data;
        } catch (error) {
            console.error('Get User by CPF error:', error.response?.data || error.message);
            throw error;
        }
    },

    getAllUsers: async () => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            console.error('Get All Users error:', error.response?.data || error.message);
            throw error;
        }
    },

    updateUser: async (id, data) => {
        try {
            const response = await api.patch(`/users/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Update User error:', error.response?.data || error.message);
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete User error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Company
    createCompany: async (name) => {
        try {
            const response = await api.post('/company', { name });
            return response.data;
        } catch (error) {
            console.error('Create Company error:', error.response?.data || error.message);
            throw error;
        }
    },

    registerInCompany: async (companyId, cpf) => {
        try {
            const response = await api.post(`/registerInCompany/${companyId}`, { cpf });
            return response.data;
        } catch (error) {
            console.error('Register in Company error:', error.response?.data || error.message);
            throw error;
        }
    },
};

export default ApiService;
