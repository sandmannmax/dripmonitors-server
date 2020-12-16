import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const refresh = async (refreshToken) => {
  let response, data, error;
  try {
    response = await axios.post('http://localhost/api/auth/refresh', { refreshToken });
    if (response && response.status == 200)
      data = response.data.accessToken;
    else
      error = { message: 'Failed loading response in getMonitor', response };
  } catch (err) {
    error = { message: 'Error refresh', err };
  }
  return { data, error };
}

const getMonitor = async accessToken => {
  let response, data, error;
  try {
    response = await axios.get('http://localhost/api/monitor', {headers: {'Authorization': `Bearer ${accessToken}`}});
    if (response && response.status == 200)
      data = response.data.monitor;
    else
      error = { message: 'Failed loading response in getMonitor', response };
  } catch (err) {
    error = { message: 'Error getMonitor', err };
  }
  return { data, error };
}

const sendTestmessage = async accessToken => {
  let response, data, error;
  try {
    response = await axios.post('http://localhost/api/monitor/testmessage', null, {headers: {'Authorization': `Bearer ${accessToken}`}});
    if (response && response.status == 200)
      data = 'Success';
    else
      error = { message: 'Failed loading response in getMonitor', response };
  } catch (err) {
    error = { message: 'Error getMonitor', err };
  }
  return { data, error };
}

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  state: {
    user: undefined,
    servicesAccess: [],
    hasMonitor: false,
    monitor: {
      monitor: undefined,
      monitoredProducts: [],
      availableProducts: []
    },
  },
  getters: {
    user: state => state.user,
    servicesAccess: state => state.servicesAccess,
    monitor: state => state.monitor,
    hasMonitor: state => state.hasMonitor,
  },
  actions: {
    async login({ commit }, { username, password }) {
      let user, error, response;
      try {
        response = await axios.post('http://localhost/api/auth/login', {username, password});
        if (response && response.status == 200) {
          user = {
            name: response.data.user.username,
            id: response.data.user._id,
            mail: response.data.user.mail,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
          };
          commit('setUser', user);
        } else
          console.log(response);
        return '';
      }
      catch (err) {
        if (err.response) {
          if (err.response.data.error.message == 'Username or Password Wrong')
            error = 'Benutzername und Passwort stimmen nicht überein';
          else {
            console.log(err.response);
            error = 'Login fehlgeschlagen';
          }
        } else {
          error = 'Unerwarteter Fehler beim erreichen der API ist aufgetreten.';
        }
        return error;
      };
    },
    async register({ commit }, { username, mail, password }) {
      let user, error, response;
      try {
        response = await axios.post('http://localhost/api/user', {username: username, mail: mail, password: password});
        if (response && response.status == 200) {
          user = {
            name: response.data.user.username,
            id: response.data.user._id,
            mail: response.data.user.mail,
            loggedIn: true,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
          };
          commit('setUser', {user});
        } else
          console.log(response);
        return '';    
      }
      catch (err) {
        if (err.response) {
          console.log(err.response);
          error = 'Registrieren fehlgeschlagen';
        } else {
          error = 'Unerwarteter Fehler beim erreichen der API ist aufgetreten.';
        }
        return error;
      };
    },
    async getServicesAccess({ commit }, { accessToken, refreshToken }) {
      let response, error;
      try {
        response = await axios.get('http://localhost/api/user/services', {headers: {'Authorization': `Bearer ${accessToken}`}});
        if (response && response.status == 200)
          commit('setServicesAccess', response.data.services);
        else
          console.log(response);
        return '';
      } catch (err) {
        if (err.response) {
          console.log(err.response);
          error = 'GetServicesAccess fehlgeschlagen';
        } else {
          error = 'Unerwarteter Fehler beim erreichen der API ist aufgetreten.';
        }
        return error;
      }
    },
    async logout({ commit }, { accessToken, refreshToken }) {
      let response;
      try {
        response = await axios.post('http://localhost/api/auth/logout', null, {headers: {'Authorization': `Bearer ${accessToken}`}});
        if (response && response.status == 200) {
          commit('setUser', undefined);
          commit('setServicesAccess', []);
        } else
          console.log(response);
        return '';
      } catch (err) {
        if (err.response) {
          console.log(err.response);
          let r = await refresh(refreshToken);
          if (r.data) {
            accessToken = r.data;
            commit('setAccessToken', accessToken);
            response = await axios.post('http://localhost/api/auth/logout', null, {headers: {'Authorization': `Bearer ${accessToken}`}})
            if (response && response.status == 200) {
              commit('setUser', undefined);
              commit('setServicesAccess', []);
              return '';
            } else
              console.log(response);
            return 'Fehler';
          } else
            return 'Refresh not working';
        }
      }
    },
    async getServices({ commit }) {
      let response, error;
      try {
        response = await axios.get('http://localhost/api/services');
        if (response && response.status == 200)
          commit('setServices', response.data.services);
        else
          console.log(response);
        return '';
      } catch (err) {
        if (err.response) {
          console.log(err.response);
          error = 'GetServices fehlgeschlagen';
        } else {
          error = 'Unerwarteter Fehler beim erreichen der API ist aufgetreten.';
        }
        return error;
      }
    },
    async buyService({ commit }, { serviceId, serviceAccessKey, accessToken, refreshToken }) {
      let error, response;
      try {
        response = await axios.post(`http://localhost/api/services/${serviceId}/buy`, {serviceAccessKey}, {headers: {'Authorization': `Bearer ${accessToken}`}});
        if (response && response.status == 200) {
          commit('setAccessToken', response.data.accessToken);
        } else
          console.log(response);
        return '';
      }
      catch (err) {
        if (err.response) {
          if (err.response.data.message === '\'serviceAccessKey\' is invalid or already used')
            error = 'Access-Key ist ungültig oder schon verwendet.';
          else {
            console.log(err.response);
            error = 'Kauf fehlgeschlagen';
          }
        } else {
          error = 'Unerwarteter Fehler beim erreichen der API ist aufgetreten.';
        }
        return error;
      };
    },
    async getMonitor({ commit }, { accessToken, refreshToken }) {
      let response = await getMonitor(accessToken);
      if (response.data) {
        commit('setMonitorObject', response.data);
        return '';
      } else if (response.error) {
        if (response.error.err.response.data.message === 'Token Expired') {
          let responseRefresh = await refresh(refreshToken);
          if (responseRefresh.data) {
            commit('setAccessToken', responseRefresh.data);
            response = await getMonitor(accessToken);
            if (response.data) {
              commit('setMonitorObject', response.data);
              return '';
            } else if (response.error) {
              console.log(response.error);
            } else {
              console.log('Unbekannter Fehler in getMonitor');
              return 'Fehler';
            }
          } else if (responseRefresh.error) {
            console.log(response.error);
            return 'Fehler';
          } else {
            console.log('Unbekannter Fehler in getMonitor-Refresh');
            return 'Fehler';
          }
        } else {
          console.log(response.error);
          return 'Fehler';
        }
      } else {
        console.log('Unbekannter Fehler in getMonitor');
        return 'Fehler';
      }
    },
    async getMonitoredProducts({ commit }, { accessToken, refreshToken }) {
      let response, error;
      try {
        response = await axios.get('http://localhost/api/monitor/items', {headers: {'Authorization': `Bearer ${accessToken}`}});
        if (response && response.status == 200)
          commit('setMonitoredProducts', response.data.items);
        else
          console.log(response);
        return '';
      } catch (err) {
        if (err.response) {
          console.log(err.response);
          error = 'GetMonitoredProducts fehlgeschlagen';
        } else {
          error = 'Unerwarteter Fehler beim erreichen der API ist aufgetreten.';
        }
        return error;
      }
    },
    async getAvailableProducts({ commit }, { accessToken, refreshToken }) {
      let response, error;
      try {
        response = await axios.get('http://localhost/api/monitor/products', {headers: {'Authorization': `Bearer ${accessToken}`}});
        if (response && response.status == 200)
          commit('setAvailableProducts', response.data.products);
        else
          console.log(response);
        return '';
      } catch (err) {
        if (err.response) {
          console.log(err.response);
          error = 'GetAvailableProducts fehlgeschlagen';
        } else {
          error = 'Unerwarteter Fehler beim erreichen der API ist aufgetreten.';
        }
        return error;
      }
    },
    async sendTestmessage({ commit }, { accessToken, refreshToken }) {
      let { data, error } = await sendTestmessage(accessToken);
      if (data) {
        return '';
      } else if (error) {
        console.log(error);
      } else {
        console.log('Unbekannter Fehler in sendTestmessage');
        return 'Fehler';
      }
    },
    async addMonitoredProduct({ commit }, { productId, price, site, accessToken, refreshToken }) {
      let response, error;
      try {
        response = await axios.post('http://localhost/api/monitor/items', {price, productId, site}, {headers: {'Authorization': `Bearer ${accessToken}`}});
        if (response && response.status == 200)
          commit('addMonitoredProduct', response.data.item);
        else
          console.log(response);
        return '';
      } catch (err) {
        if (err.response) {
          console.log(err.response);
          error = 'AddMonitoredProducts fehlgeschlagen';
        } else {
          error = 'Unerwarteter Fehler beim erreichen der API ist aufgetreten.';
        }
        return error;
      }
    },
  },  
  mutations: {
    setUser: (state: any, user) => { 
      state.user = user;
    },
    setServicesAccess: (state: any, servicesAccess) => {
      state.servicesAccess = servicesAccess;
      let hasM = false;
      for (let i = 0; i < state.servicesAccess.length; i++){
        if (state.servicesAccess[i] === 'monitor')
          hasM = true;
      }
      state.hasMonitor = hasM;
    },
    setAccessToken: (state: any, accessToken) => { 
      state.user.accessToken = accessToken;
    },
    setMonitorObject: (state: any, monitor) => {
      state.monitor.monitor = monitor;
    },
    setMonitoredProducts: (state: any, monitoredProducts) => {
      state.monitor.monitoredProducts = monitoredProducts;
    },
    addMonitoredProduct: (state: any, product) => {
      state.monitor.monitoredProducts = [
        ...state.monitor.monitoredProducts,
        product
      ];
    },
    setAvailableProducts: (state: any, availableProducts) => {
      state.monitor.availableProducts = availableProducts;
    },
  }
});