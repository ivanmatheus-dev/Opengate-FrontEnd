import axios from 'axios';

// Mock API Service
// Since we don't have a real backend, we simulate responses.

const api = {
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    resolve({
                        data: {
                            token: 'mock-jwt-token',
                            user: { email, name: 'Test User' },
                        },
                    });
                } else {
                    reject({ response: { data: { message: 'Invalid credentials' } } });
                }
            }, 1000);
        });
    },

    register: async (name, cpf, email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (name && cpf && email && password) {
                    resolve({
                        data: {
                            message: 'User registered successfully',
                        },
                    });
                } else {
                    reject({ response: { data: { message: 'Missing fields' } } });
                }
            }, 1000);
        });
    },

    checkin: async (userId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Check-in recorded for user ${userId} at ${new Date().toISOString()}`);
                resolve({ data: { success: true } });
            }, 500);
        });
    },
};

export default api;
