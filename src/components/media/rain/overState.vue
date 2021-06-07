<template>
	<div class="media-warp" :style="{right: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">近3月私自打开阀门报警统计</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">
			近3月私自打开阀门报警统计
		</div>
		<div class="media-warp-chart">
			<div id="water5" class="chart"></div>
		</div>
		<a-modal dialogClass="media-modal-dialog" v-model="visible" :title="title" :width="1800" centered
			:footer="null" destroyOnClose>
			<div class="media-modal-body">
				<a-table :rowClassName="rowClassName" :columns="columns" :data-source="data" size="small"
					:customHeaderRow="customHeaderRow" :customRow="customRow">
					<span slot="number" slot-scope="text, record, index">
						{{index + 1 }}
					</span>
				</a-table>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import {
		overStatistics,
		openNumber,
		openList
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				list: [],
				visible: false,
				title: '',
				columns: [{
					title: '序号',
					dataIndex: 'number',
					scopedSlots: {
						customRender: 'number'
					},
					align: 'center',
					width: 50,
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '企业名称',
					dataIndex: 'companyName',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '排口名称',
					dataIndex: 'holeName',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '时间',
					dataIndex: 'timeText',
					align: 'center',
					ellipsis: true,
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '报警内容',
					dataIndex: 'alarmContent',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}],
				data: [],
			}
		},
		created() {},
		methods: {
			resize() {
				this.dom.resize()
			},
			init(datax, datay) {
				let option = {
					grid: {
						top: 20,
						left: 50,
						bottom: 40,
						right: 30,
					},
					xAxis: {
						type: 'category',
						data: datax,
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
					series: {
						barWidth: 60,
						data: datay,
						type: 'bar',
						itemStyle: {
							normal: {
								color: new this.$echarts.graphic.LinearGradient(0, 0,
									1, 0, [{
										offset: 0,
										color: '#8f071e'
									}, {
										offset: 1,
										color: '#f85163'
									}]),
							}
						}
					},
				};

				this.dom = this.$echarts.init(document.getElementById('water5'))
				
				this.dom.on('click', params => {
					this.visible = true
					this.title = params.name + '私自打开阀门报警统计'
					openList({
						RegionID: global.regionID,
						Month: params.name
					}).then(res => {
						if (res.status === '0') {
							this.data = res.result
						} else {
							console.log(res.message)
						}
					})
				});
				
				this.dom.setOption(option, true)
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
			},
			getDataIn() {
				openNumber({
					regionID: global.regionID,
				}).then(res => {
					if (res.status === '0') {
						const datax = res.result.map(item => item.xDate)
						const datay = res.result.map(item => item.yValue)

						this.init(datax, datay)
						this.resize()

					} else {
						console.log(res.message)
					}
				})
			},
			customHeaderRow(column, index) {
				return {
					style: {
						backgroundColor: '#154279'
					}
				}
			},
			customRow(record, index) {
				return {
					style: {
						color: '#fff',
						backgroundColor: 'rgba(38, 68, 111, 0.8)'
					},
				}
			},
			rowClassName(record, index){
				return 'warning-table-row'
			},
		},
		mounted() {
			this.getDataIn()
		}
	})
</script>

<style scoped lang="less">
	.media-warp {
		position: absolute;
		right: 20px;
		bottom: 25px;
		width: 490px;
		height: 440px;
		background: url(../../../../static/image/drainage-state.png) no-repeat left bottom / 100% 422px;
		transition: right 1s;
		-webkit-transition: right 1s;

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
				left: -45px;
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

			.chart {
				height: 100%;
			}
		}
	}
</style>
