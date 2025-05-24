import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BackendService from '../services/BackendService';  // Добавить импорт BackendService
import Utils from "../utils/Utils";
import {connect} from 'react-redux';
import { userActions } from '../utils/Rdx';

class NavigationBarClass extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.goHome = this.goHome.bind(this); // Привязка метода goHome
    }

    logout() {
        BackendService.logout()
            .then(() => {
                Utils.removeUser();
                this.props.dispatch(userActions.logout());
                this.props.navigate('/login');
            })
            .catch(err => {
                // Принудительно очищаем данные даже при ошибке
                Utils.removeUser();
                this.props.dispatch(userActions.logout());
                this.props.navigate('/login');
            });
    }

    goHome() {
        this.props.navigate('/home');  // Используем navigate для перехода на домашнюю страницу
    }

    render() {
        return (
            <Navbar bg="light" expand="lg" className="px-3">
                <div className="d-flex align-items-center me-3">
                    <button
                        type="button"
                        className="btn btn-outline-secondary me-2"
                        onClick={this.props.toggleSideBar}
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <Navbar.Brand className="mb-0 h1">myRPO</Navbar.Brand>
                </div>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/home">Home</Nav.Link>
                        <Nav.Link onClick={this.goHome}>Another home</Nav.Link>
                        <Nav.Link onClick={() => { this.props.navigate("/Home") }}>Yet another home</Nav.Link>
                    </Nav>

                    <div className="d-flex align-items-center">
                        <Navbar.Text className="me-3">
                            <Link to="/myaccount" className="text-decoration-none text-dark">
                                <FontAwesomeIcon icon={faUser} className="me-1" />
                                {this.props.user?.login}
                            </Link>
                        </Navbar.Text>

                        {this.props.user ? (
                            <Nav.Link onClick={this.logout}>
                                <FontAwesomeIcon icon={faUser} fixedWidth /> Выход
                            </Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to="/login">
                                <FontAwesomeIcon icon={faUser} fixedWidth /> Вход
                            </Nav.Link>
                        )}
                    </div>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}


const mapStateToProps = (state) => {
    const { user } = state.authentication;
    return { user };
};

const NavigationBarWithRouter = (props) => {
    const navigate = useNavigate();
    return <NavigationBarClass navigate={navigate} {...props} />;
};

export default connect(mapStateToProps)(NavigationBarWithRouter);
