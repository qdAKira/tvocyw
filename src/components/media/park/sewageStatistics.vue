<template>
	<div class="media-warp" :style="{bottom: isMove ? '-318px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">污水处理厂本年总进/总出</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">污水处理厂本年总进/总出
		</div>
		<div class="media-warp-chart">
			<div id="sewage" class="chart"></div>
		</div>
	</div>
</template>

<script>
	import {
		sewageFactory
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
		created() {},
		methods: {
			resize() {
				this.dom.resize()
			},
			init(dataIn, dataOut) {
				let option = {
					legend: {
						textStyle: {
							color: '#fff'
						},
						bottom: 15
					},
					grid: {
						top: 25,
						left: 50,
						bottom: 70,
						right: 30,
					},
					xAxis: {
						type: 'category',
						data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
						axisLine: {
							lineStyle: {
								color: '#fff'
							}
						},
						axisTick: {
							show: false
						},
					},
					yAxis: {
						type: 'value',
						axisLabel: {
							show: true,
							color: '#fff'
						},
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						}
					},
					axisPointer: {
						label: {
							backgroundColor: '#6a7985'
						}
					},
					series: [{
						name: '总进',
						data: dataIn,
						type: 'bar',
						smooth: true,
						symbol: 'none',
						itemStyle: {
							normal: {
								color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: '#0167e8'
								}, {
									offset: 1,
									color: '#13ace8'
								}]),
							}
						},
					}, {
						name: '总出',
						data: dataOut,
						type: 'bar',
						smooth: true,
						symbol: 'none',
						itemStyle: {
							normal: {
								color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: '#8f071e'
								}, {
									offset: 1,
									color: '#f85163'
								}]),
							}
						},
					}],
				};

				this.dom = this.$echarts.init(document.getElementById('sewage'))
				this.dom.setOption(option)
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
			}
		},
		mounted() {
			sewageFactory({
				regionID: global.regionID,
			}).then(res => {
				if (res.status === '0') {
					const dataIn = res.result.incomeTotal.map(item => item.number)
					const dataOut = res.result.exportTotal.map(item => item.number)

					this.init(dataIn, dataOut)
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
		bottom: 26px;
		width: 505px;
		height: 318px;
		background: url(../../../../static/image/fixed3.png) no-repeat left bottom / 100% 300px;
		transition: bottom 1s;
		-webkit-transition: bottom 1s;

		&-title {
			width: 219px;
			height: 40px;
			margin: 0 auto;
			background: url(../../../../static/image/fixed1-headr.png) no-repeat center center / 100% 100%;
			font-size: 18px;
			line-height: 40px;
			color: #49b6db;
			text-align: center;
			cursor: pointer;

			&.active {
				position: absolute;
				top: -45px;
				left: 0;
				right: 0;
				opacity: 0;
				transition: opacity 0.5s;
				-webkit-transition: opacity 0.5s;
				margin: auto;
			}
		}

		&-chart {
			height: calc(100% - 40px);

			.chart {
				height: 100%;
			}
		}
	}
</style>
