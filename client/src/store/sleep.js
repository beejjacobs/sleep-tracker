import Vue from 'vue';
import moment from 'moment';
import {socket} from '../socket';

/**
 * @typedef {Object} SleepSection
 * @property {Number} id
 * @property {String} asleep
 * @property {String} awake
 */

/**
 * @typedef {Object} Sleep
 * @property {Number} id
 * @property {String} start
 * @property {String} end
 * @property {SleepSection[]} sections
 */

/**
 * @param {Sleep[]} sleeps
 * @param {Number} id
 * @return {Sleep|undefined}
 */
function sleepById(sleeps, id) {
  return sleeps.find(sleep => sleep.id === id);
}

/**
 *
 * @param {Sleep[]} sleeps
 *
 * @param {Number} id
 * @return {Number}
 */
function sleepIndexById(sleeps, id) {
  return sleeps.findIndex(sleep => sleep.id === id);
}

/**
 *
 * @param {Sleep} sleep
 * @param {Number} id
 * @return {Number}
 */
function sleepSectionById(sleep, id) {
  return sleep.sections.find(section => section.id === id);
}

/**
 *
 * @param {Sleep} sleep
 * @param {Number} id
 * @return {Number}
 */
function sleepSectionIndexById(sleep, id) {
  return sleep.sections.findIndex(section => section.id === id);
}

export default {
  namespaced: true,
  state: {
    sleeps: [],
    offlineChanges: []
  },
  getters: {
    sleeps(state) {
      return state.sleeps
          .sort((a, b) => {
            let aStart = moment(a.start);
            let bStart = moment(b.start);
            if (aStart.isBefore(bStart)) {
              return -1;
            }
            if (aStart.isAfter(bStart)) {
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
    maxSleepId(state) {
      let max = Math.max(...state.sleeps.map(s => s.id));
      if (max !== Number.NEGATIVE_INFINITY) {
        return max;
      }
      return 0;
    }
  },
  mutations: {
    setSleeps(state, sleeps) {
      state.sleeps = sleeps;
    },
    updateSleep(state, sleep) {
      const index = sleepIndexById(state.sleeps, sleep.id);
      if (index === -1) {
        state.sleeps.push(sleep);
      } else {
        Vue.set(state.sleeps, index, sleep);
      }
    },
    deleteSleep(state, id) {
      const index = sleepIndexById(state.sleeps, id);
      if (index === -1) {
        console.warn(`unable to find sleep with id = ${id} to delete`)
      } else {
        state.sleeps.splice(index, 1);
      }
    },
    updateSleepSection(state, {sleepId, section}) {
      const sleep = sleepById(state.sleeps, sleepId);
      const index = sleepSectionIndexById(sleep, section.id);
      if (index === -1) {
        console.log(`added section with id = ${section.id} to sleep id = ${sleepId}`);
        sleep.sections.push(section);
      } else {
        Vue.set(sleep.sections, index, section);
      }
    },
    deleteSleepSection(state, {sleepId, sectionId}) {
      const sleep = sleepById(state.sleeps, sleepId);
      const index = sleepSectionById(sleep, sectionId);
      if (index === -1) {
        console.warn(`unable to find section with id = ${sectionId} in sleep id = ${sleepId} to delete`);
      } else {
        console.log(`deleted section with id = ${sectionId} in sleep id = ${sleepId}`);
        sleep.sections.splice(index, 1);
      }
    }
  },
  actions: {
    createSleep(context) {
      let sleep = {
        id: context.getters.maxSleepId + 1,
        start: moment().format(),
        end: null,
        sections: []
      };
      context.dispatch('updateSleep', sleep);
    },
    updateSleep(context, sleep) {
      context.commit('updateSleep', sleep);
      socket.emit('update-sleep', sleep);
    },
    deleteSleep(context, id) {
      context.commit('deleteSleep', id);
      socket.emit('delete-sleep', id);
    },
    updateSleepSection(context, data) {
      context.commit('updateSleepSection', data);
      socket.emit('update-sleep-section', data);
    },
    deleteSleepSection(context, data) {
      context.commit('deleteSleepSection', data);
      socket.emit('delete-sleep-section', data);
    },
  }
}
