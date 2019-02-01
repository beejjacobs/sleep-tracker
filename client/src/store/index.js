import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import createPersistedState from 'vuex-persistedstate';
import {SocketStorePlugin} from '../socket';

import schedule from './schedule';
import sleep from './sleep';
import {time, TimePlugin} from './time';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connected: false,
    lastConnected: 'unknown',
    loading: false
  },
  getters: {
    isConnected(state) {
      return state.connected;
    },
    lastConnected(state) {
      return state.lastConnected;
    }
  },
  mutations: {
    setConnected(state, connected) {
      state.connected = connected;
    },
    updateLastConnected(state) {
      state.lastConnected = moment();
    },
    setLoading(state, loading) {
      state.loading = loading;
    }
  },
  actions: {

  },
  modules: {
    sleep,
    schedule,
    time
  },
  plugins: [
    createPersistedState({
      paths: [
        'lastConnected',
        'sleep',
        'schedule'
      ]
    }),
    SocketStorePlugin,
    TimePlugin
  ]
});
