import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import {
    REGISTER_SUCCESS, REGISTER_FAIL,
    USER_LOADED, AUTH_ERROR,
    LOGIN_SUCCESS, LOGIN_FAIL,
    LOGOUT
} from '../constants';
import { setAlert } from './alert';

//Load User
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token)
    }
    try {
        const res = await axios.get('http://localhost:5000/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

//Register User
export const register = ({ firstName, lastName, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ firstName, lastName, email, password });
    try {
        const res = await axios.post('http://localhost:5000/api/auth', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.message, 'error')));
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
}

//login User
export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ email, password });
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.message, 'error')));
        }
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

//logout
export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    })
}