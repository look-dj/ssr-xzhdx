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
      expires: {
        maxAge: 60*60*31
      },
      updateDeleteFile: false,// 更新图片后是否自动删除源文件
    },
    mutations,
    getters,
    actions
  });
};
export default createStore;
