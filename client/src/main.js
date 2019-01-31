import Vue from 'vue';
import './plugins/vue-moment';
import './plugins/vuetify';
import App from './App.vue';

import store from './store';

Vue.config.productionTip = false;

import AddSleep from './components/AddSleep';
import DateEditor from './components/DateEditor';
import LastSleep from './components/LastSleep';
import NextSchedule from './components/NextSchedule';
import Schedule from './components/Schedule';
import ScheduleRow from './components/ScheduleRow';
import SleepSectionRow from './components/SleepSectionRow';
import StartSleep from './components/StartSleep';
import Status from './components/Status';
import TimeEditor from './components/TimeEditor';

Vue.component('add-sleep', AddSleep);
Vue.component('date-editor', DateEditor);
Vue.component('last-sleep', LastSleep);
Vue.component('next-schedule', NextSchedule);
Vue.component('schedule', Schedule);
Vue.component('schedule-row', ScheduleRow);
Vue.component('sleep-section-row', SleepSectionRow);
Vue.component('start-sleep', StartSleep);
Vue.component('status', Status);
Vue.component('time-editor', TimeEditor);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
