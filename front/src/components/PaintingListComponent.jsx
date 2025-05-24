import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import Alert from './Alert';
import BackendService from "../services/BackendService";
import { useNavigate } from 'react-router-dom';
import PaginationComponent from './PaginationComponent';

const PaintingListComponent = () => {
    const [message, setMessage] = useState();
    const [paintings, setPaintings] = useState([]);
    const [selectedPaintings, setSelectedPaintings] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [hidden, setHidden] = useState(false);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 2;
    const navigate = useNavigate();

    const setChecked = v => {
        setCheckedItems(Array(paintings?.length || 0).fill(v));
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

    const deletePaintingsClicked = () => {
        const ids = paintings
            .filter((_, idx) => checkedItems[idx])
            .map(painting => painting.id);

        if (ids.length > 0) {
            setMessage(`Удалить ${ids.length} картин?`);
            setSelectedPaintings(ids);
            setShowAlert(true);
        }
    };

    const refreshPaintings = (cp = 0) => {
        BackendService.retrieveAllPaintings(cp, limit)
            .then(resp => {
                setPaintings(resp.data || []);
                setTotalCount(resp.data?.length || 0);
                setPage(cp);
            })
            .catch(() => setHidden(true));
    };

    const onDelete = () => {
        BackendService.deletePaintings(selectedPaintings)
            .then(() => refreshPaintings())
            .catch(console.error)
            .finally(() => setShowAlert(false));
    };

    const updatePaintingClicked = id => {
        navigate(`/paintings/${id}`);
    };

    const addPaintingClicked = () => {
        navigate(`/paintings/-1`);
    };

    useEffect(() => refreshPaintings(), []);

    return (
        <div className="m-4">
            <div className="row my-2">
                <h3>Картины</h3>
                <div className="btn-toolbar">
                    <div className="btn-group ms-auto">
                        <button className="btn btn-outline-secondary" onClick={addPaintingClicked}>
                            <FontAwesomeIcon icon={faPlus} /> Добавить
                        </button>
                    </div>
                    <div className="btn-group ms-2">
                        <button className="btn btn-outline-secondary" onClick={deletePaintingsClicked}>
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
                    onPageChanged={cp => refreshPaintings(cp - 1)}
                />
                <table className="table table-sm">
                    <thead className="thead-light">
                        <tr>
                            <th>Название</th>
                            <th>Год</th>
                            <th>Художник</th>
                            <th>Музей</th>
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
                        {paintings.length === 0 ? (
                            <tr>
                                <td colSpan="5">Список картин пуст</td>
                            </tr>
                        ) : (
                            paintings.map((painting, index) => (
                                <tr key={painting.id}>
                                    <td>{painting.name}</td>
                                    <td>{painting.year}</td>
                                    <td>{painting.artist?.name}</td>
                                    <td>{painting.museum?.name}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group ms-auto">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => updatePaintingClicked(painting.id)}
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

export default PaintingListComponent;