/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'You are logged in');
            window.setTimeout(() => {
                location.assign('/');
            }, 1250
            );
        }

    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout'
        });
        if ((res.data.status === 'success')) location.assign('/login');
        showAlert('success', 'Logged Out');
    } catch (err) {
        showAlert('error', 'Error logging out! Try again.');
    }
};