import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "@babel/polyfill";
import "@/styles/styles.css";
import * as VueGoogleMaps from "vue2-google-maps";
import VueSocialSharing from "vue-social-sharing";

Vue.config.productionTip = false;
Vue.use(VueSocialSharing);
Vue.use(VueGoogleMaps, {
  load: {
    libraries: ["places", "geometry"],
    key: "AIzaSyCdp8yLy97PDi8mwZLGZ262erZu5dY3AYs",
  },
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
