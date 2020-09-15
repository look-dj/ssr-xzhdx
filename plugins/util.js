import Vue from "vue";
let obj = {
  checkObjectIsEmpty: function(obj) {
    for (let i in obj) {
      return false;
    }
    return true;
  },
  // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
  format: function(fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  },
  arrayAsObjectFlat: function(array, str = "child") {
    return array.reduce(function(total, current) {
      if (![].isArray(current)) {
        arrayAsObjectFlat(current[str], str);
      }
      total.concat(current);
      return total;
    }, []);
  },
  getItemForStorage: function(name) {
    return localStorage.getItem(name);
  },
  getItemObj: function(name) {
    let obj = localStorage.getItem(name);
    return JSON.parse(obj);
  },
  saveItemObj: function(name, obj) {
    obj = JSON.stringify(obj);
    localStorage.setItem(name, obj);
  }
};

Vue.prototype.$u = obj;
