module.exports = {
	css: {
		loaderOptions: {
			less: {
				lessOptions: {
					javascriptEnabled: true,
				},
			},
		},
	},
	configureWebpack: {
		externals: {
			'AMap': 'AMap' // 高德地图配置
		}
	}
	// devServer: {
	// 	port: 8888, // 端口号，如果端口号被占用，会自动提升1   
	// 	host: "localhost", //主机名， 127.0.0.1， 真机 0.0.0.0
	// 	https: false, //协议
	// 	// open: true,
	// 	proxy: {
	// 		'/api': {
	// 			//target: 'http://10.0.0.73:22083',
	// 			//target: 'http://36.153.128.244:22081',
	// 			target: 'http://36.152.189.94:22083',
	// 			ws: true,
	// 			changeOrigin: true, // 虚拟的站点需要更管origin
	// 			pathRewrite: { //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
	// 				'^/api': ''
	// 			}
	// 		}
	// 	}
	// }
};
