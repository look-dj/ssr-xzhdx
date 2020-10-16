<template>
  <v-app>
    <div class="temp00090" v-if="isRouterAlive">
      <nuxt />
    </div>
  </v-app>
</template>


<script>
import Vue from "vue";
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
      getSonColumn: this.getSonColumn,
    };
  },
  data: () => ({
    isRouterAlive: true,
  }),
  created() {
    Vue.prototype.api = new this.Request(this);
    Vue.prototype.$xs = this.$vuetify.breakpoint.xs;
  },
  async mounted() {
    // this.$vue._theme.primary = "#222";
    //做一个进入时的验证
    let that = this;
    // that.getInfo();
    //修改主题
    let default_theme = that.$u.getItemForStorage("theme")
      ? that.$u.getItemForStorage("theme")
      : "light";
    if (default_theme === "dark") {
      that.$store.commit("changeTheme", {
        primary: "#121212",
        assist: "#fff",
        color: "#fff",
      });
      that.$vuetify.theme.dark = true;
    } else that.$store.commit("changeTheme", default_theme);
    // 拿到window窗口地址
    let nid = that.$route.query.nid;
    nid = nid ? nid : 1;
    that.$store.commit("setMid", nid);
    // TODO 后期在处理路由nid加密的时候需要在这里经行解密
  },
  watch: {
    $route(to, from) {
      console.log(`从  ${from.path}  =>   ${to.path}  `);
    },
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
    getSonColumn(id) {
      let that = this;
      let _node = that.$u.getItemObj("router")[0].children;
      _node = _node.filter((_) => _.cid == id);
      return _node;
    },
    async getInfo() {
      let that = this;
      let token = that.$cookies.get("token");
      if (!token) {
        localStorage.clear();
        that.$router.push("/login");
        that.$cookies.removeAll();
        return;
      }
      try {
        let result = await that.api.getUserByToken();
        that.$store.commit("setUser", result.data);
      } catch (e) {
        console.log(e);
        that.$hint({ msg: "错误->" + e, type: "error" });
      }
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  background-color: #f4f6f9;
}
.v-navigation-drawer__content::-webkit-scrollbar {
  display: none !important;
}
.v-main > .v-main__wrap {
  height: 100%;
}
html {
  overflow-x: hidden;
}
::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
::-webkit-scrollbar-corner {
  background: #f8f8f8;
}
::-webkit-scrollbar-button {
  // background-color: #222;
}
::-webkit-scrollbar-thumb {
  border-radius: 9px;
  border: solid 6px #c8c6c4;
  background-clip: content-box;
  cursor: pointer;
  &:hover {
    background-color: #98a3a6;
  }
}
::-webkit-scrollbar-track {
  background-color: #fff;
}
.my-blue {
  background-color: #0094ff !important;
  color: #fff !important;
}
</style>
