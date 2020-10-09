import axios from "axios";

export default function({ $axios, redirect, store, $cookies }) {
  $axios.onRequest(config => {
    // console.log(config);
    // let time = parseInt(new Date().getTime()/1000);
    // let secret = 'jTJxKcGL';
    // let appId = 'guard';
    // let sign = md5(`appId=${appId}&time=${time}${secret}`);
    // let access_token = Cookies.get('session');
    // try {
    //   if(!access_token && axios.defaults.cookies.session) {
    //       access_token = axios.defaults.cookies.session;
    //   }
    // } catch (error) {

    // }
    // if(config.url.indexOf('?') > -1){
    //     config.url = `${config.url}&time=${time}&sign=${sign}&appId=${appId}`;
    // }else{
    //     config.url = `${config.url}?time=${time}&sign=${sign}&appId=${appId}`;
    // }
    // if(access_token){
    //     config.url = `${config.url}&access-token=${access_token}`;
    // }
    return config;
  });

  $axios.onResponse(response => {
    //检查相应的数据里面有token没有
    let token = response.data.token;
    if(token){ 
      $cookies.set("token", token);
    }
    let code = response.data.code;
    if(code>350){
      redirect("error");
    }
    delete response.data.token;
    return response;
  });

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    if (code === 400) {
      redirect("/400");
    }
  });
}
