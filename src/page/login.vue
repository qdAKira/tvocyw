<template>
	<div class="login-mode">
		<div class="login-title">
			<!-- <img src="../../static/image/logo-1.png" alt=""> -->
			空气质量在线监测平台
		</div>
		<div class="login-text1"><span style="color: #4de8ff;">保护</span>环境</div>
		<div class="login-text2">共建<span style="color: #1dff72;">生态开发区</span></div>
		<div class="login-form">
			<div class="login-from-title">用户登录</div>
			<a-form :form="form" @submit="handleSubmit">
				<a-form-item>
					<div class="login-input">
						<label class="login-label user"></label>
						<div class="login-flex">
							<a-input autoComplete="off"
								v-decorator="['UserName',{ rules: [{ required: true, message: '请输入用户名!' }]},]"
								placeholder="用户名">
							</a-input>
						</div>
					</div>
				</a-form-item>
				<a-form-item>
					<div class="login-input">
						<label class="login-label pass"></label>
						<div class="login-flex">
							<a-input v-decorator="[ 'Password', { rules: [{ required: true, message: '请输入密码!' }] },]"
								type="password" placeholder="密码">
							</a-input>
						</div>
					</div>
				</a-form-item>
				<a-form-item style="position: relative;">
					<div class="login-input sidentify" style="align-items: center;padding-right: 1px;">
						<div class="login-flex">
							<a-input autoComplete="off"
								v-decorator="[ 'verifier', { rules: [{ required: true, message: '请输入验证码!' }] },]"
								placeholder="输入验证码">
							</a-input>
						</div>
						<v-sidentify ref="sidentify" @Change="code($event)"></v-sidentify>
					</div>
				</a-form-item>
				<div class="login-box-footer">
					<div class="login-remember">
						<div class="login-remember-icon" :class="{remember: remember}" @click="remember = !remember">
						</div>
						记住密码
					</div>
					<a-button type="primary" html-type="submit" block shape="round" class="login-button">
						登录
					</a-button>
				</div>
				<div class="login-form-tips">
					<a href="javascript:;" style="color: #fd1d1d;" @click="warning">浏览器使用说明</a>
				</div>
			</a-form>
		</div>
		<div class="login-tips">@版权所有 江苏尚维斯环境科技股份有限公司</div>
	</div>
