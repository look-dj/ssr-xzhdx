import _static from "~/script/static";
export default {
  changeTheme(state, theme) {
    if (typeof theme === "object") {
      state.theme = theme;
    } else {
      state.theme = _static.theme[theme];
    }
  },
  getRouter(state, router) {
    state.router = router;
    saveItemObj("router", router);
  },
  setMenu(state, menu) {
    state.menu = menu;
  },
  setMid(state, mid) {
    state.mid = mid;
  },
  setUser(state, user){
    state.user = user;
  }
};
