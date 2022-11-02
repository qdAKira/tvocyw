// import router from './router'

// const _import = require('./router/import.js')

// let getRouter

// let children = localStorage.getItem('fakeRouter')
// children = JSON.parse(children)

// let fakeRouter = {
// 	"children": children ? children : []
// }

// let fakeRouterC = []

// routerDo(fakeRouter.children)

// function routerDo(array) {
// 	for (let i = 0; i < array.length; i++) {
// 		if (array[i].children && array[i].children.length) {
// 			routerDo(array[i].children)
// 		} else {
// 			fakeRouterC.push(array[i])
// 		}
// 	}
// }

// if (sessionStorage.getItem('token') || localStorage.getItem('token')) {
// 	getRouter = filterAsyncRouter(fakeRouterC)
// 	router.options.routes[0].children = getRouter
// 	router.addRoutes(router.options.routes)
// }

// router.beforeEach((to, from, next) => {
// 	if (to.meta.title) {
// 		document.title = to.meta.title
// 	}
// 	if (to.matched.some(record => record.meta.requireAuth)) {
// 		if (!sessionStorage.getItem('token') && !localStorage.getItem('token')) {
// 			next({
// 				path: '/login',
// 			})
// 		} else {
// 			if (!getRouter) {
// 				if (!getObjArr('children')) {
// 					// axios
// 					getRouter = fakeRouter.children //假装模拟后台请求得到的路由数据
// 					saveObjArr('children', getRouter) //存储路由到localStorage
// 					routerGo(to, next) //执行路由跳转方法
// 				} else { //从localStorage拿到了路由
// 					getRouter = getObjArr('children') //拿到路由
// 					routerGo(to, next)
// 				}
// 			} else {
// 				// if (to.path == '/') {
// 				// 	if (localStorage.getItem('roleID') == 3) {
// 				// 		next({
// 				// 			path: '/media/company'
// 				// 		})
// 				// 	} else {
// 				// 		next({
// 				// 			path: '/media/home'
// 				// 		})
// 				// 	}
// 				// } else {
// 				// 	next()
// 				// }
// 				next()
// 			}
// 		}
// 	} else {
// 		next()
// 	}
// })

// function routerGo(to, next) {
// 	fakeRouterC = []
// 	routerDo(getRouter)
// 	getRouter = filterAsyncRouter(fakeRouterC) //过滤路由
// 	// router.addRoutes(getRouter) //动态添加路由
// 	router.options.routes[0].children = getRouter
// 	router.addRoutes(router.options.routes)
// 	global.antRouter = getRouter //将路由数据传递给全局变量，做菜单渲染工作
// 	next({
// 		...to,
// 		replace: true
// 	})
// }

// function saveObjArr(name, data) { //localStorage 存储数组对象的方法
// 	localStorage.setItem(name, JSON.stringify(data))
// }

// function getObjArr(name) { //localStorage 获取数组对象的方法
// 	return JSON.parse(window.localStorage.getItem(name));

// }

// function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
// 	const accessedRouters = asyncRouterMap.filter(route => {
// 		if (route.component) {
// 			route.component = _import(route.component) || null
// 		}
// 		if (route.children && route.children.length) {
// 			route.children = filterAsyncRouter(route.children)
// 		}
// 		return true
// 	})

// 	return accessedRouters
// }
