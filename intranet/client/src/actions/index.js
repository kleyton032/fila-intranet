import axios from 'axios';
import { LOGIN_USER, LOGOUT_USER } from './types';
import { getHeader, getToken, saveToken } from './localStorage';

export const initApp = () => {

}

export const handleLogin = ({ user, senha }, callback) => {
    return function (dispatch) {
        axios.post(`/api/usuarios/login`, { user, senha })
            .then((response) => {
                saveToken(response.data);
                dispatch({ type: LOGIN_USER, payload: response.data });
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e)
                callback(e)
            });
    }
}