import Vue from 'vue';
import axios from 'axios';
import Dayjs from 'vue-dayjs';
import VueAxios from 'vue-axios';
import {
  BootstrapVue,
  IconsPlugin,
} from 'bootstrap-vue';
import loginError from '@/mixins/loginError';
import filters from '@/mixins/filters';
import App from './App.vue';
import router from '../../router/home';
import store from '../../store';

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.headers.common['authorization-token'] = store.state.userData.token;

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Dayjs, {});
Vue.mixin(loginError);
Vue.mixin(filters);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
