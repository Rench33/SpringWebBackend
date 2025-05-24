import React, { useState, useEffect } from 'react';
import BackendService from '../services/BackendService';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const PaintingEditComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [painting, setPainting] = useState({
        name: '',
        year: '',
        artist: { id: 0 },
        museum: { id: 0 }
    });
    const [artists, setArtists] = useState([]);
    const [museums, setMuseums] = useState([]);

    useEffect(() => {
        // Загрузка художников
        BackendService.retrieveAllArtists(0, 1000)
            .then(resp => {
                // Если данные в resp.data.content (Spring Data Page)
                setArtists(resp.data || []);
            })
            .catch(error => {
                console.error("Ошибка загрузки художников:", error);
                setArtists([]);
            });

        // Загрузка музеев
        BackendService.retrieveAllMuseums(0, 1000)
            .then(resp => {
                setMuseums(resp.data || []);
            })
            .catch(error => {
                console.error("Ошибка загрузки музеев:", error);
                setMuseums([]);
            });

        if (id !== '-1') {
            BackendService.retrievePainting(id)
                .then(resp => setPainting(resp.data))
                .catch(console.error);
        }
    }, [id]);

    const handleSubmit = e => {
        e.preventDefault();
        const request = id === '-1'
            ? BackendService.createPainting(painting)
            : BackendService.updatePainting(painting);

        request
            .then(() => navigate('/paintings'))
            .catch(error => console.error('Ошибка:', error));
    };

    return (
        <div className="m-4">
            <h3>{id === '-1' ? 'Создать картину' : 'Редактировать картину'}</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                        type="text"
                        value={painting.name}
                        onChange={e => setPainting({ ...painting, name: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Год</Form.Label>
                    <Form.Control
                        type="number"
                        value={painting.year}
                        onChange={e => setPainting({ ...painting, year: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Художник</Form.Label>
                    <Form.Select
                        value={painting.artist?.id || 0}
                        onChange={e => setPainting({
                            ...painting,
                            artist: { id: parseInt(e.target.value) }
                        })}
                    >
                        <option value={0}>Выберите художника</option>
                        {artists.map(artist => (
                            <option key={artist.id} value={artist.id}>
                                {artist.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Музей</Form.Label>
                    <Form.Select
                        value={painting.museum?.id || 0}
                        onChange={e => setPainting({
                            ...painting,
                            museum: { id: parseInt(e.target.value) }
                        })}
                    >
                        <option value={0}>Выберите музей</option>
                        {museums.map(museum => (
                            <option key={museum.id} value={museum.id}>
                                {museum.name}
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

export default PaintingEditComponent;