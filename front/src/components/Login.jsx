import React, { useState } from 'react';
import BackendService from '../services/BackendService';
import Utils from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import { connect } from 'react-redux';
import { userActions } from '../utils/Rdx';
import { useDispatch } from 'react-redux';

export default connect()(function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const nav = useNavigate();
    const dispatch = useDispatch();

    const handleChangeLogin = (e) => {
        setUsername(e.target.value);
        setErrorMessage(''); // Сброс ошибки при изменении логина
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
        setErrorMessage(''); // Сброс ошибки при изменении пароля
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (!username || !password) {
            setErrorMessage('Заполните все поля');
            return;
        }

        setLoggingIn(true);

        BackendService.login(username, password)
            .then(resp => {
                Utils.saveUser(resp.data); // Сохраняем токен и данные пользователя
                dispatch(userActions.login(resp.data)); // Обновляем Redux
                nav("/home");
            })
            .catch(err => {
                let message = 'Ошибка входа';
                if (err.response) {
                    message = err.response.data.error || message;
                }
                setErrorMessage(message);
            })
            .finally(() => {
                setLoggingIn(false);
            });
    };

    return (
        <div className="col-md-6 me-0">
            <h2>Вход</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form name="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Логин</label>
                    <input
                        type="text"
                        className={`form-control ${submitted && !username ? 'is-invalid' : ''}`}
                        name="username"
                        value={username}
                        onChange={handleChangeLogin}
                    />
                    {submitted && !username && (
                        <div className="invalid-feedback">Введите имя пользователя</div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        className={`form-control ${submitted && !password ? 'is-invalid' : ''}`}
                        name="password"
                        value={password}
                        onChange={handleChangePassword}
                    />
                    {submitted && !password && (
                        <div className="invalid-feedback">Введите пароль</div>
                    )}
                </div>
                <div className="form-group mt-3">
                    <button
                        className="btn btn-primary w-100"
                        disabled={loggingIn}
                    >
                        {loggingIn ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                        ) : null}
                        Войти
                    </button>
                </div>
            </form>
        </div>
    );
});