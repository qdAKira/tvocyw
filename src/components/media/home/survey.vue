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
				color: [
					{
					a: '#0167e8',
					b: '#13ace8'
				},
				 {
					a: '#03b235',
					b: '#01e842'
				},
				 {
					a: '#ff6e02',
					b: '#ffff00'
				},
				 {
					a: '#020eff',
					b: '#9a9fff'
				},
				 {
					a: '#00b5cb',
					b: '#7ff2ff'
				},
				 {
					a: '#8f8a07',
					b: '#f8f24f'
				},
				 {
					a: '#8d078f',
					b: '#fb11ff'
				}
				]
			}
		},
		created() {},
		methods: {
			resize() {
				this.dom.resize()
			},
			init(series) {
				let option = {
					// 系列切换组件，点击图例，
					legend: {
						textStyle: {
							color: '#fff'
						},
						icon: 'rect',
						// right: 10,
						left:44,
						orient: 'horizontal', //图例列表的布局朝向
						itemGap: 50,
						// top: 218,
						top:185,
						// 图例图形宽度
						itemWith:15,
						itemHeight:15,
						// align:right,
						align:'left',
					},
					// 调整图表的布局
					grid: {
						top: 30,
						left: 60,
						bottom: 40,
						right: 50,
						// right: 50,
					},
					xAxis: {
						type: 'value',
						// 是否显示坐标轴轴线
						axisLine: {
							show: false
						},
						//是否显示坐标轴刻度
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
							// 富文本样式
							rich: {
								text: {
									width: 50,
									lineHeight: 25,
									align: 'center',
									color: '#fff'
								},
								img: {
									// width: 31,
									// height: 347,
									width: 25,
									height: 133,
									align: 'center',
									backgroundColor: {
										image: require('../../../../static/icon1/survey-x.png')
									}
								}
							}
						}
					},
					tooltip: {
						// 坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
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
									// align: 'left'
								},
								data: [obj[key]],
								type: 'bar',
								barGap: '70%',
								barWidth: '30',
								// barWidth: '25%',
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
						// 切割数组，取前3个
						this.init(series.splice(0,3))
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
						name = '排口数'
						break;
					case 'rainHoleNumber':
						name = '联网在线数'
						break;
					// case 'microSiteNumber':
					// 	name = '微型站'
					// 	break;
					// case 'fuBiaoSiteNumber':
					// 	name = '浮标站'
					// 	break;
					// case 'parkIncomeNumber':
					// 	name = '园区总进'
					// 	break;
					// case 'parkExportNumber':
					// 	name = '园区总排'
					// 	break;
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
		// height: 475px;
		height: 258px;
		// background: url(../../../../static/image/yzgk-hone.png) no-repeat left bottom / 100% 455px;
		background: url(../../../../static/icon1/yzgk-hone.png) no-repeat left bottom / 100% 238px;
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
