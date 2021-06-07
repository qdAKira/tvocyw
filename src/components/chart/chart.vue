<template>
	<div :id="ID" class="chart-map">
	</div>
</template>

<script>
	export default ({
		props: {
			value: {
				type: Array,
				default: []
			},
			type: {
				type: String,
				default: 'line'
			},
			title: {
				type: String,
				default: ''
			},
			unit: {
				type: String,
				default: ''
			},
			text: {
				type: String,
				default: ''
			},
			ID: {
				type: String,
				default: 'chart'
			}
		},
		data() {
			return {
				dom: null
			}
		},
		created() {},
		methods: {
			resize() {
				this.dom.resize()
			},
			setOption(value, type) {
				let xData = value.map(item => item.xDate)
				let yData = value.map(item => item.yValue)
				let option = {
					title: {
						text: this.title + this.text,
						subtext: '单位：' + this.unit
					},
					color: '#1890ff',
					grid: {
						left: '2%',
						right: '4%',
						bottom: '14%',
						top: '16%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						data: xData,
					},
					yAxis: {
						type: 'value',
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
					series: {
						name: this.title,
						data: yData,
						type: type,
						smooth: true,
						symbol: 'none',
					},
					"dataZoom": [{
							type: 'slider',
							show: true,
							start: 94,
							end: 100,
							handleSize: 8
						},
						{
							type: 'inside',
							start: 94,
							end: 100
						},
					],
				}
				this.dom = this.$echarts.init(document.getElementById(this.ID))
				this.dom.setOption(option)
			},
			init() {
				let xData = this.value.map(item => item.xDate)
				let yData = this.value.map(item => item.yValue)
				let option = {
					title: {
						text: this.title + this.text,
						subtext: '单位：' + this.unit
					},
					color: '#1890ff',
					grid: {
						left: '2%',
						right: '4%',
						bottom: '14%',
						top: '16%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						data: xData,
					},
					yAxis: {
						type: 'value',
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
					series: {
						name: this.title,
						data: yData,
						type: this.type,
						smooth: true,
						symbol: 'none',
					},
					"dataZoom": [{
							type: 'slider',
							show: true,
							start: 94,
							end: 100,
							handleSize: 8
						},
						{
							type: 'inside',
							start: 94,
							end: 100
						},
					],
				}
				this.dom = this.$echarts.init(document.getElementById(this.ID))
				this.dom.setOption(option)
			},
		},
		mounted() {
			this.$nextTick(() => {
					this.init();
					this.resize()
			})
		},
		watch: {
			value: {
				handler(newVal, oldVal) {
					if (this.dom) {
						if (newVal) {
							this.setOption(newVal, this.type)
						} else {
							this.setOption(oldVal, this.type)
						}
					} else {
						this.init()
					}
				},
				deep: true
			},
			type(newVal, oldVal) {
				if (this.dom) {
					if (newVal) {
						this.setOption(this.value, newVal)
					} else {
						this.setOption(this.value, oldVal)
					}
				} else {
					this.init()
				}
			}
		}
	})
</script>

<style>
</style>
