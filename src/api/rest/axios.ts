import axios from "axios";
const service = axios.create();
service.interceptors.request.use((config) => {
  config.url = `https://${config.url}`; //默认是http协议
  return config;
});
service.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error) => {
    console.log(error.message);
    console.log(error.response);
    console.log(error.request);
    if (error.response) {
      //如果有error的response,就直接返回
      return Promise.reject(error);
    } else if (error.request) {
      if (error.request.status == 0) {
        //目前只能确定路径出错的话，status会返回0,其他情况还没有发现，后面如果有其他除了路径问题的错误，也返回status==0的话，那么就把错误范围进一步缩小
        error.config.url = error.config.url.replace(/https/, "http");
        return axios(error.config); //为了防止一直重复发送请求，这里就不用service实例了，直接使用axios发送请求
      } else {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);
export default service;
