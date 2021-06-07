import axios from 'axios'
import QS from 'qs'
import router from './../router'

// 环境的切换
if (process.env.NODE_ENV == 'development') {
	axios.defaults.baseURL = 'http://36.152.189.94:22083';
} else if (process.env.NODE_ENV == 'debug') {
	axios.defaults.baseURL = 'http://36.152.189.94:22083';
} else if (process.env.NODE_ENV == 'production') {
	axios.defaults.baseURL = 'http://36.152.189.94:22083';
}

// if (process.env.NODE_ENV == 'development') {
// 	axios.defaults.baseURL = '/api';
// } else if (process.env.NODE_ENV == 'debug') {
// 	axios.defaults.baseURL = '/api';
// } else if (process.env.NODE_ENV == 'production') {
// 	axios.defaults.baseURL = '/api';
// }

global.baseURL = axios.defaults.baseURL

// 请求超时时间
axios.defaults.timeout = 120000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8;';
axios.defaults.withCredentials = true;
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8;';
// axios.defaults.crossDomain = true;

// 请求拦截器
axios.interceptors.request.use(
	config => {
		// 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
		// 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
		const token = localStorage.getItem('token');
		token && (config.headers.Authorization = "Bearer " + token);
		const userName = localStorage.getItem('userName');
		config.headers['UserName'] = userName;
		return config;
	},
	error => {
		return Promise.error(error);
	})

let count = 0;

// 响应拦截器
axios.interceptors.response.use(
	response => {
		if (response.status === 200) {
			if(response.data.status=="1")				
			{
				if(count===0)					
				{
					// alert("系统内部有错误，请联系管理员！");
					count++;
				}
			}
			return Promise.resolve(response);
		} else {
			return Promise.reject(response);
		}
	},
	// 服务器状态码不是200的情况    
	error => {
		if (error.response.status) {
			switch (error.response.status) {
				// 401: 未登录                
				// 未登录则跳转登录页面，并携带当前页面的路径                
				// 在登录成功后返回当前页面，这一步需要在登录页操作。                
				case 401:
					if (router.currentRoute.path != '/login') {
						router.replace({
							path: '/login',
						})
					}
					break;
					// 403 token过期                
					// 登录过期对用户进行提示                
					// 清除本地token和清空vuex中token对象                
					// 跳转登录页面                
				case 403:
					Toast({
						message: '登录过期，请重新登录',
						duration: 1000,
						forbidClick: true
					});
					// 清除token                    
					localStorage.removeItem('token');
					store.commit('loginSuccess', null);
					// 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
					setTimeout(() => {
						router.replace({
							path: '/login',
							query: {
								redirect: router.currentRoute.fullPath
							}
						});
					}, 1000);
					break;
					// 404请求不存在                
				case 404:
					Toast({
						message: '网络请求不存在',
						duration: 1500,
						forbidClick: true
					});
					break;
					// 其他错误，直接抛出错误提示                
				default:
					Toast({
						message: error.response.data.message,
						duration: 1500,
						forbidClick: true
					});
			}			
			return Promise.reject(error.response);
		}
	});

/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
			params: params
		}).then(res => {
			resolve(res.data);
		}).catch(err => {
			reject(err.data)
		})
	})
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
	// var data = QS.stringify(params)
	return new Promise((resolve, reject) => {
		axios.post(url, params)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.data)
			})
	})
}

/** 
 * download方法，对应文件下载请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function download(url, params) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
			params: {
				...params
			},
			responseType: 'blob'
		}).then(res => {
			resolve(res.data);
		}).catch(err => {
			reject(err.data)
		})
	})
}



/** 
 * delete方法，对应delete请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function del(url, params) {
	return new Promise((resolve, reject) => {
		// var data = QS.stringify(params,{indices:false})
		axios.delete(url, {
				data: params
			})
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.data)
			})
	})
}

/** 
 * put方法，对应put请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function put(url, params) {
	// var data = QS.stringify(params)
	return new Promise((resolve, reject) => {
		axios.put(url, params)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.data)
			})
	})
}
