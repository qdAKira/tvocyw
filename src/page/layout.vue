<template>
	<a-layout class="components-layout">
		<a-layout-header class="components-header">
			<div class="components-logo" />
			<div class="components-header-right">
				<span class="components-header-title">空气质量在线监测平台</span>
				<div class="components-header-system">
					<!-- <div class="components-header-date">
						<img src="../../static/test/tq-1.png" alt="">
						<div style="margin-left: 15px;">{{dateTime | timeFilter}}</div>
					</div> -->
					<iframe style="margin-top: 15px;" width="210" height="60" frameborder="0" scrolling="no" hspace="0"
						src="https://i.tianqi.com/?c=code&a=getcode&color=%2300e4fd&id=12&num=1&py=nantong&icon=1"></iframe>
					<div class="components-header-user">
						<a-avatar class="components-header-img" :size="51" :src="avatar" @click="visible = true" />
						<div style="margin-left: 21px;">{{chineseUserName}}</div>
					</div>
					<div class="components-header-exit" @click="exit"></div>
				</div>
			</div>
		</a-layout-header>
		<a-layout class="warp">
			<a-layout-sider v-show="fold" width="200" class="components-sider">
				<a-menu class="components-menu" theme="dark" :defaultSelectedKeys="[$route.path]" :openKeys="openKeys"
					mode="inline" :inline-collapsed="collapsed" data-i="111" @openChange="onOpenChange"
					@click="menuClick">
					<template v-for="item in menu">
						<a-menu-item v-if="!item.children || !item.children.length" :key="item.path">{{item.meta.title}}</a-menu-item>
						<sub-menu v-else :key="item.path" :menu-info="item" />
					</template>
					<!-- <template v-for="item in menu">
						<a-menu-item v-if="!item.children" :key="item.path">{{item.path}}</a-menu-item>
						<sub-menu v-else :key="item.path" :menu-info="item" />
					</template> -->
				</a-menu>
				<router-link class="components-media" :to="{path:'/media'}">监控大屏</router-link>
			</a-layout-sider>
			<a-layout style="padding: 0 24px 24px 12px">
				<div style="display: flex;align-items: center;">
					<a-button style="margin-right: 5px;color: #000;" type="link" ghost
						:icon="fold ? 'menu-fold' : 'menu-unfold'" @click="foldChange" />
					<a-breadcrumb style="margin: 16px 0;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
						<a-breadcrumb-item v-for="item in breadcrumb" :key="item">{{item}}</a-breadcrumb-item>
					</a-breadcrumb>
				</div>
				<a-layout-content :style="{margin: 0}">
					<router-view />
				</a-layout-content>
			</a-layout>
		</a-layout>
		<a-modal title="修改密码" :visible="visible" :width="350" centered :confirm-loading="confirmLoading" @ok="handleOk"
			@cancel="handleCancel">
			<a-form :form="form">
				<a-form-item>
					<a-input-password v-decorator="['newPassword', { rules: [{ required: true, message: '请输入新密码' }] }]"
						placeholder="密码" />
				</a-form-item>
			</a-form>
		</a-modal>
	</a-layout>
