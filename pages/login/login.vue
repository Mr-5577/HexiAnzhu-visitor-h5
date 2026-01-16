<template>
  <view class="content">
    <!-- 背景图片 -->
    <image
      v-show="showBgImage"
      class="page-bg"
      src="/static/images/login-bg.jpg"
      mode="aspectFill"
    />

    <image src="/static/images/logo-login.png" class="logo-icon" />
    <view class="btn-wrapper">
      <view class="forget-btn">
        <button
          class="wx-btn"
          type="primary"
          @click="handleLogin"
          v-show="!checkedRadio"
        >
          <span class="text">一键登录</span>
        </button>
        <button
          class="wx-btn"
          type="primary"
          :disabled="!allowLogin"
          open-type="getPhoneNumber"
          @getphonenumber="getphonenumber"
          v-show="checkedRadio"
        >
          <span class="text">一键登录</span>
        </button>
        <text class="login-text">ONE-CLICK LOGIN</text>
        <view class="radio-privacy">
          <checkbox
            :checked="checkedRadio"
            color="#ff9f6f"
            style="transform: scale(0.6)"
            @tap="testCheckboxClick"
          />
          <text class="privacy-text" @click="toUserAgreement"
            >查看《和喜物业小程序隐私保护指引》</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mInput from "@/components/m-input.vue";

export default {
  components: {
    mInput,
  },
  data() {
    return {
      providerList: [],
      hasProvider: false,
      tel: "",
      code: "",
      positionTop: 0,
      globalData: {},
      userInfo: {},
      show: true,
      imei: "", //设备唯一标识
      timestamp: "",
      count: 0,
      m_cid: "",
      allowLogin: true,
      checkedRadio: false,
      showBgImage: false,
    };
  },
  async onLoad() {
    // this.allowLogin = false;
    let _this = this;
    this.timestamp = new Date().getTime();
    // #ifdef MP-WEIXIN
    _this.imei = "121243434234231";

    // #endif
    // #ifdef APP-PLUS
    this.m_cid = plus.push.getClientInfo().clientid;
    plus.device.getOAID({
      success(e) {
        _this.imei = e.oaid;
      },
      fail(e) {},
    });
    // #endif
  },
  methods: {
    // 去用户协议
    toUserAgreement() {
      this.$Router.push({
        name: "user-agreement",
      });
    },
    testCheckboxClick() {
      this.checkedRadio = !this.checkedRadio;
    },
    handleLogin() {
      // 判断是否选中隐私协议
      if (!this.checkedRadio) {
        uni.showToast({
          title: "请先阅读并同意隐私协议",
          icon: "none",
        });
        return;
      }
    },
    //获取手机号
    async getphonenumber(e) {
      // console.log('getphonenumber事件：',e)
      if (!this.allowLogin) return;
      // 拒绝获取用户信息
      if (e.detail.errMsg === "getPhoneNumber:fail user deny") return;
      this.allowLogin = false;
      let _this = this;
      const codeRes = await uni.login();
      const code = codeRes[1].code;
      const userOpenIdInfo = await this.$api.getUserOpenid({ code: code });
      if (userOpenIdInfo.code === 1) {
        let data = {
          code: e.detail.code,
          cache_name: userOpenIdInfo.data,
        };
        const resLogin = await _this.$api.login_xcx(data);
        if (resLogin.code === 1) {
          try {
            _this.$store.commit("loginToken", resLogin.data);
            uni.setStorageSync("loginToken", resLogin.data);
          } catch (e) {
            //TODO handle the exception
          }
          uni.showLoading({
            title: "正在登录",
          });
          // 自动绑定用户的房产信息
          if (resLogin.data.tel) {
            _this.$api.autoBind({
              tel: resLogin.data.tel,
            });
          }
          setTimeout(() => {
            uni.hideLoading();
            let pages = getCurrentPages();
            if (pages[pages.length - 2]) {
              uni.navigateBack();
            } else {
              if (_this.$store.state.hasLogin) {
                _this.$Router.replaceAll({
                  name: "index",
                });
              }
            }
            _this.allowLogin = true;
          }, 1000);
        }
      }
    },
    // 获取服务供应商数据
    initProvider() {
      const filters = ["weixin"];
      uni.getProvider({
        service: "oauth",
        success: (res) => {
          if (res.provider && res.provider.length) {
            for (let i = 0; i < res.provider.length; i++) {
              if (~filters.indexOf(res.provider[i])) {
                if (res.provider[i] === "weixin") {
                  this.providerList.push({
                    value: res.provider[i],
                    image: "/static/img/" + res.provider[i] + ".png",
                  });
                }
              }
            }
            this.hasProvider = true;
          }
        },
        fail: (err) => {
          console.error("获取服务供应商失败：" + JSON.stringify(err));
        },
      });
    },

    initPosition() {
      /**
       * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
       * 反向使用 top 进行定位，可以避免此问题。
       */
      this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
    },
  },
  onHide() {
    this.showBgImage = false;
  },
  onShow() {
    this.showBgImage = true;
  },
  onReady() {
    // #ifdef APP-PLUS
    this.initPosition();
    this.initProvider();
    // #endif
  },
};
</script>

<style>
.content {
  padding: 0 24upx;
  /* display: flex;
		justify-content: center;
		align-items: center; */
  position: relative;
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

.logo-icon {
  width: 160upx;
  height: 46upx;
  position: absolute;
  top: 110upx;
  left: 20upx;
  z-index: 99;
}

.page-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
  /* 放在最底层 */
}

.wx-btn {
  border-radius: 44upx;
  height: 84upx;
  line-height: 84upx;
  background-color: #fe8a62 !important;
  width: 65%;
}

.wx-btn i {
  height: 80upx;
  line-height: 80upx;
}

.forget-btn {
  padding: 10upx 20upx;
  /* margin-bottom: 30upx; */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-text {
  font-size: 30upx;
  color: #f8a28a;
}

.radio-privacy {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.privacy-text {
  font-size: 22upx;
  color: #474444;
}
.btn-wrapper {
  width: 100%;
  z-index: 99;
  position: absolute;
  top: 38%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.text {
  padding-left: 10upx;
  font-size: 36upx;
  display: inline-block;
  vertical-align: top;
  line-height: 84upx;
  color: #fefefe;
  font-weight: 600;
}
</style>
