import Vue from 'vue';
import './plugins/vue-moment';
import './plugins/vuetify';
import App from './App.vue';

import store from './store';

Vue.config.productionTip = false;

import Status from './components/Status';

Vue.component('status', Status);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
