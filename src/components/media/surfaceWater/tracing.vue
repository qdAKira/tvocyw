<template>
	<div class="media-warp" :style="{right: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">地表水超标溯源</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">
			地表水超标溯源
		</div>
		<div class="media-warp-chart">
			<div class="tabs">
				<div :class="{active: acvtive == 1}" @click="tabChange(1)">区内</div>
				<div :class="{active: acvtive == 2}" @click="tabChange(2)">区外</div>
			</div>
			<div class="message">
				<template v-for="item in list">
					<div class="title">{{item.wellName}}超标：<span style="color: #ff0404;">!</span></div>
					<div class="flex">
						关联{{acvtive == 1 ? '排口' : '河道'}}：
						<div>
							<div v-for="name in item.name" v-if="acvtive == 1">{{name.companyHole}}</div>
							<div v-for="name in item.outsideName">{{name}}</div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		insideOver,
		outsideOver
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				list: [],
				acvtive: 1,
				balanceName: [],
				unBalanceName: []
			}
		},
		created() {},
		methods: {
			tabChange(i) {
				this.acvtive = i
				if (i == 1) {
					this.getInsideOver()
				} else{
					this.getOutsideOver()
				}
			},
			myMoveIn() {
				this.isMove = true;
				this.$emit('fullLoacl', true)
				setTimeout(() => {
					this.opacity = 1
				}, 1000)
			},
			myMoveOut() {
				this.opacity = 0
				this.$emit('fullLoacl', false)
				setTimeout(() => {
					this.isMove = false
				}, 250)
			},
			getInsideOver() {
				this.list = []
				insideOver().then(res => {
					if (res.status === '0') {
						this.list = res.result
					} else {
						console.log(res.message)
					}
				})
			},
			getOutsideOver() {
				this.list = []
				outsideOver().then(res => {
					if (res.status === '0') {
						this.list = res.result
					} else {
						console.log(res.message)
					}
				})
			}
		},
		mounted() {
			this.getInsideOver()
		}
	})
</script>

<style scoped lang="less">
	.media-warp {
		position: absolute;
		right: 20px;
		top: 10px;
		width: 490px;
		height: 925px;
		background: url(../../../../static/image/surface-water.png) no-repeat left bottom / 100% 905px;
		transition: right 1s;
		-webkit-transition: right 1s;

		&-title {
			width: 238px;
			height: 40px;
			margin: 0 auto;
			background: url(../../../../static/image/fixed1-headr.png) no-repeat center center / 100% 100%;
			font-size: 18px;
			line-height: 40px;
			color: #49b6db;
			text-align: center;
			cursor: pointer;

			&.active {
				height: 238px;
				width: 40px;
				background: url(../../../../static/image/fixed1-headr-active.png) no-repeat center center / 100% 100%;
				color: #49b6db;
				text-align: center;
				writing-mode: vertical-lr;
				position: absolute;
				left: -45px;
				top: 0;
				bottom: 0;
				opacity: 0;
				transition: opacity 0.5s;
				-webkit-transition: opacity 0.5s;
				margin: auto;
			}
		}

		&-chart {
			height: calc(100% - 40px);
			position: relative;
			padding: 30px 0 0 0;

			.tabs {
				position: absolute;
				top: 10px;
				right: 10px;
				display: flex;
				width: 110px;
				height: 26px;
				border-radius: 8px;
				background-color: #06247d;
				z-index: 100;
				margin-bottom: 10px;

				div {
					flex: 1;
					height: 100%;
					font-size: 16px;
					line-height: 26px;
					color: #fff;
					text-align: center;
					cursor: pointer;
				}

				.active {
					width: 66px;
					background-color: #13ecce;
					border-radius: 9px;
					flex: none;
					color: #000;
				}
			}

			.message {
				height: 100%;
				padding: 20px 30px;
				color: #04bcdb;
				font-size: 18px;
				line-height: 30px;
				overflow-y: scroll;
				scrollbar-width: none;
				-ms-overflow-style: none;

				&::-webkit-scrollbar {
					display: none;
				}

				.flex {
					display: flex;
					margin-bottom: 30px;
				}
			}

			.table {
				margin-top: 14px;
				color: #fff;
				height: 780px;
				overflow-y: scroll;

				&-thead {
					display: flex;
					background-color: rgba(9, 46, 152, 0.5);
				}

				&-tr {
					display: flex;

					&:nth-child(even) {
						background-color: rgba(9, 46, 152, 0.5);
					}
				}

				&-th,
				&-td {
					height: 30px;
					line-height: 30px;
					text-align: center;
				}

				.index {
					width: 100px;
				}

				.name {
					flex: 1;
					text-align: left;
					padding-left: 20px;
				}

				.number {
					width: 110px;
				}

				&::-webkit-scrollbar {
					background-color: #051e6b;
					border: solid 1px #0690c5;
				}

				&::-webkit-scrollbar-thumb {
					border-radius: 10px;
					background: #238bf3 url(../../../../static/image/scrollbar-icon.png) no-repeat center center / 13px 10px;
				}
			}
		}
	}
</style>
