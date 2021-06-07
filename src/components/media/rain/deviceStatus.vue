<template>
	<div class="media-warp" :style="{left: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">运行情况</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">运行情况</div>
		<div class="media-warp-chart">
			<div id="device" class="chart">
				<div id="drain"></div>
				<div id="collect"></div>
				<div id="rain"></div>
				<div id="line"></div>
			</div>
		</div>
			<div v-show="visible" class="equipment-modal-body equipment" ref="deviceStatus">
				<div class="equipment-modal-title">{{title + (title == '设备在线状态' ? '' : '运行情况')}}</div>
				<div class="equipment-modal-th">
					<a-row>
						<a-col :span="3">
							序号
						</a-col>
						<a-col :span="16">
							企业名称
						</a-col>
						<a-col :span="5" style="text-align: center;">
							<span style="cursor: pointer;" :style="{color: active == 0 ? '' : '#fff'}"
								@click="typeChange(0,title)">{{title == '设备在线状态' ? '在线' : title == '雨水收集池液位' ? '高' : '关'}}</span>/<span
								style="cursor: pointer;" :style="{color: active == 1 ? '' : '#fff'}"
								@click="typeChange(1,title)">{{title == '设备在线状态' ? '离线' : title == '雨水收集池液位' ? '低' : '开'}}</span>
						</a-col>
					</a-row>
				</div>
				<div class="equipment-modal-tr" v-for="(item,index) in list"
					v-if="index < current * 10 && index >= (current - 1) * 10">
					<a-row>
						<a-col :span="3">
							{{index + 1 - (current - 1) * 10}}
						</a-col>
						<a-col :span="16" style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
							{{item.companyName}}
						</a-col>
						<a-col :span="5" style="text-align: center;">
							{{item.runStatus}}
						</a-col>
					</a-row>
				</div>
				<a-pagination class="equipment-modal-page" simple size="small" :current="current" :total="list.length"
					@change="onChange" :pageSize="10" hideOnSinglePage />
			</div>
	</div>
</template>

<script>
	import {
		runStatus,
		runCompany
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				dom: null,
				value: [],
				visible: false,
				active: 0,
				title: '',
				StatusType: '',
				current: 1,
				total: 0,
				list: []
			}
		},
		created() {},
		methods: {
			confirm(){},
			cancel(){},
			resize() {
				this.dom.resize()
			},
			init(name, data1, data2, id) {
				let option = {
					legend: {
						textStyle: {
							color: '#fff'
						},
						icon: 'rect',
						bottom: 3,
					},
					grid: {
						top: 0,
						left: 100,
						bottom: 15,
						right: 80,
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
									fontSize: 11,
									align: 'left',
									verticalAlign: 'middle',
									color: '#fff'
								},
								img: {
									width: 12,
									height: 26,
									align: 'center',
									verticalAlign: 'middle',
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
						name: id == 'rain' ? '高' : id == 'line' ? '在线' : '关',
						data: [data1],
						type: 'bar',
						barWidth: 9,
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
						name: id == 'rain' ? '低' : id == 'line' ? '离线' : '开',
						data: [data2],
						type: 'bar',
						barWidth: 9,
						barGap: '50%',
						// smooth: true,
						// symbol: 'none',
						itemStyle: {
							normal: {
								color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: '#8f8a07'
								}, {
									offset: 1,
									color: '#ded700'
								}]),
							}
						},
					}],
				};

				this.dom = this.$echarts.init(document.getElementById(id))
				this.dom.setOption(option)
				this.dom.on('click', params => {
					this.active = params.seriesIndex
					this.title = params.name
					this.getRunCompany(params.name)

				});
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
			typeChange(i, name) {
				if (this.active != i) {
					this.list = []
					this.active = i
					this.current = 1
					this.getRunCompany(name)
				}
			},
			getRunCompany(name) {
				switch (name) {
					case '排水阀':
						name = 1
						break;
					case '收集池阀门':
						name = 2
						break;
					case '雨水收集池液位':
						name = 3
						break;
					case '设备在线状态':
						name = 4
						break;
					default:
						break;
				}

				runCompany({
					RegionID: global.regionID,
					StatusType: name,
					StatusCode: this.active
				}).then(res => {
					if (res.status === '0') {
						this.visible = true
						this.list = res.result
					} else {
						console.log(res.message)
					}
				})
			},
			onChange(current) {
				this.current = current;
			},
			onCancel() {
				this.current = 1
			}
		},
		mounted() {
			runStatus({
				regionID: global.regionID,
			}).then(res => {
				if (res.status === '0') {
					this.init('排水阀', res.result.drainValveClose, res.result.drainValveOpen, 'drain')
					this.init('收集池阀门', res.result.tankValveClose, res.result.tankValveOpen, 'collect')
					this.init('雨水收集池液位', res.result.tankLevelOpen, res.result.tankLevelClose, 'rain')
					this.init('设备在线状态', res.result.onlineStatusOn, res.result.onlineStatusOff, 'line')
					this.resize()
				} else {
					console.log(res.message)
				}
			})
			
			document.addEventListener('click', (e) => {
				if (this.$refs.deviceStatus) {
					if (!this.$refs.deviceStatus.contains(e.target)) {
						this.visible = false
						this.current = 1
					}
				}
			})
		}
	})
</script>

<style scoped lang="less">
	.media-warp {
		position: absolute;
		left: 20px;
		top: 225px;
		width: 505px;
		height: 265px;
		background: url(../../../../static/image/fixed3.png) no-repeat left bottom / 100% 245px;
		transition: left 1s;
		-webkit-transition: left 1s;

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

			.chart {
				height: 100%;
				padding: 0;

				&>div {
					height: calc(100% / 4);
				}
			}
		}
	}

	.equipment-modal-title {
		text-align: center;
		color: #49b6db;
		padding: 5px 0;
	}

	.equipment-modal-th {
		color: #49b6db;
		border-bottom: 1px solid rgba(255, 255, 255, 0.5);
	}

	.equipment-modal-tr {
		color: #fff;
		border-bottom: 1px solid rgba(255, 255, 255, 0.5);
	}

	.equipment-modal-page {
		text-align: center;
		color: #fff;
		margin-top: 5px;
	}

	.equipment-modal-body {
		height: 309px;
	
		&.equipment {
			padding: 0 15px 5px;
			background-color: rgba(38, 68, 111, 0.8);
			border-radius: 20px;
			border: solid 1px #00e8ff;
			top: 0;
			position: absolute;
			width: 400px;
			bottom: 0;
			right: -420px;
			margin: auto;
		}
	}
</style>