</template>
<script>
	let sha1 = require('sha1')
	import moment from "moment"

	import SubMenu from '@/components/subMenu.vue'

	import {
		addDegoins,
		password
	} from '@/request/api'

	export default {
		components: {
			'sub-menu': SubMenu,
		},
		data() {
			return {
				collapsed: false,
				dateTime: new Date(),
				menu: JSON.parse(window.localStorage.getItem('children')),
				openKeys: [],
				rootSubmenuKeys: [],
				breadcrumb: [],
				fold: true,
				avatar: require('../../static/image/uesr-header.png'),
				visible: false,
				confirmLoading: false,
				chineseUserName: global.chineseUserName,
				form: this.$form.createForm(this, {
					name: 'form',
				})
			};
		},
		created() {
			setInterval(() => {
				this.dateTime = new Date()
			}, 1000)

			let keystr = this.$route.path
			// console.log(keystr.substring(0, keystr.lastIndexOf("/")))

			this.keyCut(keystr)

			const breadcrumbArray = this.breadcrumbCut(keystr, [])

			this.breadcrumbHandle(breadcrumbArray, this.menu, 1)

			// 将从缓存中取出openKeys
			// const openKeys = window.localStorage.getItem('openKeys')
			// console.log(openKeys)
			// if (openKeys) {
			// 	// 存在即赋值
			// 	this.openKeys = JSON.parse(openKeys)
			// }
			this.menu.forEach(item => {
				this.rootSubmenuKeys.push(item.path)
			})
		},
		methods: {
			keyCut(key) {
				key = key.substring(0, key.lastIndexOf("/"))
				if (key) {
					this.openKeys.push(key)
					this.keyCut(key)
				}
			},
			breadcrumbCut(key, array) {
				if (key) {
					array.push(key)
					key = key.substring(0, key.lastIndexOf("/"))
					return this.breadcrumbCut(key, array)
				} else {
					return array
				}
			},
			onOpenChange(openKeys) {
				// this.openKeys = []
				// 将当前打开的父级菜单存入缓存中
				// debugger
				//  控制只打开一个
				const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
				if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
					this.openKeys = openKeys;
				} else {
					this.openKeys = latestOpenKey ? [latestOpenKey] : [];
				}
			},
			menuClick(e) {
				// 获取到当前的key,并且跳转
				this.$router.push({
					path: e.key
				})
				let n = 1
				this.breadcrumb = []
				this.breadcrumbHandle(e.keyPath, this.menu, n)
			},
			breadcrumbHandle(x, y, n) {
				for (let i = 0; i < y.length; i++) {
					if (x[x.length - n] == y[i].path) {
						this.breadcrumb.push(y[i].meta.title)
						if (y[i].children && y[i].children.length) {
							this.breadcrumbHandle(x, y[i].children, n + 1)
						} else {
							return
						}
					}
				}
			},
			foldChange() {
				this.fold = !this.fold
			},
			exit() {
				this.$confirm({
					title: '你确定要退出登录吗？',
					centered: true,
					onOk: () => {
						localStorage.clear()
						this.$router.push('/login')
						location.reload()
					},
					onCancel() {
						console.log('Cancel')
					},
				});
			},
			handleOk(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						let data = values
						data.id = global.userID
						data.newPassword = sha1(data.newPassword).toUpperCase()
						this.confirmLoading = true
						password(data).then(res => {
							if (res.status === '0') {
								this.visible = false
								this.$message.success(res.message, 3, this.form.setFieldsValue({
									newPassword: ''
								}));
							} else {
								console.log(res.message)
							}
							this.confirmLoading = false
						})
					} else {}
				});
			},
			handleCancel() {
				this.visible = false
				this.form.setFieldsValue({
					newPassword: ''
				});
			}
		},
		mounted() {},
		filters: {
			timeFilter(val) {
				return moment(val).format('YYYY年MM月DD日') + '\n' + moment(val).format('HH:mm:ss')
			}
		}
	};
</script>

<style scoped>
	.components-logo {
		width: 70px;
		height: 78px;
		background: url(../../static/image/logo.png) no-repeat 0 0 / 100% 100%;
		margin-right: 25px;
	}

	.components-layout {
		height: 100%;
	}

	.warp {
		height: calc(100% - 64px);
	}

	.components-header {
		background-color: #000a3b;
		height: 90px;
		padding: 0 50px 0 35px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.components-menu {
		background-color: #0e1a51;
	}

	.components-menu .ant-menu-item-selected {
		background-color: #0465b5;
	}

	.components-header-title {
		font-size: 30px;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #0ee2f7;
	}

	.components-header-right {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.components-header-system {
		display: flex;
		align-items: center;
	}

	.components-header-date {
		font-size: 18px;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #0febff;
		display: flex;
		align-items: center;
		margin-right: 30px;
	}

	.components-header-date>img {
		width: 53px;
		height: 48px;
		cursor: pointer;
	}

	.components-header-date>div {
		line-height: 30px;
		white-space: pre-line;
		text-align: center;
	}

	.components-header-img {
		cursor: pointer;
	}

	.components-header-user {
		display: flex;
		align-items: center;
		font-size: 18px;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #0febff;
		margin-right: 25px;
	}

	.components-header-exit {
		width: 66px;
		height: 66px;
		cursor: pointer;
		background: url(../../static/icon/exit.png) no-repeat 0 0 / 100% 100%;
	}

	.ant-form-item {
		margin: 0;
	}

	.components-media {
		font-size: 24px;
		color: #0ee2f6;
		position: absolute;
		height: 50px;
		line-height: 50px;
		left: 0;
		right: 0;
		bottom: 0;
		text-align: center;
		margin: 0 auto;
		background-color: #001529;
	}

	@media screen and (max-width: 1050px) {

		.components-header-date>div,
		.components-header-user>div {
			display: none;
		}
	}

	@media screen and (max-width: 800px) {

		.components-header-right {
			justify-content: flex-end;
		}

		.components-header-title {
			display: none;
		}
	}
</style>

<style>
	.components-menu .ant-menu {
		background-color: #151f4d !important;
	}

	.components-sider .ant-layout-sider-children {
		overflow-y: scroll;
		scrollbar-width: none;
		/* Firefox */
		-ms-overflow-style: none;
		/* IE 10+ */
		padding-bottom: 50px;
	}

	.components-sider .ant-layout-sider-children::-webkit-scrollbar {
		display: none;
		/* Chrome Safari */
	}
</style>
