import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import Utils from './Utils';

/* ACTIONS */
const userConstants = {
    LOGIN: 'USER_LOGIN',
    LOGOUT: 'USER_LOGOUT',
};

const alertConstants = {
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS', // Добавлена константа
    CLEAR: 'CLEAR',
};

export const alertActions = {
    error,
    success, // Добавлен метод
    clear
};

/* ACTION GENERATORS */
export const userActions = {
    login,
    logout
};

function error(msg) {
    return { type: alertConstants.ERROR, msg }
}

function success(msg) { // Добавлен action creator
    return { type: alertConstants.SUCCESS, msg }
}

function clear() {
    return { type: alertConstants.CLEAR }
}

function login(user) {
    Utils.saveUser(user);
    return { type: userConstants.LOGIN, user };
}

function logout() {
    Utils.removeUser();
    return { type: userConstants.LOGOUT };
}

/* REDUCER */
let user = Utils.getUser();
const initialState = user ? { user } : {};

function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN:
            return { user: action.user };
        case userConstants.LOGOUT:
            return {};
        default:
            return state;
    }
}

function alert(state = {}, action) {
    switch (action.type) {
        case alertConstants.ERROR:
            return { type: 'error', msg: action.msg };
        case alertConstants.SUCCESS: // Обработка success
            return { type: 'success', msg: action.msg };
        case alertConstants.CLEAR:
            return { };
        default:
            return state;
    }
}

/* STORE */
const rootReducer = combineReducers({
    authentication,
    alert
});

const loggerMiddleware = createLogger();

export const store = createStore(
    rootReducer,
    applyMiddleware(loggerMiddleware)
);