import './App.css';
import React, { useState } from "react"; // Импорт React и хука useState
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import CountryListComponent from "./components/CountryListComponent";
import CountryEditComponent from './components/CountryEditComponent';
import ArtistListComponent from './components/ArtistListComponent';
import ArtistEditComponent from './components/ArtistEditComponent';
import PaintingListComponent from './components/PaintingListComponent';
import PaintingEditComponent from './components/PaintingEditComponent';
import UserListComponent from './components/UserListComponent';
import UserEditComponent from './components/UserEditComponent';
import MuseumListComponent from './components/MuseumListComponent';
import MuseumComponent from "./components/MuseumComponent";
import MyAccountComponent from "./components/MyAccountComponent";
import Home from "./components/Home";
import Login from "./components/Login";
import Utils from "./utils/Utils";
import { connect } from "react-redux";
import SideBar from "./components/SideBar";

const ProtectedRoute = ({children}) => {
    let user = Utils.getUser();
    return user ? children : <Navigate to={'/login'} />
};

const App = props => {

const [exp,setExpanded] = useState(true);
    return (
        <div className="App">
            <BrowserRouter>
                <NavigationBar toggleSideBar={() =>
                    setExpanded(!exp)}/>
                    <div className="wrapper">
                        <SideBar expanded={exp} />
                        <div className="container-fluid">
                            { props.error_message &&  <div className="alert alert-danger m-1">{props.error_message}</div>}
                            <Routes>
                                <Route path="login" element={<Login />}/>
                                <Route path="home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
                                <Route path="countries" element={<ProtectedRoute><CountryListComponent/></ProtectedRoute>}/>
                                <Route path="artist" element={<ProtectedRoute><ArtistListComponent/></ProtectedRoute>}/>
                                <Route
                                        path="countries/:id"
                                        element={<ProtectedRoute><CountryEditComponent /></ProtectedRoute>}
                                    />
                                <Route path="museums" element={<ProtectedRoute><MuseumListComponent /></ProtectedRoute>} /> {/* добавлен маршрут */}
                                <Route path="/museums/:id" element={<MuseumComponent />} />
                                <Route path="artists" element={<ProtectedRoute><ArtistListComponent /></ProtectedRoute>} />
                                <Route path="artists/:id" element={<ArtistEditComponent />} />
                                <Route path="paintings" element={<ProtectedRoute><PaintingListComponent /></ProtectedRoute>} />
                                <Route path="paintings/:id" element={<PaintingEditComponent />} />
                                <Route path="users" element={<ProtectedRoute><UserListComponent /></ProtectedRoute>} />
                                <Route path="users/:id" element={<UserEditComponent />} />
                                <Route path="/myaccount" element={<MyAccountComponent />} />
                            </Routes>
                        </div>
                    </div>
            </BrowserRouter>
        </div>
    );
}

function mapStateToProps(state) {
    const { msg } = state.alert;
    return { error_message: msg };
}

export default connect(mapStateToProps)(App);