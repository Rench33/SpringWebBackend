import React, { useState, useEffect } from 'react';
import BackendService from '../services/BackendService';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const UserEditComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({ login: '', email: '', museums: [] });
    const [allMuseums, setAllMuseums] = useState([]);
    const [selectedMuseums, setSelectedMuseums] = useState(new Set());

    useEffect(() => {
        BackendService.retrieveAllMuseums(0, 1000)
            .then(resp => setAllMuseums(resp.data || []))
            .catch(console.error);

        if (id !== '-1') {
            BackendService.retrieveUser(id)
                .then(resp => {
                    const userData = resp.data;
                    setUser({
                        id: userData.id,
                        id: parseInt(id),
                        login: userData.login,
                        email: userData.email,
                        museums: userData.museums || []
                    });
                    setSelectedMuseums(new Set(userData.museums?.map(m => m.id)));
                })
                .catch(console.error);

        }
    }, [id]);

    const handleMuseumToggle = museumId => {
        const newSelected = new Set(selectedMuseums);
        if (newSelected.has(museumId)) {
            newSelected.delete(museumId);
        } else {
            newSelected.add(museumId);
        }
        setSelectedMuseums(newSelected);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const museumsToUpdate = Array.from(selectedMuseums).map(id => ({ id }));

        const userData = {
            ...user,
            museums: museumsToUpdate
        };

        const request = id === '-1'
            ? BackendService.createUser(userData)
            : BackendService.updateUser(userData);

        request
            .then(() => navigate('/users'))
            .catch(error => console.error('Ошибка:', error));
    };

    return (
        <div className="m-4">
            <h3>{id === '-1' ? 'Создать пользователя' : 'Редактировать пользователя'}</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Логин</Form.Label>
                    <Form.Control
                        type="text"
                        value={user.login}
                        onChange={e => setUser({ ...user, login: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={user.email}
                        onChange={e => setUser({ ...user, email: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Музеи</Form.Label>
                    <div>
                        {allMuseums.map(museum => (
                            <Form.Check
                                key={museum.id}
                                type="checkbox"
                                label={museum.name}
                                checked={selectedMuseums.has(museum.id)}
                                onChange={() => handleMuseumToggle(museum.id)}
                            />
                        ))}
                    </div>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Сохранить
                </Button>
            </Form>
        </div>
    );
};

export default UserEditComponent;