</template>
<script>
	let sha1 = require('sha1')

	const Base64 = require('js-base64').Base64

	import Sidentify from '@/components/sidentify.vue'

	import {
		apiLogin,
		getTokenApi,
		getRegionName,
		addDegoins,
	} from '@/request/api'

	export default {
		components: {
			'v-sidentify': Sidentify
		},
		data() {
			return {
				verifier: '',
				remember: false,
				form: this.$form.createForm(this, {
					name: 'normal_login'
				}),
				fakeRouterC: []
			};
		},
		created() {},
		methods: {
			code(e) {
				this.verifier = e
			},
			handleSubmit(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						if (this.verifier.toLowerCase() != values.verifier.toLowerCase()) {
							this.$message.error({
								content: '验证码错误，请重新输入！',
								key: 'loading',
								onClose: () => {
									this.$refs.sidentify.draw()
								}
							});
							return
						}
						// values.Password = sha1(values.Password).toUpperCase()
						localStorage.setItem('token', '')
						const data = {
							UserName: values.UserName,
							Password: values.Password
						}
						this.login(values)
					}
				});
			},
			async login(values) {
				this.$message.loading({
					content: '登录中...',
					key: 'loading'
				})
				await apiLogin({
					UserName: values.UserName,
					Password: sha1(values.Password).toUpperCase()
				}).then(res => {
					console.log(res)
					if (res.status == 0) {
						localStorage.setItem('token', res.result.token)
						localStorage.setItem('regoins', JSON.stringify(res.result.regoins))
						localStorage.setItem('regionID', res.result.regionID)
						localStorage.setItem('roleID', res.result.roleID)
						localStorage.setItem('userID', res.result.userID)
						localStorage.setItem('userName', res.result.userName)
						localStorage.setItem('companyID', res.result.companyID)
						localStorage.setItem('chineseUserName', res.result.chineseUserName)
						global.regoins = JSON.parse(localStorage.getItem('regoins'))
						global.regionID = localStorage.getItem('regionID')
						global.userID = localStorage.getItem('userID')
						global.roleID = localStorage.getItem('roleID')
						global.companyID = localStorage.getItem('companyID')
						global.chineseUserName = localStorage.getItem('chineseUserName')

						let fakeRouter = res.result.routeUrl
						this.fakeRouterUp(fakeRouter)
						
						localStorage.setItem('fakeRouter', JSON.stringify(fakeRouter))
						localStorage.setItem('children', JSON.stringify(fakeRouter))

						this.setUserInfo(values)
					} else {
						console.log(res.message)
						this.$message.error({
							content: res.message,
							key: 'loading',
							duration: 2,
							onClose: () => {
								this.$refs.sidentify.draw()
							}
						})
					}
				})
				if (global.regionID) {
					addDegoins({
						regionID: global.regionID
					}).then(res => {
						if (res.status === '0') {
							let degoinsGrade = []
							let n = 0
							try {
								res.result.forEach((item, index, array) => {
									if (index == 0) {
										degoinsGrade.push([])
									}
									degoinsGrade[n].push(item)
									if (index == array.length - 1) {
										throw new Error("End");
									}
									if (item.regoinLevel != array[index + 1].regoinLevel) {
										degoinsGrade.push([])
										n++
									}
								})
							} catch (e) {
								if (e.message != "End") throw e;
							}
							degoinsGrade.reverse().forEach((item, index, array) => {
								if (index > 0) {
									item.forEach(next => {
										if (next.child == undefined) {
											next.child = new Array
										}
										array[index - 1].forEach(child => {
											if (next.id == child.parentID) {
												next.child.push(child)
											}
										})
									})
								}
							})

							localStorage.setItem('addDegoins', JSON.stringify(degoinsGrade.reverse()[0]))
							global.addDegoins = JSON.parse(localStorage.getItem('addDegoins'))

							this.$message.success({
								content: '登录成功!',
								key: 'loading',
								duration: 0.5,
								onClose: () => {
									this.$router.push({
										path: '/media'
									})
								}
							})
						} else {
							this.$message.error({
								content: res.message,
								key: 'loading',
								duration: 0.5,
								onClose: () => {
									this.$refs.sidentify.draw()
								}
							})
						}
					})
				}
			},
			// 获取cookie
			getCookie: function(key) {
				if (document.cookie.length > 0) {
					var start = document.cookie.indexOf(key + "=");
					if (start !== -1) {
						start = start + key.length + 1;
						var end = document.cookie.indexOf(";", start);
						if (end === -1) end = document.cookie.length;
						return unescape(document.cookie.substring(start, end));
					}
				}
				return "";
			},
			// 保存cookie
			setCookie: function(cName, value, expiredays) {
				var exdate = new Date();
				exdate.setDate(exdate.getDate() + expiredays);
				document.cookie =
					cName +
					"=" +
					decodeURIComponent(value) +
					(expiredays == null ? "" : ";expires=" + exdate.toGMTString());
			},
			setUserInfo: function(values) {
				// 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
				// 如果没有勾选，储存的信息为空
				if (this.remember) {
					this.setCookie("account", values.UserName, 7);
					// base64加密密码
					let passWord = Base64.encode(values.Password);
					this.setCookie("password", passWord, 7);
					this.setCookie("remember", this.remember, 7);
				} else {
					this.setCookie("account", "");
					this.setCookie("password", "");
				}
			},
			warning() {
				this.$warning({
					title: '浏览器使用说明',
					content: '本系统支持使用谷歌浏览器或360极速模式，其它浏览器下使用本系统会影响部分效果或功能无法使用。请使用谷歌浏览器或360极速模式访问本系统，最佳浏览器分辨率等于1920*1080。',
					centered: true
				});
			},
			fakeRouterUp(router) {
				router.forEach(item => {
					if (item.children && item.children.length) {
						this.fakeRouterUp(item.children)
					} else {
						item.component = item.path.substr(1)
						this.fakeRouterC.push(item)
					}
				})
			},
		},
		mounted() {
			let account = this.getCookie("account");
			let password = Base64.decode(this.getCookie("password"));
			if (account) {
				this.form.setFieldsValue({
					UserName: account,
					Password: password,
				});
				this.remember = true
			}
		}
	};
