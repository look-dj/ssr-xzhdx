import Vue from "vue";
import util from "./util.js";
let temp = {
  $loading: () => ({
    close: () => {}
  })
};
const whiteList = ["/login", "/home", "/register"];
class Request {
  axios;
  cookie;
  constructor(_app) {
    this.axios = _app.$axios;
    this.cookies = _app.$cookies;
  }
  t(data = {}, obj = {}) {
    return this.fetch("/t", data, obj);
  }

  //登录
  login(data = {}, obj = {}) {
    return this.fetch("/login", data, obj);
  }
  //读取站点设置
  siteGet(data = {}, obj = {}) {
    return this.fetch("/site/read", data, obj);
  }
  //修改站点设置
  siteUpdate(data, obj = {}) {
    return this.fetch("/site/update", data, obj);
  }
  aboutGet(data = {}, obj = {}) {
    return this.fetch("/site/read", data, obj);
  }
  //修改站点设置
  aboutUpdate(data, obj = {}) {
    return this.fetch("/site/update", data, obj);
  }
  //查询所有的html
  getHtmlList(data, obj = {}) {
    return this.fetch("/file/getHtmlList", data, obj);
  }
  fetchRouter(data, obj = {}) {
    // console.log(data);
    return this.fetch("/node/getRouter", data, obj);
  }
  fetchMenu(data, obj = {}) {
    return this.fetch("/node/getMenu", data, obj);
  }
  getUserInfo(data, obj = {}) {
    return this.fetch("/user/getInfo", data, obj);
  }
  getAllColumnCount(data = {}, obj = {}) {
    return this.fetch("/column/columnCount", data, obj);
  }
  readPageByNid(data, obj = {}) {
    return this.fetch("/page/byNid", data, obj);
  }
  getUserByToken(data = {}, obj = {}) {
    return this.fetch("/getUserByToken", data, obj, "get");
  }
  getNodeById(data = {}, obj = {}) {
    return this.fetch("/node/read", data, obj);
  }
  async upload(data, obj = {}, deletePath = "") {
    let that = this;
    let fm = new FormData();
    fm.append("file", data);
    try {
      that.axios.setHeader("Content-Type", "multipart/form-data");
      let result = await that.axios.post(
        "http://localhost:9018/upload/image",
        fm
      );
      console.log(result);
      if (result.data.code == 200) {
        if (deletePath.length > 0) {
          try {
            let result0 = await that.axios.post(
              "http://localhost:9018/delete/image",
              { name: deletePath }
            );
          } catch (e) {
            console.error(e, "删除" + deletePath + "失败");
          }
        }
        return result.data;
      } else {
        console.error("上传图片失败");
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  async deleteFile(name) {
    try {
      let result = await that.axios.post("http://localhost:9018/delete/image", { name });
      return result;
    } catch (e) {
      console.error(e, "删除" + deletePath + "失败");
    }
  }
  plant(url) {
    let that = this;
    // url = "panel/" + url;
    return {
      queryAll(data = {}, obj = {}) {
        return that.fetch(url + "/queryAll", data, obj);
      },
      read(data, obj = {}) {
        return that.fetch(url + "/read", data, obj);
      },
      add(data, obj = {}) {
        return that.fetch(url + "/add", data, obj);
      },
      delete(data, obj = {}) {
        return that.fetch(url + "/delete", data, obj);
      },
      update(data, obj = {}) {
        return that.fetch(url + "/update", data, obj);
      }
    };
  }
  fetch(
    url,
    data,
    obj,
    method = "post",
    head = {
      name: "Content-Type",
      header: "application/json;charset=UTF-8"
    }
  ) {
    if (util.checkObjectIsEmpty(obj)) obj = temp;
    let o = obj.$loading();
    this.axios.setHeader(head.name, head.header);
    let token = this.cookies.get("token");
    let inWhiteList = s => whiteList.some(w => w === s);
    if (token && !inWhiteList(url)) {
      this.axios.setHeader("Authorization", "auth " + token);
    }
    return new Promise((resolve, reject) => {
      this.axios["$" + method](url, data).then(
        res => {
          resolve(res);
          o.close();
        },
        err => {
          reject(err);
          o.close();
        }
      );
    });
  }
}
export default ({ app }) => {
  app.api = new Request(app);
};
Vue.prototype.Request = Request;
