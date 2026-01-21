<template>
  <view class="test-page">
    <text>测试页面</text>
    <button @click="testClick">测试按钮</button>
  </view>
</template>

<script>
export default {
  methods: {
    testClick() {
      uni.showToast({
        title: '测试成功',
        icon: 'success'
      });
    }
  }
}
</script>

<style>
.test-page {
  padding: 40rpx;
}
</style>