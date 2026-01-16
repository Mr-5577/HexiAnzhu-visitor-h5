import Vue from 'vue'
import Router from 'uni-simple-router'
Vue.use(Router)

const router = new Router({
	routes: [
		{
			name: "login",
			path: "/pages/login/login"
		},
		{
			name: "visitor-register",
			path: "/pages/visitor/visitor-register"
		}
	]
})
router.beforeEach(async (to, from, next) => {
	next();
})
export default router
