import uniRequest from 'uni-request';
import store from '@/store/index.js';
import md5 from 'js-md5';


uniRequest.defaults.baseURL = store.state.baseUrl;
uniRequest.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

function showToast(title) {
	uni.showToast({
		icon: 'none',
		title: title
	})
}

// 提取地址中的参数
function getQuery(query, key) {
	var map = query.split('&');
	for (var i = 0; i < map.length; i++) {
		var pair = map[i].split('=');
		if (pair[0] == key) {
			return pair[1];
		}
	}
}

function successState(res, data) {
	if (res) {
		if (res.status === 500) {
			showToast('500服务器访问失败');
			return;
		}
		if (res.data.status === 513) {
			showToast('请先缴清物业欠费');
			return;
		}
		switch (res.data.code) {
			case 0:
				showToast('统一下单失败');
				break;
			case 404:
				showToast('404 服务器访问失败');
				break;
			case 444:
				uni.showModal({
					title: "强制下线警告",
					content: "您已在其他地方登录，若非您本人操作，请及时修改密码。",
					confirmColor: '#fe845e',
					success: (res) => {
						setTimeout(() => {
							uni.reLaunch({
								url: "/pages/login/login"
							})
						}, 100);
					}
				})
				return;
				break;
			case 500:
				showToast('系统异常');
				break;
				// case 1001:
				// 	showToast('api参数不完整');
				// 	break;
			case 1002:
				showToast('appkey不正确');
				break;
			case 1003:
				showToast('ip不在白名单内');
				break;
			case 1004:
				showToast('access_token失效');
				break;
			case 1005:
				showToast('短信验证码错误');
				break;
			case 1006:
				showToast('短信发送失败');
				break;
			case 1007:
				store.commit('logout');
				uni.showModal({
					title: '登录失效',
					cancelColor: '#898989',
					cancelText: '不去了',
					confirmColor: '#fe845e',
					confirmText: '去登录',
					content: '是否前往登录？',
					success(resp) {
						if (resp.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}
					}
				})
				return;
				break;
			case 1008:
				// showToast('未绑定房产资源');
				// uni.redirectTo({
				// 	url: '/pages/reg/bound-house/bound-house'
				// });
				uni.showModal({
					title: '未绑定房产',
					cancelColor: '#898989',
					cancelText: '不去了',
					confirmColor: '#fe845e',
					confirmText: '去绑定',
					content: '是否前往绑定房产？',
					success(resp) {
						if (resp.confirm) {
							uni.navigateTo({
								url: '/pages/reg/bound-house/bound-house'
							})
						}
					}
				})
				break;
			case 1009:
				store.commit('logout');
				uni.showModal({
					title: '登录失效',
					cancelColor: '#898989',
					cancelText: '不去了',
					confirmColor: '#fe845e',
					confirmText: '去登录',
					content: '是否前往登录？',
					success(resp) {
						if (resp.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}
					}
				})
				return;
				break;
			case 1010:
				showToast('身份不匹配');
				break;
			case 1011:
				showToast('已绑定该房产');
				break;
			case 1012:
				uni.showModal({
					title: '您存在有未支付的订单',
					cancelColor: '#898989',
					cancelText: '不去了',
					confirmColor: '#ffcf5a',
					confirmText: '去缴费',
					content: '是否前往订单支付？',
					success(resp) {
						if (resp.confirm) {
							uni.redirectTo({
								url: '/pages/user/order/order?data=' + JSON.stringify(res.data)
							})
						} else {
							uni.navigateBack({
								delta: 1
							})
						}

					}
				})
				return;
				break;
			case 1013:
				showToast('参数不正确');
				break;
			case 1014:
				showToast('线上缴费已关闭');
				break;
			case 1015:
				showToast('limit过大');
				break;
			case 1016:
				showToast('支付金额不正确');
				break;
			case 1017:
				showToast('已存在该联系人');
				break;
			case 1018:
				showToast('未开通支付');
				break;
			case 1019:
				showToast('余额不足');
				break;
			case 1020:
				showToast('请绑定手机号');
				break;
			case 1021:
				showToast('当月已评价过该管理员');
				break;
			case 10013:
				showToast(res.data.msg);
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 1000)
				break;
			case 2000:
				console.log('res=错误处理', res)
				break;
			default:
				if (res.data.code != 1) {
					showToast(res.data.msg);
				}
		}

	}
}

function errorState(error) {
	showToast('您可能断网了，请重试！')
	// store.commit('logout');
}

//ascii排序
function sort_ASCII(obj) {
	var arr = new Array();
	var num = 0;
	for (var i in obj) {
		arr[num] = i;
		num++;
	}
	var sortArr = arr.sort();
	var sortObj = {};
	for (var i in sortArr) {
		sortObj[sortArr[i]] = obj[sortArr[i]];
	}
	return sortObj;
}
//对象转为字符串
function data_toStirng(obj) {
	let str = ''
	let arrayData = []
	Object.getOwnPropertyNames(obj).forEach(function(key) {
		if (obj[key]) {
			arrayData.push(key + '=' + obj[key]);
		}
	})
	for (let i = 0; i < arrayData.length; i++) {
		//最后一条数据
		let lastLength = arrayData.length - 1;
		//如果不是最后一条数据加上& 
		if (i !== lastLength) {
			str += arrayData[i] + '&'
		} else {
			str += arrayData[lastLength]
		}
	}
	return str;

}
//获取access_token
function accessToken(data) {
	let asciiData = sort_ASCII(data);
	let asciiData_toStirng = data_toStirng(asciiData);
	let md5data = md5(asciiData_toStirng);
	let upperCaseData = md5data.toUpperCase();
	return upperCaseData;
}


let requests = {}
requests.post = (url, data) => {
	//公用loginToken
	let objData = {};
	if (!store.state.login_token) {
		objData = data;
	} else {
		let loginToken = {
			login_token: store.state.login_token
		}
		if (store.state.myHouse && store.state.myHouse.ownerInfo.roomid && !data.vid) {
			data.vid = store.state.myHouse.ownerInfo.vvid
		}
		objData = Object.assign(data, loginToken);
	}
	let access_token = accessToken(objData);

	let promise = new Promise(function(resolve, reject) {
		uniRequest.post(url + '?access_token=' + access_token + '&XDEBUG_SESSION=XDEBUG_SESSION', objData).then((res) => {

			setTimeout(res => {
				uni.hideLoading();
			}, 1500)
			// successState(res)
			if (res.data.code === 1) {
				resolve(res.data)
			}
		}).catch((response) => {

			setTimeout(res => {
				uni.hideLoading();
			}, 1500)
			errorState(response)
			reject(response)
		});
	})
	return promise
}

export default requests;