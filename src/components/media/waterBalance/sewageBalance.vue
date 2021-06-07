<template>
	<div class="media-warp" :style="{left: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">污水处理厂平衡关系</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">污水处理厂平衡关系
		</div>
		<div class="media-warp-chart">
			<div id="water2" class="chart"></div>
		</div>
	</div>
</template>

<script>
	import {
		factoryBalanceResult
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
					a: '#248e04',
					b: '#a7ff84',
					c: '#6acb44',
					d: '#2c9603'
				}, {
					a: '#7f6128',
					b: '#ffe1a2',
					c: '#bfa368',
					d: '#7e642d'
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
					title: [{
						text: '单位：吨',
						left: 25,
						top: 20,
						textStyle: {
							color: '#fff',
							fontSize: 12
						}
					},{
						text: "平衡情况：{a|"+ result +"}",
						right: 25,
						top: 20,
						textStyle: {
							fontSize: 12,
							color: "#fff",
							align: 'right',
							rich: {
								a: {
									color: result == '不平衡' ? '#f12828' : '#0cff00'
								}
							}
						}
					}],
					grid: {
						top: 60,
						left: 60,
						bottom: 50,
						right: 30,
					},
					xAxis: {
						type: 'category',
						data: ['污水处理厂污水进口+雨水+自来水', '污水处理厂出水'],
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
						data: data,
						type: 'bar',
						barWidth: '60',
						itemStyle: {
							normal: {
								color: params => {
									return new this.$echarts.graphic.LinearGradient(0, 0,
										1, 0, [{
											offset: 0,
											color: this.color[params.dataIndex].a
										}, {
											offset: 0.5,
											color: this.color[params.dataIndex].b
										}, {
											offset: 0.74,
											color: this.color[params.dataIndex].c
										}, {
											offset: 1,
											color: this.color[params.dataIndex].d
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
				factoryBalanceResult({
					regionID: global.regionID,
				}).then(res => {
					if (res.status === '0') {
						const data = [res.result.factoryIncome, res.result.factoryExport]
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
		bottom: 25px;
		width: 505px;
		height: 470px;
		background: url(../../../../static/image/sewage-balance.png) no-repeat left bottom / 100% 450px;
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
