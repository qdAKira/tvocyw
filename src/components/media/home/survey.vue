<template>
	<div class="media-warp" :style="{left: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">园区概况</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">园区概况
		</div>
		<div class="media-warp-chart">
			<div id="water" class="chart"></div>
		</div>
	</div>
</template>

<script>
	import {
		parkTotal
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
					a: '#03b235',
					b: '#01e842'
				}, {
					a: '#ff6e02',
					b: '#ffff00'
				}, {
					a: '#020eff',
					b: '#9a9fff'
				}, {
					a: '#00b5cb',
					b: '#7ff2ff'
				}, {
					a: '#8f8a07',
					b: '#f8f24f'
				}, {
					a: '#8d078f',
					b: '#fb11ff'
				}]
			}
		},
		created() {},
		methods: {
			resize() {
				this.dom.resize()
			},
			init(series) {
				let option = {
					legend: {
						textStyle: {
							color: '#fff'
						},
						icon: 'rect',
						right: 10,
						orient: 'vertical',
						itemGap: 35,
						top: 45
					},
					grid: {
						top: 40,
						left: 60,
						bottom: 40,
						right: 100,
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
						data: [''],
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
								return '{img|' + '}';
							},
							rich: {
								text: {
									width: 50,
									lineHeight: 25,
									align: 'center',
									color: '#fff'
								},
								img: {
									width: 31,
									height: 347,
									align: 'center',
									backgroundColor: {
										image: require('../../../../static/icon/survey-h.png')
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
				parkTotal({
					regionID: global.regionID,
				}).then(res => {
					if (res.status === '0') {
						const obj = res.result

						let series = []

						Object.keys(obj).forEach((key, index) => {
							series.push({
								name: this.keyName(key),
								label: {
									show: true,
									formatter: '{c}',
									color: '#fff',
									align: 'rgiht'
								},
								data: [obj[key]],
								type: 'bar',
								barGap: '70%',
								barWidth: '30',
								itemStyle: {
									normal: {
										color: new this.$echarts.graphic.LinearGradient(0, 0,
											1, 0, [{
												offset: 0,
												color: this.color[index].a
											}, {
												offset: 1,
												color: this.color[index].b
											}]),
									}
								}
							})
						})

						this.init(series)
						this.resize()

					} else {
						console.log(res.message)
					}
				})
			},
			keyName(key) {
				let name = ''
				switch (key) {
					case 'companyNumber':
						name = '企业数'
						break;
					case 'sewageHoleNumber':
						name = '污水排口'
						break;
					case 'rainHoleNumber':
						name = '雨水排口'
						break;
					case 'microSiteNumber':
						name = '微型站'
						break;
					case 'fuBiaoSiteNumber':
						name = '浮标站'
						break;
					case 'parkIncomeNumber':
						name = '园区总进'
						break;
					case 'parkExportNumber':
						name = '园区总排'
						break;
					default:
						break;
				}
				
				return name
			}
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
		top: 10px;
		width: 505px;
		height: 475px;
		background: url(../../../../static/image/yzgk-hone.png) no-repeat left bottom / 100% 455px;
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
