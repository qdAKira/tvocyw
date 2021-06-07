<template>
	<div class="media-warp" :style="{left: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">近半年污水雨水情况</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">
			近半年污水雨水情况
		</div>
		<div class="media-warp-chart">
			<div id="water3" class="chart"></div>
		</div>
	</div>
</template>

<script>
	import {
		exportTotal
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				dom: null,
			}
		},
		created() {
		},
		methods: {
			resize() {
				this.dom.resize()
			},
			init(xAxis, yData1, yData2) {
				let option = {
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: [{
							name: '污水总量',
							textStyle: {
								color: '#fff'
							}
						}, {
							name: '雨水总量',
							textStyle: {
								color: '#fff'
							}
						}],
						top: 10
					},
					grid: {
						left: '5%',
						right: '10%',
						bottom: '10%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: xAxis,
						axisTick: {
							show: false
						},
						axisLabel: {
							show: true,
							color: '#fff'
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#fff'
							}
						},
					},
					yAxis: {
						type: 'value',
						axisLabel: {
							show: true,
							color: '#fff'
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#fff'
							}
						},
						axisTick: {
							show: true,
							lineStyle: {
								color: '#fff'
							}
						},
					},
					series: [{
						name: '污水总量',
						type: 'line',
						stack: '总量',
						data: yData1,
						symbol: 'circle',
						itemStyle: {
							color: '#f39800'
						},
					}, {
						name: '雨水总量',
						type: 'line',
						stack: '总量',
						data: yData2,
						symbol: 'circle',
						itemStyle: {
							color: '#ec03f2'
						},
					}]
				};

				this.dom = this.$echarts.init(document.getElementById('water3'))
				this.dom.setOption(option, true)
			},
			myMoveIn() {
				this.isMove = true;
				setTimeout(() => {
					this.opacity = 1
				}, 1000)
			},
			myMoveOut() {
				this.opacity = 0
				setTimeout(() => {
					this.isMove = false
				}, 250)
			},
		},
		mounted() {
			this.init([], [], [])
			this.resize()
			exportTotal({
				companyID: global.companyID,
			}).then(res => {
				if (res.status === '0') {
					let xAxis = res.result.sewageTotal.map(item => item.monthDate)
					let yData1 = res.result.sewageTotal.map(item => item.number)
					let yData2 = res.result.rainTotal.map(item => item.number)
					this.init(xAxis, yData1, yData2)
					this.resize()
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
		left: 20px;
		bottom: 25px;
		width: 505px;
		height: 305px;
		background: url(../../../../static/image/fixed4.png) no-repeat left bottom / 100% 290px;
		transition: left 1s;
		-webkit-transition: left 1s;

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
				right: -45px;
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
