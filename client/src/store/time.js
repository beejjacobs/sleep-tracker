import moment from 'moment';

const state = {
  now: moment().format()
};

const getters = {
  now(state) {
    return state.now;
  }
};

const mutations = {
  updateNow(state, now) {
    state.now = now;
  }
};

const actions = {

};

export const time = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export const TimePlugin = store => {
  setInterval(() => {
    store.commit('time/updateNow', moment().format());
  }, 5000);
};

