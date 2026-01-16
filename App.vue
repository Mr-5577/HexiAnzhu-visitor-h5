<script>
export default {
  onLaunch() {},
  onShow() {},
  onHide() {},
  methods: {},
};
</script>

<style>
/*每个页面公共css */
@import "./common/css/main.css";
@import "./common/css/uni.css";
@import "./common/css/icon.css";

[v-cloak] {
  display: none;
}

page {
  background: #f7f6fb;
}

.po-event-none {
  pointer-events: none;
}

.content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 20upx;
}

.input-group {
  background-color: #ffffff;
  margin-top: 40upx;
  position: relative;
}

.input-group::before {
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  height: 1upx;
  content: "";
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: #c8c7cc;
}

.input-group::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1upx;
  content: "";
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: #c8c7cc;
}

.input-row {
  display: flex;
  flex-direction: row;
  position: relative;
}

.input-row .title {
  width: 20%;
  height: 80upx;
  min-height: 80upx;
  padding: 15upx 0;
  padding-left: 30upx;
  line-height: 80upx;
}

.input-row.border::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 15upx;
  height: 1upx;
  content: "";
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: #c8c7cc;
}

.btn-row {
  margin-top: 50upx;
  padding: 20upx;
}

button.primary {
  background-color: #0faeff;
}
</style>
