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
    offlineChanges: [],
    schedule: [],
    offlineScheduleChanged: false
  },
  getters: {
    isConnected(state) {
      return state.connected;
    },
    lastConnected(state) {
      return state.lastConnected;
    },
    schedule(state) {
      return state.schedule.sort((a, b) => {
        let m = moment(a.end);
        if (m.isBefore(b.end)) {
          return -1;
        }
        if (m.isAfter(b.end)) {
          return 1;
        }
        // a must be equal to b
        return 0;
      });
    },
    maxScheduleId(state) {
      let max = Math.max(...state.schedule.map(s => s.id));
      if (max !== Number.NEGATIVE_INFINITY) {
        return max;
      }
      return 0;
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
    },
    offlineScheduleChanged(state) {
      return state.offlineScheduleChanged;
    }
  },
  mutations: {
    setSchedule(state, schedule) {
      state.schedule = schedule;
    },
    addSleepToSchedule(state, sleep) {
      state.schedule.push(sleep);
    },
    editSleepInSchedule(state, sleep) {
      let index = state.schedule.findIndex(s => s.id === sleep.id);
      if (index === -1) {
        console.warn(`editSleepInSchedule: sleep with id ${sleep.id} not found`);
        return;
      }
      Vue.set(state.schedule, index, sleep);
    },
    deleteSleepInSchedule(state, id) {
      let index = state.schedule.findIndex(s => s.id === id);
      if (index === -1) {
        console.warn(`deleteSleepInSchedule: sleep with id ${id} not found`);
        return;
      }
      state.schedule.splice(index, 1);
    },
    setOfflineScheduleChanged(state, value) {
      state.offlineScheduleChanged = value;
    },
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
    sendSchedule(context) {
      socket.emit('update-schedule', context.state.schedule);
    },
    addSleepToSchedule(context, sleep) {
      sleep.id = context.getters.maxScheduleId + 1;
      context.commit('addSleepToSchedule', sleep);
      context.dispatch('sendSchedule');
    },
    editSleepInSchedule(context, sleep) {
      context.commit('editSleepInSchedule', sleep);
      context.dispatch('sendSchedule');
    },
    deleteSleepInSchedule(context, sleep) {
      context.commit('deleteSleepInSchedule', sleep);
      context.dispatch('sendSchedule');
    },
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
