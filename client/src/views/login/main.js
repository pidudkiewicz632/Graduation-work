import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import {
  BootstrapVue,
  IconsPlugin,
} from 'bootstrap-vue';
import loginError from '@/mixins/loginError';
import router from '@/router/login';
import App from './App.vue';
import store from '../../store';

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.mixin(loginError);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
