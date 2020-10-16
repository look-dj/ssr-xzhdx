<template>
  <div class="box v-application-box">
    <v-navigation-drawer
      app
      :mini-variant.sync="menuState"
      v-model="drawer"
      class="drawer"
      :color="$vuetify.theme.dark ? '#121212' : '#f3f2f1'"
    >
      <v-sheet
        height="60"
        width="100%"
        :color="$vuetify.theme.dark ? '#1E1E1E' : '#f3f2f1'"
        @click="goToIndex"
        class="logo_place"
        title="雪中控制台"
      >
        <img src="/logo.png" v-if="!menuState" class="logo" height="100%" />
        <v-subheader
          class="justify-center text-uppercase"
          width="100%"
          v-if="menuState"
          >雪中</v-subheader
        >
      </v-sheet>
      <v-list class="pt-0">
        <v-list-group
          v-for="(item, idx) in menu"
          :key="idx"
          no-action
          :append-icon="item.children ? 'iconfont-expand_more' : ''"
          @click="replace(item)"
          :class="mid == item.id ? 'my-v-list-group-append-icon' : ''"
          class="my-v-list-group"
        >
          <template v-slot:activator>
            <v-list-item-icon class="my-list-item-group-icon">
              <v-icon
                :class="item.icon"
                :style="mid == item.id ? theme.co : ''"
              ></v-icon>
            </v-list-item-icon>
            <v-list-item-content class="my-v-list-group-content">
              <v-list-item-title :style="mid == item.id ? theme.co : ''">{{
                item.call
              }}</v-list-item-title>
            </v-list-item-content>
            <div
              class="my-v-list-group-box"
              :style="`backgroundColor:${
                mid == item.id ? theme.bg_p.background : ''
              };`"
            ></div>
          </template>
          <v-list-item
            v-for="(n, i) in item.children"
            :key="i"
            @click="replace(n)"
            class="pl-10"
            :data-theme="$vuetify.theme.isDark ? '#555' : theme.bg_a.background"
            v-hover
          >
            <div
              class="list_item_box"
              :style="`backgroundColor:${
                mid == n.id ? theme.bg_p.background : ''
              };color:#fff;`"
            ></div>
            <!-- <v-list-item-icon>
              <v-icon>{{n.icon}}</v-icon>
            </v-list-item-icon>-->
            <v-list-item-content class="my-v-list-item-content">
              <v-list-item-title
                class="text-left pl-12"
                :style="mid == n.id ? theme.co : ''"
                >{{ n.call }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dense text :style="theme.bg_p">
      <v-btn depressed @click="commDrawer()" :style="[theme.bg_p, theme.co]">
        <v-icon>iconfont-goodsppecategory</v-icon>
      </v-btn>
      <v-btn
        text
        class="ml-3"
        :style="[theme.bg_p, theme.co]"
        @click="goToFrame"
        >浏览首页</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn
        depressed
        title="退出"
        @click="logout"
        :style="[theme.bg_p, theme.co]"
      >
        <v-icon>iconfont-zhuxiao</v-icon>
      </v-btn>
      <v-btn
        depressed
        title="设置"
        @click="showSide('setting')"
        :style="[theme.bg_p, theme.co]"
      >
        <v-icon>iconfont-shezhi</v-icon>
      </v-btn>
      <v-btn
        depressed
        title="我的信息"
        @click="showSide('user')"
        :style="[theme.bg_p, theme.co]"
      >
        <v-icon>iconfont-yonghuming</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="v-main">
      <span v-if="temp_temp"></span>
      <v-row align="stretch" class="main_row">
        <v-col :cols="viewCols" class="view_col pa-0">
          <transition name="slide">
            <nuxt-child :key="viewKey"></nuxt-child>
          </transition>
        </v-col>
        <v-col
          v-if="sideType !== ''"
          :cols="sideCols"
          class="side_col ma-0"
          :class="$vuetify.breakpoint.xs ? 'side_col_xs' : ''"
        >
          <the-side :type="sideType" @close="closeSide"></the-side>
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import TheSide from "~/components/TheSide.vue";
export default {
  name: "index",
  data: () => ({
    temp_temp: false,
    menuState: false,
    drawer: true,
    sideType: "",
    sideCols: 0,
    viewCols: 12,
    viewKey: 0,
    listModel: 0,
  }),
  head() {
    return {
      title: "雪中控制台",
    };
  },
  async asyncData({ store, app, redirect }) {
    let user = store.state.user;
    let token = app.$cookies.get("token");
    if (!token) {
      app.$cookies.removeAll();
      redirect("/login");
      return;
    }
    let resultUser = await app.api.getUserByToken();
    store.commit("setUser", resultUser.data);
    let resultMenu = await app.api.fetchMenu({ auth: resultUser.data.auth });
    store.commit("setMenu", resultMenu.data);
    return { menu: resultMenu.data };
    // let p1 =
  },
  mounted() {
    let that = this;
    //人物 势力 关于雪中
    //主页 境界划分
    // :style="`{backgroundColor:${_theme.primary}}`"
    let drawer_content = document.querySelector(
      ".v-navigation-drawer__content"
    );
    document.querySelector('.v-navigation-drawer__border').style.display = "none";
    if (that.$vuetify.breakpoint.xs) {
      document.querySelector(".v-main__wrap").style.position = "static";
    }
    drawer_content.classList.add("drawer"); //chrome
    drawer_content.style.scrollbarWidth = "none"; //firefox
    drawer_content.style.msOverflowStyle = "none"; //edge
  },
  methods: {
    goToFrame() {
      window.location.href = window.location.origin;
      // console.log(location.origin)
    },
    goToIndex() {
      let that = this;
      that.$router.push("/");
    },
    commDrawer() {
      let that = this;
      //挡在md以上的时候that.menuState一直为true
      //在md一下的时候that.menuState为false
      if (that.$vuetify.breakpoint.smAndDown) {
        that.drawer = !that.drawer;
        return;
      }
      that.drawer = true;
      that.menuState = !that.menuState;
    },
    replace(data) {
      let that = this;
      console.log(data);
      that.viewKey++;
      that.$store.commit("setMid", data.id);
      that.$router.push({
        path: data.path,
        query: { nid: data.id },
      });
    },
    closeSide() {
      let that = this;
      let lastHerf = window.location.href.charAt(
        window.location.href.length - 1
      );
      that.$nextTick(() => {
        if (!that.$vuetify.breakpoint.xs) {
          that.sideCols = 0;
          that.viewCols = 12;
          if (lastHerf === "/") {
            that.viewKey++;
          }
        }
        that.sideType = "";
      });
    },
    showSide(type) {
      let that = this;
      let lastHerf = window.location.href.charAt(
        window.location.href.length - 1
      );
      that.$nextTick(() => {
        if (!that.$vuetify.breakpoint.xs) {
          that.sideCols = 3;
          that.viewCols = 9;
          if (lastHerf === "/") {
            that.viewKey++;
          }
        }
        that.sideType = type;
      });
    },
    logout() {
      let that = this;
      that.$toast({ msg: "确认要退出吗？" });
      that.$bus.$on("toastConfirm", function () {
        let _loading = that.$loading({ msg: "退出" });
        that.$cookies.removeAll();
        localStorage.clear();
        that.$hint({ msg: "已完成退出", type: "error" });
        setTimeout(() => {
          that.$router.push({ path: "/login" });
          _loading.close();
        }, 500);
      });
    },
  },

  computed: {
    theme() {
      let that = this;
      return that.$store.getters.getTheme;
    },
    mid() {
      let that = this;
      return that.$store.state.mid;
    },
  },
  components: {
    TheSide,
  },
  directives: {
    hover: {
      bind: (el) => {
        el.addEventListener("mouseover", function (e) {
          let _theme = e.currentTarget.dataset.theme;
          // console.log(_theme);
          el.style.backgroundColor = _theme;
        });
        el.addEventListener("mouseout", function (e) {
          el.style.backgroundColor = "transparent";
        });
      },
    },
  },
};
</script>
<style lang="scss">
.logo_place {
  cursor: pointer;
  & > img {
    height: 100%;
    display: block;
    margin: 0 auto;
    transition: all 0.3s;
  }
  &:hover {
    & > img {
      // transform: scale(1.1, 1.1);
    }
  }
}
.my-v-list-group-append-icon {
  position: relative;
  & .v-list-group__header__append-icon {
    position: relative;
    z-index: 2;
    & > i {
      color: #fff !important;
    }
  }
}
.v-navigation-drawer__border {
  display: none !important;
}
</style>
<style lang="scss" scoped>
.box {
  position: relative;
  width: 100%;
}
.logo_place {
  cursor: pointer;
  & > img {
    height: 100%;
    display: block;
    margin: 0 auto;
    transition: all 0.3s;
  }
}
.v-main {
  height: calc(100vh - 48px);
  overflow: scroll;
  overflow-x: hidden;
  margin-top: 48px;
  padding-top: 0 !important;
  position: relative;
}
.main_row {
  height: 100%;
  margin-left: 8px;
}
.side_col {
  position: relative;
}
.side_col_xs {
  position: absolute !important;
  top: 0;
  right: 0;
  height: 100%;
  width: 70%;
}
.view_col {
  padding-left: 8px;
  height: calc(100vh - 48px);
  overflow: scroll;
  overflow-x: hidden;
  background-color: #f4f6f9;
}
.f12 {
  font-size: 12px;
}
.list_child_item {
  background-color: #f3f2f1;
}
.slide-enter-active,
.slide-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-enter {
  opacity: 0;
  transform: translate3d(-40%, 0, 0);
}
.slide-leave-active {
  opacity: 0;
  transform: translate3d(20%, 0, 0);
}
.my-v-list-group {
  position: relative;
  & .v-list-group__header__append-icon {
    position: relative;
    z-index: 2;
    & > i {
      color: #fff;
    }
  }
}
.my-v-list-group-box,
.list_item_box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.my-v-list-item-content,
.my-v-list-group-content,
.my-list-item-group-icon,
.my-v-list-group-action {
  position: relative;
  z-index: 2;
}
.my-v-list-group-action {
  position: absolute;
  top: 50%;
  right: 20px;
  z-index: 2;
  transform: translateY(-50%);
  color: #fff;
  & > i {
    color: #fff;
  }
}
</style>
