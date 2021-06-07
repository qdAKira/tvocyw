<template>
	<a-form :form="form" class="login-form" @submit="handleSubmit">
		<a-form-item>
			<a-input v-decorator="[
	          'UserName',
	          { rules: [{ required: true, message: 'Please input your username!' }] },
	        ]"
			 placeholder="Username">
				<a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
			</a-input>
		</a-form-item>
		<a-form-item>
			<a-input v-decorator="[
	          'Password',
	          { rules: [{ required: true, message: 'Please input your Password!' }] },
	        ]"
			 type="password" placeholder="Password">
				<a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
			</a-input>
		</a-form-item>
		<a-form-item>
			<a-checkbox v-decorator="[
	          'remember',
	          {
	            valuePropName: 'checked',
	            initialValue: true,
	          },
	        ]">
				Remember me
			</a-checkbox>
			<a class="login-form-forgot" href="">
				Forgot password
			</a>
			<a-button type="primary" html-type="submit" class="login-form-button">
				Login
			</a-button>
		</a-form-item>
	</a-form>
</template>
<script>
	let sha1 = require('sha1')

	import {
		apiLogin,
		getTokenApi,
		getRegionName
	} from '@/request/api'

	export default {
		data() {
			return {};
		},
		beforeCreate() {
			this.form = this.$form.createForm(this, {
				name: 'normal_login'
			});
		},
		created() {
			// getTokenApi({
			// 	"ClientId": "client",
			// 	"ClientSecret": "123456",
			// 	"Scope": "SWSApi"
			// }).then(res => {
			// 	console.log(res)
			// })
		},
		methods: {
			handleSubmit(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						this.$message.loading({
							content: '登录中...',
							key: 'loading'
						})
						values.Password = sha1(values.Password).toUpperCase()
						localStorage.setItem('token', '')
						const data = {
							UserName: values.UserName,
							Password: values.Password
						}
						apiLogin(data).then(res => {
							if (res.status == 0) {
								localStorage.setItem('token', res.result.token)
								localStorage.setItem('regoins', JSON.stringify(res.result.regoins))
								global.regoins = JSON.parse(localStorage.getItem('regoins'))
								this.$message.success({
									content: res.message,
									key: 'loading',
									duration: 1,
									onClose: () => {
										this.$router.push(this.$route.query.redirect)
									}
								})
							} else {
								this.$message.error({
									content: res.message,
									key: 'loading',
									duration: 1
								})
							}
						})
					}
				});
			},
		},
	};
</script>
