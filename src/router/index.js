import Vue from 'vue'
import Router from 'vue-router'

import layout from '@/page/layout'
import login from '@/page/login'
import notfount from '@/page/404'
import media from '@/page/media/index.vue'
import summary from '@/page/media/summary.vue'
import waterBalance from '@/page/media/waterBalance.vue'
import company from '@/page/media/company.vue'
import sewage from '@/page/media/sewage.vue'
import rain from '@/page/media/rain.vue'
import balance from '@/page/media/balance.vue'
import surfaceWater from '@/page/media/surfaceWater.vue'
import video from '@/page/media/video.vue'
import home from '@/page/media/home.vue'

Vue.use(Router)

var constantRouterMap = [{
	path: '',
	component: layout,
	name: 'layout',
	meta: {
		title: '空气质量在线监测平台',
		requireAuth: true
	},
	children: []
}, {
	path: '/login',
	component: login,
	name: 'login',
	meta: {
		title: '空气质量在线监测平台',
	},
}, {
	path: '/media',
	component: media,
	name: 'media',
	meta: {
		requireAuth: true
	},
	children: [{
		path: '/media/summary',
		component: summary,
		name: 'summary',
		meta: {
			requireAuth: true
		},
	}, {
		path: '/media/sewage',
		component: sewage,
		name: 'sewage',
		meta: {
			requireAuth: true
		},
	}, {
		path: '/media/rain',
		component: rain,
		name: 'rain',
		meta: {
			requireAuth: true
		},
	}, {
		path: '/media/balance',
		component: balance,
		name: 'balance',
		meta: {
			requireAuth: true
		},
	}, {
		path: '/media/waterBalance',
		component: waterBalance,
		name: 'waterBalance',
		meta: {
			requireAuth: true
		},
	}, {
		path: '/media/surfaceWater',
		component: surfaceWater,
		name: 'surfaceWater',
		meta: {
			requireAuth: true
		},
	}, {
		path: '/media/video',
		component: video,
		name: 'video',
		meta: {
			requireAuth: true
		},
	}, {
		path: '/media/home',
		component: home,
		name: 'home',
		meta: {
			requireAuth: true
		},
	}, {
		path: '/media/company',
		component: company,
		name: 'company',
		meta: {
			requireAuth: true
		},
	}]
}]

export default new Router({
	mode: 'history',
	routes: constantRouterMap
})
