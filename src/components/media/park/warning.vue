<template>
	<div id="warning" class="chart"></div>
</template>

<script>
	import {
		getWarning
	} from '@/request/api'

	export default ({
		props: {
			id: {
				type: Number,
				default: ''
			}
		},
		data() {
			return {
				dom: null,
				value: []
			}
		},
		created() {},
		methods: {
			resize() {
				this.dom.resize()
			},
			init(xNames, yData1, yData2) {
				let option = {
					title: {
						text: '报警数及处理数统计列表（近半年）',
						top: 40,
						left: 'center',
						textStyle: {
							color: '#fff'
						}
					},
					legend: {
						textStyle: {
							color: '#fff'
						},
						top: 'middle',
						right: 45,
						orient: 'vertical',
					},
					grid: {
						top: 100,
						left: 60,
						bottom: 70,
						right: 150
					},
					xAxis: {
						type: 'category',
						data: xNames,
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
						name: '报警数',
						data: yData1,
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
					}, {
						name: '处理数',
						data: yData2,
						type: 'bar',
						smooth: true,
						symbol: 'none',
						itemStyle: {
							normal: {
								color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: '#04a02d'
								}, {
									offset: 1,
									color: '#00ff2a'
								}]),
							}
						},
					}],
				};

				this.dom = this.$echarts.init(document.getElementById('warning'))
				this.dom.setOption(option)
			}
		},
		mounted() {
			getWarning({
				id: this.id,
			}).then(res => {
				if (res.status === '0') {
					const xNames = res.result.alarmList.map(item => item.xDate)
					const yData1 = res.result.alarmList.map(item => item.yValue)
					const yData2 = res.result.processList.map(item => item.yValue)

					this.init(xNames, yData1, yData2)
					this.resize()

				} else {
					console.log(res.message)
				}
			})
		}
	})
</script>

<style scoped lang="less">
	.chart {
		height: 100%;
	}
</style>
