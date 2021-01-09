import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { createProvider } from './vue-apollo';
import VueCookies from 'vue-cookies';

Vue.config.productionTip = false;

Vue.use(VueCookies);

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount('#app');
