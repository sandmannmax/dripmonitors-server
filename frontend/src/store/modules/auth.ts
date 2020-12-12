import axios from 'axios';

const state = {
  user: {
    name: undefined,
    id: undefined,
    mail: undefined,
    loggedIn: false,
    accessToken: undefined,
    refreshToken: undefined
  },
  error: undefined,
};

const getters = {
  user: (state) => state.user,
  error: (state) => state.error
};

const actions = {
  async login({ commit }, data: any) {
    let user;
    let error;
    let response = await axios.post('http://localhost/api/auth/login', {username: data.username, password: data.password}).catch(err => {
      if (err.response) {
        if (err.response.data.error.message == 'Username or Password Wrong')
          error = 'Benutzername und Passwort stimmen nicht überein';
        else {
          console.log(err.response);
          error = 'Login fehlgeschlagen';
        }
      } else {
        console.log('Unerwarteter Fehler beim erreichen der API ist aufgetreten.');
      }
    });
    if (response && response.status == 200) {
      error = '';
      user = {
        name: response.data.user.username,
        id: response.data.user._id,
        mail: response.data.user.mail,
        loggedIn: true,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      };
    }
    commit('setUser', {user, error});
  },
  async logout({ commit }, accessToken) {
    let response = await axios.post('http://localhost/api/auth/logout', {headers: {'Authorization': `Bearer ${accessToken}`}}).catch(err => {
      if (err.response) {
        console.log(err.response);
      }
    });
    let error = undefined;
    let user = {
      name: undefined,
      loggedIn: false,
      accessToken: undefined,
      refreshToken: undefined
    };
    commit('setUser', {user, error});
  },
  async refresh({ commit }, refreshToken) {
    let response = await axios.post('http://localhost/api/auth/refresh', { refreshToken }).catch(err => {
      if (err.response) {
        console.log(err.response);
      }
    });
    if (response && response.status == 200) {
      commit('setUser', {accessToken: response.data.accessToken});
    }
  },
};

const mutations = {
  setUser: (state: any, newState:any) => { 
    if (newState.user)
      state.user = newState.user;
    if (newState.error != undefined)
      state.error = newState.error;
  },
  setAccessToken: (state: any, newState:any) => { 
    if (newState.accessToken)
      state.user.accessToken = newState.accessToken;
  },
};

export default {
  state,
  getters,
  actions,
  mutations
};