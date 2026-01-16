<template>
	<view  v-if="showMask">
		<view class="li-mask">{{ test }}</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			test: '正在上传数据...',
			showMask:false
		};
	},
	
	methods: {
		show(){
			setTimeout(() => {
				this.showMask = true;
			}, 100);
		},
		hide(){
			setTimeout(() => {
				this.showMask = false;
			}, 100);
		}
	}
};
</script>

<style scoped>
.li-mask {
	position: fixed;
	top: 0px;
	height: 100%;
	width: 100%;
	color: #007AFF;
	background: rgba(255,255,255,0.9);
	line-height: 400upx;
	text-align: center;
	z-index: 999;
}

</style>
