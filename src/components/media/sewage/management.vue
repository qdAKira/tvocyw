<template>
	<div class="media-warp" :style="{bottom: isMove ? '-316px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">当月超标处置情况</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">当月超标处置情况
		</div>
		<div class="media-warp-chart">
			<div id="water4" class="chart"></div>
		</div>
	</div>
</template>

<script>
	import {
		monthAlarmOver
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				dom: null,
				colorList: [{
					a: '#0167e8',
					b: '#13ace8'
				}, {
					a: '#03b235',
					b: '#01e842'
				}, {
					a: '#8f071e',
					b: '#f85163'
				}]
			}
		},
		created() {},
		methods: {
			resize() {
				this.dom.resize()
			},
			init(xData,series) {
				let option = {
					grid: {
						top: 20,
						left: 50,
						bottom: 40,
						right: 30,
					},
					xAxis: {
						type: 'category',
						data: xData,
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
					series: series,
				};

				this.dom = this.$echarts.init(document.getElementById('water4'))
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
			getDataIn() {
				monthAlarmOver({
					regionID: global.regionID,
				}).then(res => {
					if (res.status === '0') {
						let yData = []
						let xData = []
						res.result.forEach(item => {
							xData.push(item.xName)
							yData.push(item.yValue)
						})

						let series = {
							barWidth: 40,
							itemStyle: {
								normal: {
									color: params => {
										return new this.$echarts.graphic.LinearGradient(0, 0,
											1, 0, [{
												offset: 0,
												color: this.colorList[params.dataIndex].a
											}, {
												offset: 1,
												color: this.colorList[params.dataIndex].b
											}])
									},
								}
							},
							data: yData,
							type: 'bar'
						}

						this.init(xData,series)
						this.resize()

					} else {
						console.log(res.message)
					}
				})
			},
		},
		mounted() {
			this.getDataIn()
		}
	})
</script>

<style scoped lang="less">
	.media-warp {
		position: absolute;
		right: 535px;
		bottom: 25px;
		width: 400px;
		height: 316px;
		background: url(../../../../static/image/fixed4.png) no-repeat left bottom / 100% 300px;
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
