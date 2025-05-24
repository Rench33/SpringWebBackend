import React, { useState, useEffect } from 'react';
import BackendService from '../services/BackendService';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const ArtistEditComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artist, setArtist] = useState({
        name: '',
        century: '',
        country: { id: 0 }
    });
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        // Загрузка списка стран
        BackendService.retrieveAllCountries(0, 1000)
            .then(resp => {
                // Если данные приходят в resp.data.content (Spring Data Page)
                setCountries(resp.data || []);
            })
            .catch(console.error);

        // Загрузка данных художника, если это редактирование
        if (id !== '-1') {
            BackendService.retrieveArtist(id)
                .then(resp => {
                    const artistData = resp.data;
                    // Обновляем состояние, включая страну
                    setArtist({
                        id: artistData.id,
                        name: artistData.name,
                        century: artistData.century,
                        country: artistData.country || { id: 0 }
                    });
                })
                .catch(error => {
                    console.error("Ошибка загрузки художника:", error);
                });
        }
    }, [id]); // Зависимость от id

    const handleSubmit = e => {
        e.preventDefault();
        const request = id === '-1'
            ? BackendService.createArtist(artist)
            : BackendService.updateArtist(artist);

        request
            .then(() => navigate('/artists'))
            .catch(error => console.error('Ошибка:', error));
    };

    return (
        <div className="m-4">
            <h3>{id === '-1' ? 'Создать художника' : 'Редактировать художника'}</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                        type="text"
                        value={artist.name || ''}
                        onChange={e => setArtist({ ...artist, name: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Век</Form.Label>
                    <Form.Control
                        type="text"
                        value={artist.century || ''}
                        onChange={e => setArtist({ ...artist, century: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Страна</Form.Label>
                    <Form.Select
                        value={artist.country?.id || 0}
                        onChange={e => setArtist({
                            ...artist,
                            country: { id: parseInt(e.target.value) }
                        })}
                    >
                        <option value={0}>Выберите страну</option>
                        {countries.map(country => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Сохранить
                </Button>
            </Form>
        </div>
    );
};

export default ArtistEditComponent;