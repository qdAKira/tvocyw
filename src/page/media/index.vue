<template>
	<div class="components-media">
		<!-- 顶部 -->
		<div class="components-media-heaher">
			<div class="title">
				<!-- <div class="link-cell left" v-if="roleID != 3">
					<router-link class="link-a" :class="{active: active == 0}"
						:style="{color: active == 0 ? '#00ecf6' : ''}" :to="{name:'home'}" @click.native="active = 0">首页
					</router-link>
					<router-link class="link-a" :class="{active: active == 1}"
						:style="{color: active == 1 ? '#00ecf6' : ''}" :to="{name: 'sewage'}"
						@click.native="active = 1">污水监控
					</router-link>
					<router-link class="link-a" :class="{active: active == 2}"
						:style="{color: active == 2 ? '#00ecf6' : ''}" :to="{name: 'rain'}" @click.native="active = 2">
						雨水监控
					</router-link>
				</div> -->
				<span>空气质量在线监测平台</span>
				<!-- <div class="link-cell" v-if="roleID != 3">
					<router-link class="link-a" :class="{active: active == 3}"
						:style="{color: active == 3 ? '#00ecf6' : ''}" :to="{name: 'balance'}"
						@click.native="active = 3">水平衡
					</router-link>
					<router-link class="link-a" :class="{active: active == 4}"
						:style="{color: active == 4 ? '#00ecf6' : ''}" :to="{name: 'surfaceWater'}"
						@click.native="active = 4">地表水
					</router-link>
					<router-link class="link-a" :class="{active: active == 5}"
						:style="{color: active == 5 ? '#00ecf6' : ''}" :to="{name: 'video'}" @click.native="active = 5">
						视频监控
					</router-link>
				</div> -->
			</div>
			<div class="date">
				<iframe v-if="roleID != 3" width="150" height="65" frameborder="0" scrolling="no" hspace="0"
					src="https://i.tianqi.com/?c=code&a=getcode&id=6&color=%2300e4fd&py=nantong&icon=1"></iframe>
			</div>
			<div class="message">
				<iframe v-if="roleID == 3" width="250" height="30" frameborder="0" scrolling="no" hspace="0"
					src="https://i.tianqi.com/?c=code&a=getcode&id=34&color=%2300e4fd&py=nantong&icon=1"></iframe>
				<span>{{chineseUserName}}</span>
			</div>
			<div class="edit" @click="edit"></div>
			<div class="back" @click="back"></div>
		</div>
		<!-- 内容区 -->
		<Home></Home>
		<router-view />
	</div>
</template>

<script>
		// 处理时间
	import moment from "moment"
	// 引入首页
	import Home from '@/page/media/home.vue'
	export default {
		components:{
			Home
		},
		data() {
			return {
				active: 0,
				isFull: false,
				fullShow: true,
				islocaled: false,
				dateTime: new Date(),
				roleID: global.roleID,
				chineseUserName: global.chineseUserName
			};
		},
		created() {
			setInterval(() => {
				this.dateTime = new Date()
			}, 1000)

			// const pathName = this.$route.name

			// switch (pathName) {
			// 	case 'home':
			// 		this.active = 0
			// 		break;
			// 	case 'sewage':
			// 		this.active = 1
			// 		break;
			// 	case 'rain':
			// 		this.active = 2
			// 		break;
			// 	case 'balance':
			// 		this.active = 3
			// 		break;
			// 	case 'surfaceWater':
			// 		this.active = 4
			// 		break;
			// 	case 'video':
			// 		this.active = 5
			// 		break;
			// 	default:
			// 		break;
			// }
		},
		methods: {
			back() {
				this.$router.push('/monitor/data/enterprise')
			},
			edit() {
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
			}
		},
		filters: {
			timeFilter(val) {
				return moment(val).format('YYYY年MM月DD日 dddd')
			}
		}
	};
</script>

<style scoped lang="less">
	.components-media {
		// width: 100vw;
		// height: 100vh;
		width: 1920px;
		height: 1080px;
		background-color: #061a4a;
		min-width: 1920px;
		min-height: 1080px;
	}
// 顶部样式
	.components-media-heaher {
		position: relative;
		background-image: url(../../../static/image/media-head.png);
		background-size: 100% 100%;
		height: 117px;
		padding-top: 18px;

		.title {
			font-size: 36px;
			color: #ffffff;
			text-align: center;
			display: flex;
			align-items: flex-start;
			justify-content: center;
			height: 100%;
			padding-bottom: 11px;

			&>span {
				width: 445px;
				margin: 0 50px;
			}

			.link-cell {
				align-self: flex-end;
				height: 50px;
				display: flex;
				align-items: center;
				margin-bottom: 10px;

				.link-a {
					position: relative;
					line-height: 50px;
					width: 120px;
					height: 100%;
					font-size: 20px;
					color: #fff;
					text-align: center;
					margin-right: 20px;
					margin-left: 0;

					&:hover {
						color: #00ecf6;
					}

					&.active::before {
						content: "";
						position: absolute;
						right: -10px;
						top: 0;
						bottom: 0;
						width: 2px;
						background-color: #00ffff;
						transform: skewX(-42deg);
					}

					&.active::after {
						content: "";
						position: absolute;
						left: 0;
						top: 0;
						right: 0;
						bottom: 0;
						background-image: linear-gradient(rgba(0, 236, 246, 0.5), transparent);
						transform: skewX(-42deg);
					}
				}

				&.left {

					.link-a {
						margin-left: 20px;
						margin-right: 0;

						&::before {
							left: -10px;
							right: initial;
							transform: skewX(42deg);
						}

						&::after {
							transform: skewX(42deg);
						}
					}
				}
			}
		}

		.date {
			font-size: 24px;
			color: #00e4fd;
			position: absolute;
			left: 75px;
			bottom: 0;
		}

		.message {
			display: flex;
			align-items: center;
			font-size: 24px;
			color: #00e4fd;
			position: absolute;
			right: 30px;
			bottom: 0;
			padding-bottom: 5px;

			&>span {
				align-self: flex-end;
				padding-bottom: 7px;
			}
		}

		.edit {
			position: absolute;
			top: 5px;
			right: 29px;
			width: 61px;
			height: 61px;
			background: url(../../../static/icon/exit.png) no-repeat 0 0 / cover;
			cursor: pointer;
		}

		.back {
			position: absolute;
			top: 5px;
			left: 29px;
			width: 61px;
			height: 61px;
			background: url(../../../static/icon/back-icon.png) no-repeat 0 0 / cover;
			cursor: pointer;
		}
	}

	.components-media-warp {
		position: relative;
		width: 100%;
		height: calc(100% - 117px);
		overflow: hidden;
	}

	.componets-media-full {
		position: absolute;
		bottom: 350px;
		right: 530px;
		z-index: 100;
		cursor: pointer;//地图上小手

		&.location {
			bottom: 50px;
			right: 50px;
		}
	}
</style>
