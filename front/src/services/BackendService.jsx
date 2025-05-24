import axios from 'axios'
import Utils from "../utils/Utils";
import { alertActions, store, userActions } from "../utils/Rdx";
const API_URL = 'http://localhost:8081/api/v1'
const AUTH_URL = 'http://localhost:8081/auth'

class BackendService {

    showError(msg) {
        store.dispatch(alertActions.error(msg))
    }

    setupInterceptors() {
        axios.interceptors.request.use(
            config => {
                let token = Utils.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            error => {
                this.showError(error.message);
                return Promise.reject(error);
            });

        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    store.dispatch(userActions.logout());
                    window.location.href = '/login'; // Принудительный редирект
                }
                return Promise.reject(error);
            }
        );
    }

    logout() {
        const token = Utils.getUser()?.token; // Получаем токен из localStorage
        return axios.post(`${AUTH_URL}/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    login(login, password) {
        return axios.post(`${AUTH_URL}/login`, { login, password });
    }
        retrieveAllCountries(page, limit) {
                return axios.get(`${API_URL}/countries?page=${page}&limit=${limit}`);
            }

            retrieveCountry(id) {
                return axios.get(`${API_URL}/countries/${id}`);
            }

            createCountry(country) {
                return axios.post(`${API_URL}/countries`, country);
            }

            updateCountry(country) {
                return axios.put(`${API_URL}/countries/${country.id}`, country);
            }

            deleteCountries(countries) {
                return axios.post(`${API_URL}/deletecountries`, countries);
            }

            // ================ ARTISTS ================
            retrieveAllArtists(page, limit) {
                return axios.get(`${API_URL}/artists?page=${page}&limit=${limit}`);
            }

            retrieveArtist(id) {
                return axios.get(`${API_URL}/artists/${id}`);
            }

            createArtist(artist) {
                return axios.post(`${API_URL}/artists`, artist);
            }

            updateArtist(artist) {
                return axios.put(`${API_URL}/artists/${artist.id}`, artist);
            }

            deleteArtists(artists) {
                return axios.post(`${API_URL}/deleteartists`, artists);
            }

            // ================ MUSEUMS ================
            retrieveAllMuseums(page, limit) {
                return axios.get(`${API_URL}/museums?page=${page}&limit=${limit}`);
            }

            retrieveMuseum(id) {
                return axios.get(`${API_URL}/museums/${id}`);
            }

            createMuseum(museum) {
                return axios.post(`${API_URL}/museums`, museum);
            }

            updateMuseum(museum) {
                return axios.put(`${API_URL}/museums/${museum.id}`, museum);
            }

            deleteMuseums(museums) {
                return axios.post(`${API_URL}/deletemuseums`, museums);
            }
            deleteMuseum(id) {
                return axios.delete(`${API_URL}/museums/${id}`);
            }

            // ================ PAINTINGS ================
            retrieveAllPaintings(page, limit) {
                return axios.get(`${API_URL}/paintings?page=${page}&limit=${limit}`);
            }

            retrievePainting(id) {
                return axios.get(`${API_URL}/paintings/${id}`);
            }

            createPainting(painting) {
                return axios.post(`${API_URL}/paintings`, painting);
            }

            updatePainting(painting) {
                return axios.put(`${API_URL}/paintings/${painting.id}`, painting);
            }

            deletePaintings(paintings) {
                return axios.post(`${API_URL}/deletepaintings`, paintings);
            }

            // ================ USERS ================
            retrieveAllUsers(page, limit) {
                return axios.get(`${API_URL}/users?page=${page}&limit=${limit}`);
            }

            retrieveUser(id) {
                return axios.get(`${API_URL}/users/${id}`);
            }

            createUser(user) {
                return axios.post(`${API_URL}/users`, user);
            }

            updateUser(user) {
                return axios.put(`${API_URL}/users/${user.id}`, user);
            }

            deleteUsers(users) {
                return axios.post(`${API_URL}/deleteusers`, users);
            }

            // ================ MUSEUM-USER LINKS ================
            addUserMuseums(userId, museums) {
                return axios.post(`${API_URL}/users/${userId}/addmuseums`, museums);
            }

            removeUserMuseums(userId, museums) {
                return axios.post(`${API_URL}/users/${userId}/removemuseums`, museums);
            }
        }



const backendService = new BackendService();
backendService.setupInterceptors();

export default backendService;

