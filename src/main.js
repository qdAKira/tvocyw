import Vue from 'vue'
import App from './App.vue'
import moment from 'moment'
import * as echarts from 'echarts';
import global from '@/utils/global.js'
import VueCookies from 'vue-cookies'
import highcharts from 'highcharts'
import highcharts3d from 'highcharts/highcharts-3d'

highcharts3d(highcharts)

import {
	ConfigProvider,
	Button,
	Form,
	Input,
	Icon,
	message,
	Checkbox,
	Layout,
	Menu,
	Breadcrumb,
	Avatar,
	Result,
	Row,
	Col,
	Space,
	Table,
	Select,
	Cascader,
	DatePicker,
	Modal,
	Radio,
	Carousel,
	Pagination,
	Popconfirm,
	Tooltip,
	Tree,
	Switch
} from 'ant-design-vue';

moment.locale('zh-cn')

import VueRouter from 'vue-router'
import router from './router'
import './promission'

import './assets/font.css'

// 解决导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

Vue.use(ConfigProvider)
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Checkbox)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(Avatar)
Vue.use(Result)
Vue.use(Space)
Vue.use(Table)
Vue.use(Select)
Vue.use(Cascader)
Vue.use(DatePicker)
Vue.use(Modal)
Vue.use(Col)
Vue.use(Row)
Vue.use(Radio)
Vue.use(Carousel)
Vue.use(Pagination)
Vue.use(Popconfirm)
Vue.use(Tooltip)
Vue.use(Tree)
Vue.use(Switch)

Vue.use(VueCookies)

Vue.prototype.$message = message
Vue.prototype.$moment = moment
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$destroyAll = Modal.destroyAll;
Vue.prototype.$echarts = echarts


Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App),
}).$mount('#app')
