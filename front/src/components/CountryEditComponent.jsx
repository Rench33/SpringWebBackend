import React, { useState, useEffect } from 'react';
import BackendService from '../services/BackendService';
import { useParams, useNavigate } from 'react-router-dom';

const CountryEditComponent = () => {
    const { id } = useParams();
    const [country, setCountry] = useState({ name: '' });
    const [hidden, setHidden] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id !== '-1') {
            BackendService.retrieveCountry(id)
                .then(resp => setCountry(resp.data))
                .catch(() => setHidden(true));
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id === '-1') {
            BackendService.createCountry(country)
                .then(() => navigate('/countries'))
                .catch(() => setHidden(true));
        } else {
            BackendService.updateCountry(country)
                .then(() => navigate('/countries'))
                .catch(() => setHidden(true));
        }
    };

    if (hidden) return null;

    return (
        <div className="m-4">
            <h3>{id === '-1' ? 'Создать страну' : 'Редактировать страну'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Название</label>
                    <input
                        type="text"
                        className="form-control"
                        value={country.name}
                        onChange={(e) => setCountry({ ...country, name: e.target.value })}
                        name="name"
                        autoComplete="off"
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Сохранить
                </button>
            </form>
        </div>
    );
};

export default CountryEditComponent;