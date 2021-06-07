<template>
	<div class="media-warp" :style="{left: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">污水处理厂进出水统计</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">污水处理厂进出水统计
		</div>
		<div class="media-warp-chart">
			<a-range-picker class="media-range-picker" size="small" :allowClear="false"
				:default-value="[StartTime, EndTime]" :disabled-date="disabledDate" @change="onChange" />
			<div id="water2" class="chart"></div>
		</div>
	</div>
</template>

<script>
	import moment from "moment"

	import {
		waterNumber
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				acvtive: 1,
				StartTime: moment(new Date()).format('YYYY-MM-01'),
				EndTime: moment(new Date()).format('YYYY-MM-DD'),
				dom: null,
				color: [{
					a: '#0167e8',
					b: '#13ace8'
				}, {
					a: '#03b235',
					b: '#01e842'
				}, {
					a: '#8d078f',
					b: '#f251f8'
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
					grid: {
						top: 50,
						left: 60,
						bottom: 30,
						right: 50,
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
									width: 19,
									height: 89,
									align: 'center',
									backgroundColor: {
										image: require('../../../../static/icon/inflowAndOutflow-x.png')
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
			disabledDate(current) {
				// Can not select days after today and today
				return current && current > moment().endOf('day');
			},
			onChange(date, dateString) {
				this.getDataIn(dateString[0], dateString[1])
			},
			getDataIn(StartTime, EndTime) {
				waterNumber({
					regionID: global.regionID,
					StartTime: StartTime,
					EndTime: EndTime
				}).then(res => {
					if (res.status === '0') {
						const obj = res.result

						let series = []

						Object.keys(obj).forEach((key, index) => {
							series.push({
								name: key == 'incomeWater' ? '进水' : '出水',
								label: {
									show: true,
									formatter: '{a}量: {c}',
									color: '#fff',
									align: 'rgiht'
								},
								data: [obj[key]],
								type: 'bar',
								barGap: '50%',
								barWidth: '30%',
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
		},
		mounted() {
			this.getDataIn(this.StartTime, this.EndTime)
		},
		filters: {
			timeFilter(val) {
				return moment(val).format('YYYY-MM-DD')
			}
		}
	})
</script>

<style scoped lang="less">
	.media-warp {
		position: absolute;
		left: 20px;
		top: 240px;
		width: 505px;
		height: 205px;
		background: url(../../../../static/image/sewage-survey.png) no-repeat left bottom / 100% 185px;
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

	.media-range-picker {
		position: absolute;
		right: 20px;
		top: 10px;
		width: 250px;
		z-index: 100;
	}
</style>

<style lang="less">
	.media-range-picker {

		.ant-input {
			background-color: #0465b5;
			color: #fff;
			border-color: #0690c5;
		}

		.ant-calendar-range-picker-separator {
			color: #fff;
		}

		.ant-calendar-picker-clear {
			background-color: #0465b5;
		}
	}
</style>
