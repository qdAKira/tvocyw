<template>
	<div class="chart-box">
		<div id="income" class="chart-cell"></div>
		<div id="export" class="chart-cell"></div>
	</div>
</template>

<script>
	import HighCharts from 'highcharts'

	import {
		waterQuality
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				income: {
					chart: {
						type: 'pie', //饼图
						options3d: {
							enabled: true, //使用3d功能
							alpha: 60, //延y轴向内的倾斜角度
						},
						backgroundColor: 'transparent',
					},
					title: {
						text: ''
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							depth: 75,
							dataLabels: {
								enabled: true,
								format: '{point.name}: {point.percentage:.1f}% ',
								style: {
									"color": "#06dfff",
									"fontSize": "15px",
									"fontWeight": "500",
									"textOutline": "none"
								},
							}
						}
					},
					series: [{
						type: 'pie',
						name: '数量', //统一的前置词,非必须
						data: [],
						dataLabels: {
							softConnector: false,
						}
					}],
					tooltip: {
						padding: 10
					},
					credits: {
						enabled: false
					},
				},
				export: {
					chart: {
						type: 'pie', //饼图
						options3d: {
							enabled: true, //使用3d功能
							alpha: 60, //延y轴向内的倾斜角度
						},
						backgroundColor: 'transparent',
					},
					title: {
						text: ''
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							depth: 75,
							dataLabels: {
								enabled: true,
								format: '{point.name}: {point.percentage:.1f}% ',
								style: {
									"color": "#06dfff",
									"fontSize": "15px",
									"fontWeight": "500",
									"textOutline": "none"
								},
							}
						}
					},
					series: [{
						type: 'pie',
						name: '数量', //统一的前置词,非必须
						data: [],
						dataLabels: {
							softConnector: false,
						}
					}],
					tooltip: {
						padding: 10
					},
					credits: {
						enabled: false
					},
				}
			}
		},
		created() {},
		methods: {},
		mounted() {
			waterQuality({
				companyID: 3,
			}).then(res => {
				if (res.status === '0') {
					this.export.series[0].data = res.result.exportPercent.map(item => ({
						name: item.typeName,
						y: item.numberPercent
					}))
					
					this.income.series[0].data = res.result.incomePercent.map(item => ({
						name: item.typeName,
						y: item.numberPercent
					}))

					HighCharts.chart('export', this.export)
					HighCharts.chart('income', this.income)
				} else {
					console.log(res.message)
				}
			})
		}
	})
</script>

<style scoped lang="less">
	.chart-box {
		height: 100%;

		.chart-cell {
			display: inline-block;
			width: 50%;
			height: 100%;
		}
	}
</style>
