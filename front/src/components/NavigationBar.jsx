import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BackendService from '../services/BackendService';  // Добавить импорт BackendService
import Utils from "../utils/Utils";

class NavigationBarClass extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.goHome = this.goHome.bind(this); // Привязка метода goHome
    }

    logout() {
        BackendService.logout().then(() => {
            Utils.removeUser();
            this.goHome();  // Переход на главную страницу
        });
    }

    goHome() {
        this.props.navigate('/home');  // Используем navigate для перехода на домашнюю страницу
    }

    render() {
        let uname = Utils.getUserName();
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand><FontAwesomeIcon icon={faHome} />{' '}My RPO</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/home">Home</Nav.Link>
                        <Nav.Link onClick={this.goHome}>Another Home</Nav.Link>
                        <Nav.Link onClick={() => this.props.navigate('/home')}>Yet Another Home</Nav.Link> {/* Исправлен путь */}
                    </Nav>
                    <Navbar.Text>{uname}</Navbar.Text>
                    { uname &&
                        <Nav.Link onClick={this.logout}><FontAwesomeIcon icon={faUser} fixedWidth />{' '}Выход</Nav.Link>
                    }
                    { !uname &&
                        <Nav.Link as={Link} to="/login"><FontAwesomeIcon icon={faUser} fixedWidth />{' '}Вход</Nav.Link>
                    }
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

const NavigationBar = props => {
    const navigate = useNavigate();

    return <NavigationBarClass navigate={navigate} {...props} />;
}

export default NavigationBar;
