<template>
	<div class="media-warp" :style="{right: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">当前水质超标溯源</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">
			当前水质超标溯源
		</div>
		<div class="media-warp-chart">
			<div class="srcoll">
				<div class="type">
					未处理：<span style="color: #ff3333;">!</span>
				</div>
				<div>
					<div class="message" v-for="(item,index) in unProcessAlarm" :key="index">
						{{(index + 1) + '. ' + item.companyName + ' ' + item.companyHole + ' ' + item.alarmTimeText + ' ' + item.alarmContent}}
					</div>
				</div>
				<div class="type">
					已处理：
				</div>
				<div>
					<div class="message" v-for="(item,index) in processAlarm" :key="index">
						{{(index + 1) + '. ' + item.companyName + ' ' + item.companyHole + ' ' + item.alarmTimeText + ' ' + item.alarmContent}}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		alarms
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				unProcessAlarm: [],
				processAlarm: []
			}
		},
		created() {},
		methods: {
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
		},
		mounted() {
			alarms({
				companyID: global.companyID,
			}).then(res => {
				if (res.status === '0') {
					this.unProcessAlarm = res.result.unProcessAlarm
					this.processAlarm = res.result.processAlarm
				} else {
					console.log(res.message)
				}
			})
		}
	})
</script>

<style scoped lang="less">
	.media-warp {
		position: absolute;
		right: 20px;
		bottom: 25px;
		width: 505px;
		height: 925px;
		background: url(../../../../static/image/fixed-7.png) no-repeat left bottom / 100% 905px;
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
			padding: 20px 30px;

			.srcoll {
				height: 100%;
				overflow-y: scroll;
				scrollbar-width: none;
				-ms-overflow-style: none;
			}

			.srcoll::-webkit-scrollbar {
				display: none;
			}

			.type {
				font-size: 18px;
				line-height: 30px;
				color: #49b6db;
				margin-bottom: 10px;
			}

			.message {
				font-size: 18px;
				line-height: 30px;
				color: #49b6db;
				margin-bottom: 10px;
			}

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

			.chart {
				height: 100%;
			}
		}
	}
</style>
