import Vue from "vue";
import Vuex from "vuex";
import data_melp from "../json/data_melp.json";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    restaurants: [],
  },
  getters: {
    drawer: (state) => state.drawer,
    restaurants: (state) => state.restaurants,
  },
  mutations: {
    ["SET_RESTAURANTS"]: (state, payload) => {
      state.restaurants = payload;
    },
  },
  actions: {
    async init({ commit }) {
      commit("SET_RESTAURANTS", data_melp);
    },
  },
  modules: {},
});
