import Vue from 'vue';
import moment from 'moment';
import {socket} from '../socket';
import {afterNow, momentSort, timeToday} from '../util';

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
    },
    nextSchedule(state) {
      if (state.schedule.length === 0) {
        return null;
      }
      let isStart = true;
      //check today's time
      let starts = state.schedule
          .map(sleep => timeToday(sleep.start))
          .filter(afterNow)
          .sort(momentSort);
      let ends = state.schedule
          .map(sleep => timeToday(sleep.end))
          .filter(afterNow)
          .sort(momentSort);
      starts = starts.length === 0 ? null : starts[0];
      ends = ends.length === 0 ? null : ends[0];

      let next = null;
      if (starts !== null && ends !== null) {
        if (starts.isBefore(ends)) {
          next = starts;
        } else {
          isStart = false;
          next = ends;
        }
      } else if (starts !== null) {
        next = starts;
      } else if (ends !== null) {
        isStart = false;
        next = ends;
      }

      if (next === null) {
        //must be tomorrow
        let starts = state.schedule
            .map(sleep => timeToday(sleep.start).add(1, 'day'))
            .sort(momentSort);
        let ends = state.schedule
            .map(sleep => timeToday(sleep.end).add(1, 'day'))
            .sort(momentSort);
        if (starts[0].isBefore(ends[0])) {
          next = starts[0];
        } else {
          isStart = false;
          next = ends[0];
        }
      }

      return {time: next, isStart};
    },
    nextScheduleText(state, getters, rootState, rootGetters) {
      if (getters.nextSchedule === null) {
        return 'UNKNOWN';
      }
      return getters.nextSchedule.isStart ? 'Sleep' : 'Wake Up'
          + ' @ '
          + getters.nextSchedule.time.format('HH:mm')
          + ' (' + moment(rootGetters['time/now']).to(getters.nextSchedule.time) + ')';
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
