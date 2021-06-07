<template>
	<div class="media-warp" :style="{left: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">视频处理终端运行情况</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">视频处理终端运行情况
		</div>
		<div class="media-warp-chart">
			<div id="water2" class="chart"></div>
		</div>
	</div>
</template>

<script>
	import {
		videoStatus
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				acvtive: 1,
				exportPercent: [],
				incomePercent: [],
				dom: null,
				color: [{
					a: '#8f071e',
					b: '#f85163'
				}, {
					a: '#03b235',
					b: '#01e842'
				}]
			}
		},
		created() {},
		methods: {
			resize() {
				this.dom.resize()
			},
			init(data, result) {
				let option = {
					grid: {
						top: 25,
						left: 60,
						bottom: 25,
						right: 30,
					},
					xAxis: {
						type: 'category',
						data: ['离线', '在线'],
						axisLine: {
							lineStyle: {
								color: '#8591b1'
							}
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							color: '#fff',
							interval: 0
						}
					},
					yAxis: {
						type: 'value',
						splitLine: {
							lineStyle: {
								color: '#8591b1'
							}
						},
						axisLabel: {
							color: '#fff'
						}
					},
					series: [{
						label: {
							show: true,
							formatter: '{c}',
							color: '#fff',
							align: 'center',
							position: 'top'
						},
						data: data,
						type: 'bar',
						barWidth: '67',
						itemStyle: {
							normal: {
								color: params => {
									return new this.$echarts.graphic.LinearGradient(0, 0,
										1, 0, [{
											offset: 0,
											color: this.color[params.dataIndex].a
										}, {
											offset: 1,
											color: this.color[params.dataIndex].b
										}])
								}
							}
						}
					}],
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
				};

				this.dom = this.$echarts.init(document.getElementById('water2'))
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
				videoStatus({
					regionID: global.regionID,
				}).then(res => {
					if (res.status === '0') {
						const data = [res.result.offNumber, res.result.onlineNumber]
						const result = res.result.balanceResult

						this.init(data, result)
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
		left: 20px;
		top: 225px;
		width: 505px;
		height: 240px;
		background: url(../../../../static/image/yxqk.png) no-repeat left bottom / 100% 220px;
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
