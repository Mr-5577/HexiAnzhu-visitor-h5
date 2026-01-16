import uniRequest from "uni-request";
import store from "@/store/index.js";
import md5 from "js-md5";

// 配置
uniRequest.defaults.baseURL = store.state.baseUrl;
uniRequest.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

// 工具函数
const showToast = (title) => {
  uni.showToast({ icon: "none", title });
};

const getQuery = (query, key) => {
  const pair = query.split("&").find((item) => item.split("=")[0] === key);
  return pair ? pair.split("=")[1] : null;
};

const sortASCII = (obj) => {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
};

const dataToString = (obj) => {
  return Object.entries(obj)
    .filter(([_, value]) => value != null && value !== "")
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
};

const generateAccessToken = (data) => {
  const sortedData = sortASCII(data);
  const dataStr = dataToString(sortedData);
  return md5(dataStr).toUpperCase();
};

// 统一错误处理
const handleResponseError = (res) => {
  if (!res || !res.data) {
    showToast("服务器响应异常");
    return false;
  }

  const { code, msg } = res.data;
  const errorHandlers = {
    0: () => showToast("统一下单失败"),
    404: () => showToast("404 服务器访问失败"),
    444: () => {
      uni.showModal({
        title: "强制下线警告",
        content: "您已在其他地方登录，若非您本人操作，请及时修改密码。",
        confirmColor: "#fe845e",
        success: () => {
          setTimeout(() => uni.reLaunch({ url: "/pages/login/login" }), 100);
        },
      });
    },
    500: () => showToast("系统异常"),
    513: () => showToast("请先缴清物业欠费"),
    1002: () => showToast("appkey不正确"),
    1004: () => showToast("access_token失效"),
    1005: () => showToast("短信验证码错误"),
    1006: () => showToast("短信发送失败"),
    1007: () => handleLoginExpired(),
    1008: () => {
      uni.showModal({
        title: "未绑定房产",
        cancelColor: "#898989",
        cancelText: "不去了",
        confirmColor: "#fe845e",
        confirmText: "去绑定",
        content: "是否前往绑定房产？",
        success: (resp) =>
        //   resp.confirm &&
        //   uni.navigateTo({ url: "/pages/reg/bound-house/bound-house" }),
      });
    },
    1009: () => handleLoginExpired(),
    1010: () => showToast("身份不匹配"),
    1011: () => showToast("已绑定该房产"),
    1012: () => {
      uni.showModal({
        title: "您存在有未支付的订单",
        cancelColor: "#898989",
        cancelText: "不去了",
        confirmColor: "#fe845e",
        confirmText: "去缴费",
        content: "是否前往订单支付？",
        success: (resp) => {
        //   const url = resp.confirm
        //     ? `/pages/user/order/order?data=${JSON.stringify(res.data)}`
        //     : null;
        //   url ? uni.redirectTo({ url }) : uni.navigateBack({ delta: 1 });
        },
      });
    },
    1013: () => showToast("参数不正确"),
    1014: () => showToast("线上缴费已关闭"),
    1015: () => showToast("limit过大"),
    1016: () => showToast("支付金额不正确"),
    1017: () => showToast("已存在该联系人"),
    1018: () => showToast("未开通支付"),
    1019: () => showToast("余额不足"),
    1020: () => showToast("请绑定手机号"),
    1021: () => showToast("当月已评价过该管理员"),
    10013: () => {
      showToast(msg);
      setTimeout(() => uni.navigateBack({ delta: 1 }), 1000);
    },
  };

  const handler = errorHandlers[code];
  if (handler) {
    handler();
    return true; // 表示已处理特殊错误
  }

  // 默认错误处理
  if (code != 1 && msg) {
    showToast(msg);
    return true;
  }

  return false; // 没有错误需要特殊处理
};

const handleLoginExpired = () => {
  store.commit("logout");
  uni.showModal({
    title: "登录失效",
    cancelColor: "#898989",
    cancelText: "不去了",
    confirmColor: "#fe845e",
    confirmText: "去登录",
    content: "是否前往登录？",
    success: (resp) =>
      resp.confirm && uni.navigateTo({ url: "/pages/login/login" }),
  });
};

// 核心请求方法
const createRequest = (url, data, method = "post") => {
  // 构建请求数据
  const requestData = { ...data };

  if (store.state.login_token) {
    requestData.login_token = store.state.login_token;

    // 自动添加房产ID
    const houseInfo = store.state.myHouse?.ownerInfo;
    if (houseInfo?.roomid && !requestData.vid) {
      requestData.vid = houseInfo.vvid;
    }
  }

  // 生成访问令牌
  const accessToken = generateAccessToken(requestData);
  const requestUrl = `${url}?access_token=${accessToken}&XDEBUG_SESSION=XDEBUG_SESSION`;

  return new Promise((resolve, reject) => {
    uniRequest[method](requestUrl, requestData)
      .then((res) => {
        // 统一隐藏loading
        setTimeout(() => uni.hideLoading(), 1500);

        // 检查并处理错误
        if (handleResponseError(res)) {
          reject(res.data);
          return;
        }

        // 成功响应：确保返回结构一致
        if (res.data && res.data.code === 1) {
          // 返回完整响应或数据部分，根据实际需要调整
          resolve({
            success: true,
            data: res.data.data || res.data, // 适配不同结构
            message: res.data.msg || "请求成功",
            rawResponse: res.data, // 保留原始响应
          });
        } else {
          // 未知的code值
          reject({
            success: false,
            message: res.data?.msg || "未知错误",
            code: res.data?.code,
            rawResponse: res.data,
          });
        }
      })
      .catch((error) => {
        setTimeout(() => uni.hideLoading(), 1500);

        // 网络错误处理
        const errorMsg = error.message || "您可能断网了，请重试！";
        showToast(errorMsg);

        reject({
          success: false,
          message: errorMsg,
          isNetworkError: true,
          rawError: error,
        });
      });
  });
};

// API导出
const requests = {
  post: (url, data) => createRequest(url, data, "post"),
  get: (url, data) => createRequest(url, data, "get"),
  // 可以继续添加put、delete等方法
};

export default requests;
