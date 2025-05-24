import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import Alert from './Alert';
import BackendService from "../services/BackendService";
import { useNavigate } from 'react-router-dom';
import PaginationComponent from './PaginationComponent';

const UserListComponent = () => {
    const [message, setMessage] = useState();
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [hidden, setHidden] = useState(false);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 2;
    const navigate = useNavigate();

    const setChecked = v => {
        setCheckedItems(Array(users?.length || 0).fill(v));
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

    const deleteUsersClicked = () => {
        const ids = users
            .filter((_, idx) => checkedItems[idx])
            .map(user => user.id);
        if (ids.length > 0) {
            setMessage(`Удалить ${ids.length} пользователей?`);
            setSelectedUsers(ids);
            setShowAlert(true);
        }
    };

    const refreshUsers = (cp = 0) => {
        BackendService.retrieveAllUsers(cp, limit)
            .then(resp => {
                setUsers(resp.data || []);
                setTotalCount(resp.data?.length || 0);
                setPage(cp);
            })
            .catch(() => setHidden(true));
    };

    const onDelete = () => {
        BackendService.deleteUsers(selectedUsers)
            .then(() => refreshUsers())
            .catch(console.error)
            .finally(() => setShowAlert(false));
    };

    const updateUserClicked = id => {
        navigate(`/users/${id}`);
    };

    const addUserClicked = () => {
        navigate(`/users/-1`);
    };

    useEffect(() => refreshUsers(), []);

    return (
        <div className="m-4">
            <div className="row my-2">
                <h3>Пользователи</h3>
                <div className="btn-toolbar">
                    <div className="btn-group ms-auto">
                        <button className="btn btn-outline-secondary" onClick={addUserClicked}>
                            <FontAwesomeIcon icon={faPlus} /> Добавить
                        </button>
                    </div>
                    <div className="btn-group ms-2">
                        <button className="btn btn-outline-secondary" onClick={deleteUsersClicked}>
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
                    onPageChanged={cp => refreshUsers(cp - 1)}
                />
                <table className="table table-sm">
                    <thead className="thead-light">
                        <tr>
                            <th>Логин</th>
                            <th>Email</th>
                            <th>Музеи</th>
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
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="4">Список пользователей пуст</td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{user.login}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.museums?.map(m => m.name).join(', ')}
                                    </td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group ms-auto">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => updateUserClicked(user.id)}
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

export default UserListComponent;