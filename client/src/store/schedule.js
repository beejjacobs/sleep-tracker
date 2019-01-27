import Vue from 'vue';
import moment from 'moment';
import {socket} from '../socket';

export default {
  namespaced: true,
  state: {
    schedule: [],
    offlineScheduleChanged: false
  },
  getters: {
    schedule(state) {
      return state.schedule.sort((a, b) => {
        let aEnd = moment.utc(a.end, 'HH:mm');
        let bEnd = moment.utc(b.end, 'HH:mm');
        if (aEnd.isBefore(bEnd)) {
          return -1;
        }
        if (aEnd.isAfter(bEnd)) {
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
    }
  }
};
