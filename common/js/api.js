import store from '@/store/index.js';
import uniRequest from './request.js';

let apis = {}
// 测试接口
apis.test = () => {
	return uniRequest.post('/api/test')
}
// 获取openid
apis.getUserOpenid = (data) => {
	return uniRequest.post('/api/get_user_openid', data)
}
//小程序登录
apis.login_xcx = (data) => {
	return uniRequest.post('/api/login_xcx', data)
}
//code 静默登录
apis.login_by_openid_xcx = (data) => {
	return uniRequest.post('/api/login_by_openid_xcx', data)
}
// 自动绑定房产信息
apis.autoBind = (data) => {
	return uniRequest.post('/api/autoBind', data)
}

export default apis;
