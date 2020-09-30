import Vue from "vue";
import util from './util.js'
let temp = {
  $loading: () => ({
    close: () => {}
  })
};
const whiteList = ["/login", "/home", "/register"];
class Request {
  axios;
  constructor(axios) {
    this.axios = axios;
  }
  t(data = {}, obj = {}) {
    return this.fetch("/t", data, obj);
  }

  //登录
  login(data = {}, obj = {}) {
    return this.fetch("/panel/login", data, obj);
  }
  //读取站点设置
  siteGet(data = {}, obj = {}) {
    return this.fetch("/panel/site/read", data, obj);
  }
  //修改站点设置
  siteUpdate(data, obj = {}) {
    return this.fetch("/panel/site/update", data, obj);
  }
  aboutGet(data = {}, obj = {}) {
    return this.fetch("/panel/site/read", data, obj);
  }
  //修改站点设置
  aboutUpdate(data, obj = {}) {
    return this.fetch("/panel/site/update", data, obj);
  }
  //查询所有的html
  getHtmlList(data, obj = {}) {
    return this.fetch("/panel/file/getHtmlList", data, obj);
  }
  fetchRouter(data, obj = {}) {
    // console.log(data);
    return this.fetch("/panel/node/getRouter", data, obj);
  }
  fetchMenu(data, obj = {}) {
    return this.fetch("/panel/node/getMenu", data, obj);
  }
  getUserInfo(data, obj = {}) {
    return this.fetch("/panel/user/getInfo", data, obj);
  }
  getAllColumnCount(data = {}, obj = {}) {
    return this.fetch("/panel/column/columnCount", data, obj);
  }
  readPageByNid(data, obj = {}) {
    return this.fetch("/panel/page/byNid", data, obj);
  }
  getUserByToken(data = {}, obj = {}) {
    return this.fetch("/panel/getUserByToken", data, obj, "get");
  }
  async upload(data, obj = {}, deletePath = "") {
    let that = this;
    let fm = new FormData();
    fm.append("file", data);
    try {
      that.axios.setHeader("Content-Type", "multipart/form-data");
      let result = await that.axios.put("/file/upload/serve", fm);
      console.log(result)
      if (result.data.code == 200) {
        if (deletePath.length > 0) {
          try {
            let result0 = await that.deleteFile({
              path: deletePath
            });
            // obj.$hint({
            //   msg: result0.msg,
            //   type: "error",
            // });
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
  //删除上传的文件
  async deleteFile(data, obj = {}) {
    try {
      let result = await this.fetch("/file/delete", data, obj);
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  plant(url) {
    let that = this;
    url = "panel/" + url;
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
    let token = localStorage.getItem("token");
    let inWhiteList = s => whiteList.some(w => w === s);
    if (!inWhiteList(url)) {
      this.axios.setHeader("Authorization", "auth "+token);
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
Vue.prototype.Request = Request;
