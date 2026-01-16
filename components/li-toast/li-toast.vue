<template>
	<view  v-if="show">
		<view class="li-toast">{{ test }}</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			test: '你有一条新消息啦'
		};
	},
	props: {
		showToast: {
			type: Boolean,
			default: false
		}
	},
	computed:{
		show(){
			return this.showToast;
		}
	},
	methods: {}
};
</script>

<style scoped>
.li-toast {
	position: fixed;
	top: 40px;
	height: 100upx;
	width: 100%;
	color: #ff0000;
	background: #ffffff;
	line-height: 100upx;
	text-align: center;
	animation: fadeInDown 0.6s both;
	z-index: 999;
}
.fade_Down {
}
/*动画从上到下*/
@keyframes fadeInDown {
	from {
		opacity: 0;
		-webkit-transform: translate(0, -100px);
		transform: stranslate(0, -100px);
	}
	to {
		opacity: 1;
		-webkit-transform: translate(0, 10px);
		transform: stranslate(0, 10px);
	}
}
</style>