</script>

<style scoped>
	.login-mode {
		width: 100%;
		min-width: 1200px;
		height: 100%;
		background: url(../../static/image/bg-2.png) no-repeat 0 0 / 100% 100%;
		position: relative;
	}

	.login-title {
		font-size: 60px;
		letter-spacing: 0px;
		color: #fefefe;
		line-height: 1;
		margin: 0 auto 15px;
		display: flex;
		align-items: center;
		position: absolute;
		top: 8vh;
		left: 7vw;
		font-weight: bold;
	}

	.login-title>img {
		width: 113px;
		height: 113px;
		display: block;
		margin-right: 20px;
	}

	.login-title-line {
		width: 459px;
		height: 21px;
		margin: 0 auto;
		background: url(../../static/image/login-title-line.png) no-repeat 0 0 / 100% 100%;
	}

	.login-con {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		width: 1430px;
		margin: auto;
		height: 655px;
	}

	.login-map {
		position: absolute;
		width: 650px;
		height: 655px;
		background: url(../../static/image/login-map.png) no-repeat 0 0 / 100% 100%;
		left: 0;
		top: 0;
	}

	.login-form {
		width: 549px;
		height: 403px;
		background: url(../../static/image/login-box-2.png) no-repeat 0 0 / 100% 100%;
		position: absolute;
		right: 11vw;
		top: 35vh;
		padding: 15px 64px 0 58px;
	}

	.login-input {
		display: flex;
		height: 47px;
		/* background: url(../../static/image/login-input-bg.png) no-repeat 0 0 / 100% 100%; */
		background-color: #fff;
		border-radius: 50px;
		padding-right: 30px;
	}

	.login-input.sidentify {
		/* background-image: url(../../static/image/login-sidentify-bg.png); */
		background-color: #fff;
		padding-left: 25px;
	}

	.login-input label {
		position: relative;
		display: block;
		width: 65px;
	}

	.login-input label::after {
		content: '';
		position: absolute;
		width: 2px;
		height: 33px;
		background-color: #39c1ff;
		top: 0;
		bottom: 0;
		right: 0;
		margin: auto;
	}

	.login-input .login-flex {
		flex: 1;
		padding: 10px;
		height: 100%;
	}

	.login-input>div>input {
		width: 100%;
		height: 100%;
		line-height: 23px;
		background-color: transparent;
		border: 0;
		outline: 0;
		color: #333;
	}

	.login-label.user {
		background: url(../../static/icon/login-icon-user-2.png) no-repeat 20px center / 25px 31px;
	}

	.login-label.pass {
		background: url(../../static/icon/login-icon-pass-2.png) no-repeat 20px center / 25px 31px;
	}

	.login-remember {
		flex: 1;
		height: 19px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #fff;
		line-height: 1;
		left: 0;
		top: 54px;
	}

	.login-remember-icon {
		width: 15px;
		height: 16px;
		background: url(../../static/icon/login-checked-0.png) no-repeat 0 0 / 100% 100%;
		margin: 0 4px 3px;
		cursor: pointer;
	}

	.login-remember-icon.remember {
		background-image: url(../../static/icon/login-checked-1.png);
	}

	.login-button {
		width: 283px;
		height: 50px;
		/* background: url(../../static/image/login-button-bg.png) no-repeat 0 0 / 100% 100%; */
		background-color: #39c1ff;
		text-align: center;
		line-height: 50px;
		font-size: 24px;
		color: #fff;
		cursor: pointer;
		/* margin-top: 8px; */
		border: none;
	}

	.login-input .ant-input {
		padding: 0;
		display: block;
	}

	.login-form .ant-form-item {
		margin-bottom: 35px;
	}

	.login-form .ant-form-item-with-help {
		margin-bottom: 0px;
	}

	.login-map-icon {
		text-align: center;
		position: absolute;
		font-size: 15px;
		color: #00eaff;
	}

	.login-map-icon>div {
		cursor: pointer;
	}

	.login-map-icon>div:hover {
		transform: scale(1.2);
	}

	.login-map-sphgl {
		width: 91px;
		height: 91px;
		background: url(../../static/icon/sphgl.png) no-repeat 0 0 / 100% 100%;
	}

	.login-map-jkdp {
		width: 85px;
		height: 85px;
		background: url(../../static/icon/jkdp.png) no-repeat 0 0 / 100% 100%;
	}

	.login-map-ycjk {
		width: 76px;
		height: 76px;
		background: url(../../static/icon/ycjk.png) no-repeat 0 0 / 100% 100%;
	}

	.login-map-ssjk {
		width: 76px;
		height: 76px;
		background: url(../../static/icon/ssjk.png) no-repeat 0 0 / 100% 100%;
	}

	.login-map-bjyj {
		width: 85px;
		height: 85px;
		background: url(../../static/icon/bjyj.png) no-repeat 0 0 / 100% 100%;
	}

	.login-map-sjtjybb {
		width: 91px;
		height: 91px;
		background: url(../../static/icon/sjtjybb.png) no-repeat 0 0 / 100% 100%;
	}

	.login-map-icon.sphgl {
		top: -70px;
		left: 110px;
	}

	.login-map-icon.jkdp {
		left: 179px;
		top: 175px;
	}

	.login-map-icon.ycjk {
		left: 268px;
		top: 115px;
	}

	.login-map-icon.ssjk {
		left: 305px;
		top: 253px;
	}

	.login-map-icon.bjyj {
		left: 424px;
		top: 32px;
	}

	.login-map-icon.sjtjybb {
		left: 452px;
		top: 368px;
	}

	.login-tips {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 20px;
		text-align: center;
		font-size: 16px;
		color: #fff;
	}

	.login-box-footer {
		display: flex;
		align-items: center;
	}

	.login-from-title {
		font-size: 26px;
		color: #fefefe;
		text-align: center;
		margin-bottom: 10px;
	}

	.login-text1 {
		font-size: 60px;
		color: #fff;
		animation-name: text1;
		animation-duration: 10s;
		position: absolute;
		top: 393px;
		left: 272px;
		animation-iteration-count: infinite;
		opacity: 0;
		font-family: "zkkh";
	}

	.login-text2 {
		font-size: 60px;
		color: #fff;
		animation-name: text1;
		animation-duration: 10s;
		position: absolute;
		top: 474px;
		left: 382px;
		animation-iteration-count: infinite;
		animation-delay: 1.5s;
		opacity: 0;
		font-family: "zkkh";
	}

	.login-form-tips {
		font-size: 18px;
		text-align: center;
		margin-top: 8px;
	}

	@keyframes text1 {
		0% {
			opacity: 0;
			transform: scale(2.5)
		}

		0.5% {
			opacity: 1;
		}

		12.5% {
			transform: scale(1)
		}

		25% {
			opacity: 1;
		}

		75% {
			opacity: 1;
		}

		75.5% {
			opacity: 0;
		}

		100% {
			opacity: 0;
		}
	}
</style>

<style>
	.login-form .ant-form-explain {
		min-height: 35px;
		line-height: 35px;
		margin-top: 0;
		margin-bottom: 0;
	}
</style>
