<template>
	<div class="media-warp" :style="{bottom: isMove ? '-316px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">园区企业进/出水占比</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">园区企业进/出水占比</div>
		<div class="media-warp-chart">
			<div class="tabs">
				<div :class="{active: acvtive == 1}" @click="tabChange(1)">出水</div>
				<div :class="{active: acvtive == 2}" @click="tabChange(2)">进水</div>
			</div>
			<div id="water" class="chart"></div>
		</div>
	</div>
</template>

<script>
	import {
		totalPercent
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
				option: {
					tooltip: {
						trigger: 'item',
						formatter: '{b} : {c} ({d}%)'
					},
					series: {
						type: 'pie',
						radius: [0, 90],
						center: ['40%', '60%'],
						roseType: 'radius',
						label: {
							color: '#00e8ff',
							formatter: '{b}: {d}%'
						},
						data: [],
						color: ['#e66f6f', '#e0a415', '#e02315', '#cb6f16', '#3dacf0', '#15e040']
					}
				}
			}
		},
		created() {},
		methods: {
			tabChange(i) {
				this.acvtive = i
				this.option.series.data = this.acvtive == 1 ? this.exportPercent : this.incomePercent
				this.dom.setOption(this.option)
				this.dom.resize()
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
			this.dom = this.$echarts.init(document.getElementById('water'))

			totalPercent({
				regionID: global.regionID,
			}).then(res => {
				if (res.status === '0') {
					this.incomePercent = res.result.incomePercent.map(item => ({
						name: item.typeName,
						value: item.percentValue
					}))

					this.exportPercent = res.result.exportPercent.map(item => ({
						name: item.typeName,
						value: item.percentValue
					}))

					this.option.series.data = this.acvtive == 1 ? this.exportPercent : this.incomePercent
					this.dom.setOption(this.option)
					this.dom.resize()

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
		left: 555px;
		bottom: 26px;
		width: 400px;
		height: 316px;
		background: url(../../../../static/image/fixed4.png) no-repeat left bottom / 100% 300px;
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
