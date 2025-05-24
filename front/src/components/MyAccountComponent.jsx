import React, {useEffect, useState} from 'react';
import BackendService from '../services/BackendService';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {connect, useDispatch} from "react-redux";
import {alertActions} from "../utils/Rdx";
import Utils from "../utils/Utils";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";

const MyAccountComponent = props => {

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {register, handleSubmit, setValue : mySetValue } = useForm();
    const [show_pwd, setShowPwd] = useState(false);
    const uid = Utils.getUser().id;


    const onSubmit = data => {
      if (!validate(data)) return;

      let user = {
        id: uid,
        login: data.login,
        email: data.email,
      };

      if (data.pwd && data.pwd === data.pwd2 && data.pwd.length >= 8) {
        user.np = data.pwd;
      }

      BackendService.updateUser(user)
        .then(response => {
          if (response.status === 200) {
            dispatch(alertActions.success("Данные успешно сохранены"));
            // можно обновить страницу, если нужно:
            //window.location.reload();
          } else {
            dispatch(alertActions.error("Ошибка обновления пользователя"));
          }
        })
        .catch(error => {
          console.error("Ошибка запроса", error);
          dispatch(alertActions.error("Ошибка обновления пользователя"));
        });


    };


    useEffect(() => {
        BackendService.retrieveUser(uid)
            .then(response => {
                    mySetValue("login", response.data.login);
                    mySetValue("email", response.data.email);
            })
            .catch(() => {
            })
    }, []);

    const onSetPasswordClick = () => {
        setShowPwd(true );
    }

    const validate = values => {
        let e = null
        if (values.pwd) {
            if (values.pwd2.length < 8)
                e = 'Длина пароля должна быть не меньше 8 символов'
            else if (!values.pwd2)
                e = 'Пожалуйста повторите ввод пароля'
            else if (values.pwd !== values.pwd2)
                e = 'Пароли не совпадают'
        }
        if (e != null) {
            dispatch(alertActions.error(e))
            return false;
        }
        return true;
    }

    return (
        <div>
            <div className="container">
                <div className="row my-2 ms-0">
                    <h3>Мой аккаунт</h3>
                    <div>
                        <button className="btn btn-outline-secondary float-end"
                                onClick={() => navigate(-1)}>
                            <FontAwesomeIcon icon={faChevronLeft}/>{' '}Назад
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="form-group mt-2">
                        <label>Логин</label>
                        <input {...register("login")} className="form-control" type="text" disabled/>
                    </fieldset>
                        <fieldset className="form-group mt-2" >
                        <label>EMail</label>
                        <input {...register("email")} className="form-control" type="text"/>
                    </fieldset>
                    {
                        show_pwd &&
                        <fieldset className="form-group mt-2">
                            <label>Введите пароль</label>
                            <input className="form-control" type="password" {...register("pwd")}/>
                        </fieldset>
                    }
                    {
                        show_pwd &&
                        <fieldset className="form-group-mt-2">
                            <label>Повторите пароль</label>
                            <input className="form-control" type="password" {...register("pwd2", {minLength: 8})}/>
                        </fieldset>
                    }
                    {
                        !show_pwd && <div>
                            <button className="btn btn-outline-secondary mt-2"
                                    onClick={(e) => { e.preventDefault(); onSetPasswordClick(); }}>
                                Изменить пароль
                            </button>

                        </div>
                    }
                    <input type="submit" className="btn btn-outline-secondary mt-2" value={"Сохранить"}/>
                </form>
            </div>
        </div>
    )
}

export default connect()(MyAccountComponent);