<template>
	<div class="media-warp" :style="{bottom: isMove ? '-316px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">当前设备工作状态</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">当前设备工作状态</div>
		<div class="media-warp-chart">
			<div id="device" class="chart">
				<div id="valve"></div>
				<div id="access"></div>
				<div id="line"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		deviceStatus
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				dom: null,
				value: [],
			}
		},
		created() {},
		methods: {
			resize() {
				this.dom.resize()
			},
			init(name, data1, data2, id) {
				let option = {
					legend: {
						textStyle: {
							color: '#fff'
						},
						bottom: 5,
					},
					grid: {
						top: 5,
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
									align: 'left',
									color: '#fff'
								},
								img: {
									width: 12,
									height: 25,
									align: 'center',
									backgroundColor: {
										image: require('../../../../static/icon/jt.png')
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
					series: [{
						name: name == '在线状态' ? '在线' : name + '开',
						data: [data1],
						type: 'bar',
						barGap: '50%',
						// smooth: true,
						// symbol: 'none',
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
						name: name == '在线状态' ? '离线' : name + '关',
						data: [data2],
						type: 'bar',
						// smooth: true,
						// symbol: 'none',
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

				this.dom = this.$echarts.init(document.getElementById(id))
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
			deviceStatus({
				regionID: global.regionID,
			}).then(res => {
				if (res.status === '0') {
					this.init('阀门', res.result.valveStatusOn, res.result.valveStatusOff, 'valve')
					this.init('门禁', res.result.accessStatusOn, res.result.accessStatusOff, 'access')
					this.init('在线状态', res.result.online, res.result.offline, 'line')
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
		right: 530px;
		bottom: 26px;
		width: 400px;
		height: 316px;
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
				padding: 20px 0 30px;

				&>div {
					height: calc(100% / 3);
				}
			}
		}
	}
</style>
