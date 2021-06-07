<template>
	<div class="media-warp" :style="{bottom: isMove ? '-454px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">本年外环境水质</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">本年外环境水质</div>
		<div class="media-warp-chart">
			<div class="media-warp-select">
				<a-select v-model="id" labelInValue placeholder="污染物因子" :dropdownStyle="dropdownStyle"
					style="width: 120px" @change="handleChange">
					<a-select-option v-for="item in factor" class="media-select-option" :value="item.id" :key="item.id">
						{{item.factorName}}</a-select-option>
				</a-select>
			</div>
			<div id="quality" class="chart"></div>
		</div>
	</div>
</template>

<script>
	import {
		pollutedFactorsByWell,
		factorTotal
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				dropdownStyle: {
					backgroundColor: '#26446f',
					boxShadow: '0 2 px 8 px rgba(6, 144, 197, 0.15)'
				},
				factor: [],
				id: []
			}
		},
		created() {
			pollutedFactorsByWell().then(res => {
				if (res.status === '0') {
					this.factor = res.result
					this.id = {
						key: this.factor[0].id,
						label: this.factor[0].factorName
					}
					this.handleChange(this.id)
				} else {
					console.log(res.message)
				}
			})
		},
		methods: {
			resize() {
				this.dom.resize()
			},
			init(data) {
				let option = {
					legend: {
						textStyle: {
							color: '#fff'
						},
						bottom: 15
					},
					grid: {
						top: 90,
						left: 50,
						right: 20,
						bottom: 80
					},
					xAxis: {
						type: 'category',
						data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
						show: true,
						axisLabel: {
							show: true,
							color: '#fff',
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#fff'
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: true,
							lineStyle: {
								type: 'dashed'
							}
						}
					},
					yAxis: {
						show: true,
						axisLabel: {
							show: true,
							color: '#fff'
						},
					},
					series: {
						name: this.id.label,
						data: data,
						type: 'line',
						smooth: true,
						symbol: 'circle',
						lineStyle: {
							color: '#15ebc9',
							width: 1,
							shadowColor: '#15ebc9',
							shadowBlur: 8
						},
						itemStyle: {
							color: '#15ebc9'
						},
						areaStyle: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [{
									offset: 0,
									color: 'rgba(0, 225, 192, 0.6)' // 0% 处的颜色
								}, {
									offset: 1,
									color: 'transparent' // 100% 处的颜色
								}],
								global: false // 缺省为 false
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
				}

				this.dom = this.$echarts.init(document.getElementById('quality'))
				this.dom.setOption(option)
			},
			handleChange(id) {
				factorTotal({
					factorID: id.key
				}).then(res => {
					if (res.status === '0') {
						const data = res.result.map(item => item.yValue)
						this.init(data)
						this.resize()
					} else {
						this.init([])
						console.log(res.message)
					}
				})
			},
			myMoveIn() {
				this.isMove = true;
				this.$emit('fullLoacl', true)
				setTimeout(() => {
					this.opacity = 1
				}, 1000)
			},
			myMoveOut() {
				this.opacity = 0
				this.$emit('fullLoacl', false)
				setTimeout(() => {
					this.isMove = false
				}, 250)
			}
		},
		mounted() {}
	})
</script>

<style scoped lang="less">
	.media-warp {
		position: absolute;
		right: 20px;
		bottom: 26px;
		width: 480px;
		height: 454px;
		background: url(../../../../static/image/fixed6.png) no-repeat left bottom / 100% 436px;
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
			position: relative;

			.chart {
				height: 100%;
			}
		}

		&-select {
			position: absolute;
			top: 5px;
			right: 20px;
			z-index: 100;
		}
	}
</style>

<style lang="less">
	.media-warp-select {

		.ant-select,
		.ant-select-arrow {
			color: #fff
		}

		.ant-select-selection {
			background-color: #154279;
			border-color: #0690c5;
		}
	}

	.media-select-option {
		background-color: #26446f;
		color: #fff;

		&.ant-select-dropdown-menu-item-active:not(.ant-select-dropdown-menu-item-disabled),
		&.ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled) {
			background-color: #0465b5;
		}
	}
</style>
