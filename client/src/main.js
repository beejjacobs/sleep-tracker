import Vue from 'vue';
import './plugins/vue-moment';
import './plugins/vuetify';
import App from './App.vue';

import store from './store';

Vue.config.productionTip = false;

import Schedule from './components/Schedule';
import Status from './components/Status';
import TimeEditor from './components/TimeEditor';

Vue.component('schedule', Schedule);
Vue.component('status', Status);
Vue.component('time-editor', TimeEditor);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
