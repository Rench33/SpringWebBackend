import axios from 'axios'
import Utils from "../utils/Utils";

const API_URL = 'http://localhost:8081/api/v1'
const AUTH_URL = 'http://localhost:8081/auth'

class BackendService {

    logout() {
        return axios.get(`${AUTH_URL}/logout`, { headers : {Authorization : Utils.getToken()}})
    }

    login(login, password) {
        return axios.post(`${AUTH_URL}/login`, {login, password})
    }
}

export default new BackendService()