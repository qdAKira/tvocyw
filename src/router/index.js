import Vue from 'vue'
import Router from 'vue-router'

import layout from '@/page/layout'
import login from '@/page/login'
import notfount from '@/page/404'
import Dashboard from '@/page/dashboard'


Vue.use(Router)

var constantRouterMap = [{
	path: '/',
	component: layout,
	name: 'layout',
	meta: {
		title: '空气质量在线监测平台',
		requireAuth: true
	},
	children: [
		{
      path: 'dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { title: '首页', icon: 'dashboard' }
    }
	]
}, {
	path: '/login',
	component: login,
	name: 'login',
	meta: {
		title: '空气质量在线监测平台',
	},
}, ]

export default new Router({
	mode: 'history',
	routes: constantRouterMap
})
