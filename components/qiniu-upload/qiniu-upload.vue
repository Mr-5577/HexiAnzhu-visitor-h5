<template>
	<view class="">
		 <slot></slot>
	</view>
</template>

<script>
import qiniuUploader from '@/common/js/qiniuUploader.js';
export default{
	data() {
		return {
			key: ''
		}
	},
	computed: {
		qiniuDatas() {
			return this.$store.state.qiniuData;
		},
		nowDay() {
			let date = new Date();
			return date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate();
		}
	}
	methods:{
		qnUpload(imgs){
			return new Promise(resolve => {
				let keys = [];
				let token = this.qiniuDatas.Data;
				let domain = this.qiniuDatas.http_domain;
				let bucket = this.qiniuDatas.bucket;
				imgs.forEach(filePath => {
					let key = 'sunest-' + this.nowDay + '-' + new Date().getTime() + '.jpg';
					keys.push(key);
					qiniuUploader.upload(
						filePath,
						res => {
						// console.log('ressss: ' + JSON.stringify(res));
						},
						error => {
						// resolve(error)
						},
						{
							region: 'SCN', // ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
							domain: domain, // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
							key: key, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
							// 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
							uptoken: token // 由其他程序生成七牛 uptoken
						},
						res => {
							if(res.progress === 100){
								resolve(keys);
							}
						}
					);
				})
				this.$emit('uploaderImg',keys);
			});
			
		}
	}
}
</script>

<style></style>
