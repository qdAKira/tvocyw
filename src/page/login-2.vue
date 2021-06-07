<template>
	<div class="login-mode">
		<div class="login-title">洋口园区水环境管理系统</div>
		<div class="login-title-line"></div>
		<div class="login-con">
			<div class="login-map">
				<div class="login-map-icon sphgl">
					水平衡管理
					<div class="login-map-sphgl"></div>
				</div>
				<div class="login-map-icon jkdp">
					监控大屏
					<div class="login-map-jkdp"></div>
				</div>
				<div class="login-map-icon ycjk">
					远程监控
					<div class="login-map-ycjk"></div>
				</div>
				<div class="login-map-icon ssjk">
					实时监控
					<div class="login-map-ssjk"></div>
				</div>
				<div class="login-map-icon bjyj">
					报警预警
					<div class="login-map-bjyj"></div>
				</div>
				<div class="login-map-icon sjtjybb">
					数据统计与报表
					<div class="login-map-sjtjybb"></div>
				</div>
			</div>
			<div class="login-form">
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
								<a-input
									v-decorator="[ 'Password', { rules: [{ required: true, message: '请输入密码!' }] },]"
									type="password" placeholder="密码">
								</a-input>
							</div>
						</div>
					</a-form-item>
					<a-form-item style="position: relative;">
						<div class="login-input sidentify"
							style="margin-bottom: 8px;align-items: center;padding-right: 10px;">
							<div class="login-flex">
								<a-input autoComplete="off"
									v-decorator="[ 'verifier', { rules: [{ required: true, message: '请输入验证码!' }] },]"
									placeholder="输入验证码">
								</a-input>
							</div>
							<v-sidentify ref="sidentify" @Change="code($event)"></v-sidentify>
						</div>
						<div class="login-remember">
							<div class="login-remember-icon" :class="{remember: remember}"
								@click="remember = !remember"></div>
							记住密码
						</div>
					</a-form-item>
					<a-button type="primary" html-type="submit" block class="login-button">
						登录
					</a-button>
				</a-form>
			</div>
		</div>
		<div class="login-tips">@版权所有 江苏尚维斯环境科技有限公司</div>
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
					if (res.status == 0) {
						localStorage.setItem('token', res.result.token)
						localStorage.setItem('regoins', JSON.stringify(res.result.regoins))
						localStorage.setItem('regionID', res.result.regionID)
						localStorage.setItem('roleID', res.result.roleID)
						localStorage.setItem('userID', res.result.userID)
						localStorage.setItem('userName', res.result.userName)
						localStorage.setItem('companyID', res.result.companyID)
						global.regoins = JSON.parse(localStorage.getItem('regoins'))
						global.regionID = localStorage.getItem('regionID')
						global.userID = localStorage.getItem('userID')
						global.roleID = localStorage.getItem('roleID')
						global.companyID = localStorage.getItem('companyID')

						this.setUserInfo(values)
					} else {
						this.$message.error({
							content: res.message,
							key: 'loading',
							duration: 1,
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
								duration: 1,
								onClose: () => {
									this.$router.push({
										path: '/'
									})
								}
							})
						} else {
							this.$message.error({
								content: res.message,
								key: 'loading',
								duration: 1,
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
			}
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
		height: 100%;
		background: url(../../static/image/login-bg.png) no-repeat 0 0 / 100% 100%;
		padding-top: 54px;
		position: relative;
	}

	.login-title {
		width: 750px;
		font-size: 37px;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #00eaff;
		text-align: center;
		text-shadow: 0 0 9px #00eaff;
		line-height: 1;
		margin: 0 auto 15px;
		;
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
		width: 425px;
		height: 385px;
		background: url(../../static/image/login-box.png) no-repeat 0 0 / 100% 100%;
		position: absolute;
		right: 0;
		top: 43px;
		padding: 40px 55px 0 70px;
	}

	.login-input {
		display: flex;
		height: 43px;
		background: url(../../static/image/login-input-bg.png) no-repeat 0 0 / 100% 100%;
	}

	.login-input.sidentify {
		background-image: url(../../static/image/login-sidentify-bg.png);
	}

	.login-input label {
		display: block;
		width: 50px;
	}

	.login-input .login-flex {
		flex: 1;
		padding: 10px;
	}

	.login-input>div>input {
		width: 100%;
		height: 100%;
		line-height: 23px;
		background-color: transparent;
		border: 0;
		outline: 0;
		color: #fff;
	}

	.login-label.user {
		background: url(../../static/image/login-icon-user.png) no-repeat center center / 30px 30px;
	}

	.login-label.pass {
		background: url(../../static/image/login-icon-pass.png) no-repeat center center / 30px 30px;
	}

	.login-remember {
		width: 300px;
		position: absolute;
		height: 19px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-size: 15px;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #00eaff;
		line-height: 1;
		left: 0;
		top: 54px;
	}

	.login-remember-icon {
		width: 15px;
		height: 16px;
		background: url(../../static/image/login-checked-0.png) no-repeat 0 0 / 100% 100%;
		margin: 0 4px 3px;
		cursor: pointer;
	}

	.login-remember-icon.remember {
		background-image: url(../../static/image/login-checked-1.png);
	}

	.login-button {
		height: 43px;
		background: url(../../static/image/login-button-bg.png) no-repeat 0 0 / 100% 100%;
		text-align: center;
		line-height: 43px;
		font-size: 22px;
		color: #010a16;
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
		margin-bottom: 5px;
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
		bottom: 10px;
		text-align: center;
		font-size: 16px;
		color: #000000;
	}
</style>

<style>
	.login-form .ant-form-explain {
		min-height: 30px;
		margin-top: 0;
		margin-bottom: 0;
	}
</style>
