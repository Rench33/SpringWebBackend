import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import Alert from './Alert';
import BackendService from "../services/BackendService";
import { useNavigate } from 'react-router-dom';
import PaginationComponent from './PaginationComponent';

const ArtistListComponent = () => {
    const [message, setMessage] = useState();
    const [artists, setArtists] = useState([]);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [hidden, setHidden] = useState(false);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 2;
    const navigate = useNavigate();

    const setChecked = v => {
        setCheckedItems(Array(artists?.length || 0).fill(v));
    };

    const handleCheckChange = e => {
        const idx = e.target.name;
        const isChecked = e.target.checked;
        let checkedCopy = [...checkedItems];
        checkedCopy[idx] = isChecked;
        setCheckedItems(checkedCopy);
    };

    const handleGroupCheckChange = e => {
        setChecked(e.target.checked);
    };

    const deleteArtistsClicked = () => {
        const ids = artists
            .filter((_, idx) => checkedItems[idx])
            .map(artist => artist.id);

        if (ids.length > 0) {
            setMessage(`Удалить ${ids.length} художников?`);
            setSelectedArtists(ids);
            setShowAlert(true);
        }
    };

    const refreshArtists = (cp = 0) => {
        BackendService.retrieveAllArtists(cp, limit)
            .then(resp => {
                setArtists(resp.data || []);
                setTotalCount(resp.data?.length || 0);
                setPage(cp);
            })
            .catch(() => setHidden(true));
    };

    const onDelete = () => {
        BackendService.deleteArtists(selectedArtists)
            .then(() => refreshArtists())
            .catch(console.error)
            .finally(() => setShowAlert(false));
    };

    const updateArtistClicked = id => {
        navigate(`/artists/${id}`);
    };

    const addArtistClicked = () => {
        navigate(`/artists/-1`);
    };

    useEffect(() => refreshArtists(), []);

    return (
        <div className="m-4">
            <div className="row my-2">
                <h3>Художники</h3>
                <div className="btn-toolbar">
                    <div className="btn-group ms-auto">
                        <button className="btn btn-outline-secondary" onClick={addArtistClicked}>
                            <FontAwesomeIcon icon={faPlus} /> Добавить
                        </button>
                    </div>
                    <div className="btn-group ms-2">
                        <button className="btn btn-outline-secondary" onClick={deleteArtistsClicked}>
                            <FontAwesomeIcon icon={faTrash} /> Удалить
                        </button>
                    </div>
                </div>
            </div>
            <div className="row my-2 me-0">
                <PaginationComponent
                    totalRecords={totalCount}
                    pageLimit={limit}
                    pageNeighbours={1}
                    onPageChanged={cp => refreshArtists(cp - 1)}
                />
                <table className="table table-sm">
                    <thead className="thead-light">
                        <tr>
                            <th>Имя</th>
                            <th>Век</th>
                            <th>Страна</th>
                            <th>
                                <div className="btn-toolbar pb-1">
                                    <div className="btn-group ms-auto">
                                        <input type="checkbox" onChange={handleGroupCheckChange} />
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {artists.length === 0 ? (
                            <tr>
                                <td colSpan="4">Список художников пуст</td>
                            </tr>
                        ) : (
                            artists.map((artist, index) => (
                                <tr key={artist.id}>
                                    <td>{artist.name}</td>
                                    <td>{artist.century}</td>
                                    <td>{artist.country?.name}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group ms-auto">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => updateArtistClicked(artist.id)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                            </div>
                                            <div className="btn-group ms-2 mt-1">
                                                <input
                                                    type="checkbox"
                                                    name={index}
                                                    checked={checkedItems.length > index ? checkedItems[index] : false}
                                                    onChange={handleCheckChange}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <Alert
                title="Удаление"
                message={message}
                ok={onDelete}
                close={() => setShowAlert(false)}
                modal={showAlert}
                cancelButton={true}
            />
        </div>
    );
};

export default ArtistListComponent;