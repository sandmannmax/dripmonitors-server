import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const requestBetaAccess = async ({ email }) => {
  let response, data, error;
  try {
    response = await axios.post('http://localhost/api/monitor/betaaccess', { email });
    if (response && response.status == 200)
      data = response.data.message;
    else
      error = { message: 'Failed response requesting Beta-Access', response };
  } catch (err) {
    error = { message: 'Error requestBetaAccess', err };
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
    betaRequestSent: false,
  },
  getters: {
    betaRequestSent: state => state.betaRequestSent,
  },
  actions: {
    async requestBetaAccess({ commit }, { email }) {
      let response = await requestBetaAccess({ email });
      if (response.data) {
        commit('setBetaRequestSent');
        return '';
      } else if (response.error) {
        console.log(response.error);
        return response.error.err.message;
      } else {
        console.log('Unknown Error in requestBetaAccess');
        return 'Unknown Error';
      }
    },
  },  
  mutations: {
    setBetaRequestSent: (state: any) => { 
      state.betaRequestSent = true;
    },
  }
});