import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import {socket, SocketStorePlugin} from './socket';
import Sleep from './sleep';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connected: false,
    lastConnected: 'unknown',
    loading: false,
    sleeps: [],
    offlineChanges: []
  },
  getters: {
    isConnected(state) {
      return state.connected;
    },
    lastConnected(state) {
      return state.lastConnected;
    },
    sleeps(state) {
      return state.sleeps
          .map(sleep => new Sleep(sleep))
          .sort((a, b) => {
            if (a.startTime.isBefore(b.startTime)) {
              return -1;
            }
            if (a.startTime.isAfter(b.startTime)) {
              return 1;
            }
            // a must be equal to b
            return 0;
          });
    },
    lastSleep(state) {
      return state.sleeps[state.sleeps.length - 1];
    },
    offlineChangesCount(state) {
      return state.offlineChanges.length;
    }
  },
  mutations: {
    setSleeps(state, sleeps) {
      state.sleeps = sleeps;
    },
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
    fakeSleep() {
      socket.emit('update-sleep', new Sleep({
        id: 1,
        start: moment().subtract(1, 'hour')
      }));
    }
  },
  plugins: [
    SocketStorePlugin
  ]
});
