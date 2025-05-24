class Utils {

    saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user))
    }

    removeUser() {
        localStorage.removeItem('user')
    }

   getToken() {
       const user = JSON.parse(localStorage.getItem('user'));
       return user?.token || null; // Убрать добавление "Bearer"
   }

    getUserName()
    {
        let user = JSON.parse(localStorage.getItem('user'))
        return user && user.login;
    }

    getUser()
    {
        return JSON.parse(localStorage.getItem('user'))
    }
}

export default new Utils()