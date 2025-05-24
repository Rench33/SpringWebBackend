import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackendService from "../services/BackendService";

const MuseumComponent = () => {
    const [museum, setMuseum] = useState({ name: "", location: "" });
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === "-1";

    useEffect(() => {
        if (!isNew) {
            BackendService.retrieveMuseum(id)
                .then(resp => setMuseum(resp.data))
                .catch(() => alert("Ошибка загрузки музея"));
        }
    }, [id]);

    const handleChange = (e) => {
        setMuseum({ ...museum, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = isNew ? BackendService.createMuseum : BackendService.updateMuseum;
        action(museum)
            .then(() => navigate("/museums"))
            .catch(() => alert("Ошибка при сохранении"));
    };

    return (
        <div className="m-4">
            <h3>{isNew ? "Добавить музей" : "Редактировать музей"}</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Название</label>
                    <input type="text" className="form-control" name="name"
                        value={museum.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Местоположение</label>
                    <input type="text" className="form-control" name="location"
                        value={museum.location} onChange={handleChange} required />
                </div>
                <button className="btn btn-success" type="submit">Сохранить</button>
            </form>
        </div>
    );
};

export default MuseumComponent;
