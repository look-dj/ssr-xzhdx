import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      theme: {},
      routes: [],
      menu: [],
      mid: 1,
      user: {},
    },
    mutations,
    getters,
    actions
  });
};
export default createStore;
