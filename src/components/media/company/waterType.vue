<template>
	<div class="media-warp" :style="{left: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">进水口/出水口占比</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">进水口/出水口占比
		</div>
		<div class="media-warp-chart">
			<div class="tabs">
				<div :class="{active: acvtive == 1}" @click="tabChange(1)">进口</div>
				<div :class="{active: acvtive == 2}" @click="tabChange(2)">出口</div>
			</div>
			<div id="water" class="chart"></div>
		</div>
	</div>
</template>

<script>
	import {
		waterIncome,
		waterExport
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
					a: '#0167e8',
					b: '#13ace8'
				}, {
					a: '#8f071e',
					b: '#f85163'
				}, {
					a: '#01b466',
					b: '#4dfcaf'
				}, {
					a: '#c59501',
					b: '#ffd864'
				}, {
					a: '#a703d6',
					b: '#de6dff'
				}]
			}
		},
		created() {},
		methods: {
			resize() {
				this.dom.resize()
			},
			init(name, series) {
				let option = {
					grid: {
						top: 40,
						left: 90,
						bottom: 30,
						right: 20,
					},
					xAxis: {
						type: 'value',
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false,
						},
						axisLabel: {
							show: false,
						}
					},
					yAxis: {
						type: 'category',
						data: [name],
						axisLabel: {
							show: true,
							color: '#fff'
						},
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							formatter: (value) => {
								return '{text|' + value + '}{img|' + '}';
							},
							rich: {
								text: {
									width: 50,
									lineHeight: 25,
									align: 'center',
									color: '#fff'
								},
								img: {
									width: 29,
									height: 196,
									align: 'center',
									backgroundColor: {
										image: require('../../../../static/icon/jt-d.png')
									}
								}
							}
						}
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

				this.dom = this.$echarts.init(document.getElementById('water'))
				this.dom.setOption(option,true)
			},
			tabChange(i) {
				this.acvtive = i
				if (this.acvtive == 1) {
					this.getDataIn()
				} else {
					this.getDataOut()
				}
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
				waterIncome({
					companyID: global.companyID,
				}).then(res => {
					if (res.status === '0') {
						let series = res.result.map((item, index) => {
							return {
								name: item.waterType,
								label: {
									show: true,
									formatter: '{a}',
									color: '#fff',
									align: 'rgiht'
								},
								data: [item.waterQuantity],
								type: 'bar',
								barGap: '50%',
								itemStyle: {
									normal: {
										color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
											offset: 0,
											color: this.color[index].a
										}, {
											offset: 1,
											color: this.color[index].b
										}]),
									}
								},
							}
						})

						this.init('进口', series)
						this.resize()

					} else {
						console.log(res.message)
					}
				})
			},
			getDataOut() {
				waterExport({
					companyID: global.companyID,
				}).then(res => {
					if (res.status === '0') {
						let series = res.result.map((item, index) => {
							return {
								name: item.waterType,
								label: {
									show: true,
									formatter: '{a}',
									color: '#fff',
									align: 'rgiht'
								},
								data: [item.waterQuantity],
								type: 'bar',
								barGap: '50%',
								itemStyle: {
									normal: {
										color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
											offset: 0,
											color: this.color[index].a
										}, {
											offset: 1,
											color: this.color[index].b
										}]),
									}
								},
							}
						})

						this.init('出口', series)
						this.resize()

					} else {
						console.log(res.message)
					}
				})
			}
		},
		mounted() {
			this.tabChange(this.acvtive)
		}
	})
</script>

<style scoped lang="less">
	.media-warp {
		position: absolute;
		left: 20px;
		top: 0;
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
