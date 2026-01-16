import uniRequest from "./request.js";

const apis = {
  // 测试接口
  test: () => uniRequest.post("/api/test"),
  // 获取openid
  getUserOpenid: (data) => uniRequest.post("/api/get_user_openid", data),
  // 小程序登录
  loginXcx: (data) => uniRequest.post("/api/login_xcx", data),
  // code 静默登录
  loginByOpenidXcx: (data) => uniRequest.post("/api/login_by_openid_xcx", data),
  // 自动绑定房产信息
  autoBind: (data) => uniRequest.post("/api/autoBind", data),
};

export default apis;
