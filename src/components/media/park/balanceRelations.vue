<template>
	<div class="media-warp" :style="{right: isMove ? '-480px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">企业平衡关系</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">企业平衡关系</div>
		<div class="media-warp-chart">
			<div id="balance" class="chart"></div>
		</div>
		<a-modal dialogClass="media-modal-dialog" v-model="visible" title="企业平衡关系" :width="1000" centered
			:footer="null">
			<div class="media-modal-tabbs">
				<div class="media-modal-tab" :style="{backgroundColor: active == 0 ? '#238bf3' : ''}"
					@click="active = 0">平衡企业</div>
				<div class="media-modal-tab" :style="{backgroundColor: active == 1 ? '#238bf3' : ''}"
					@click="active = 1">不平衡企业</div>
			</div>
			<div class="media-modal-table">
				<a-row class="header">
					<a-col :span="3">
						序号
					</a-col>
					<a-col :span="10">
						企业名称
					</a-col>
					<a-col :span="5">
						企业联系人
					</a-col>
					<a-col :span="6">
						企业联系人电话
					</a-col>
				</a-row>
				<div class="body">
					<a-row class="row hover" v-for="(item,index) in active == 0 ? balanceCompanys : unBalanceCompanys" :key="index">
						<a-col :span="3">
							{{index + 1}}
						</a-col>
						<a-col :span="10">
							{{item.companyName}}
						</a-col>
						<a-col :span="5">
							{{item.companyResponsibleLeader}}
						</a-col>
						<a-col :span="6">
							{{item.companyResponsibleLeaderPhone}}
						</a-col>
					</a-row>
					<a-row class="row"
						v-for="n in active == 0 ? 10 - balanceCompanys.length > 0 ? 10 - balanceCompanys.length : 0 : 10 - unBalanceCompanys.length > 0 ? 10 - unBalanceCompanys.length : 0" :key="active == 0 ? balanceCompanys.length + n : unBalanceCompanys + n">
						<a-col :span="3"></a-col>
						<a-col :span="10"></a-col>
						<a-col :span="5"></a-col>
						<a-col :span="6"></a-col>
					</a-row>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import {
		companyTotal
	} from '@/request/api'

	import HighCharts from 'highcharts'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				visible: false,
				active: '',
				balanceCompanys: [],
				unBalanceCompanys: [],
				option: {
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
								format: '{point.name}数: <b style=" color: {point.color};font-size: 34px"> {point.y} </b>家 ',
								style: {
									"color": "#2085ca",
									"fontSize": "15px",
									"fontWeight": "500",
									"textOutline": "none"
								},
							},
							events: {
								click: (event) => {
									if (!this.visible) {
										this.visible = true
										const name = event.point.name
										if (name == '平衡企业') {
											this.active = 0
										} else{
											this.active = 1
										}
									}
								}
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
		methods: {
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
			companyTotal({
				regionID: global.regionID,
			}).then(res => {
				if (res.status === '0') {
					this.balanceCompanys = res.result.balanceCompanys
					this.unBalanceCompanys = res.result.unBalanceCompanys
					this.option.series[0].data[0] = {
						name: '平衡企业',
						y: res.result.balanceNumber,
						color: '#00f1f6'
					}
					this.option.series[0].data[1] = {
						name: '不平衡企业',
						y: res.result.unBalanceNumber,
						color: '#ca2020'
					}
					HighCharts.chart('balance', this.option)
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
		right: 20px;
		top: 47px;
		width: 480px;
		height: 410px;
		background: url(../../../../static/image/fixed5.png) no-repeat left bottom / 100% 390px;
		transition: right 1s;
		-webkit-transition: right 1s;
		/* Safari */

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
				height: 219px;
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

<style lang="less">
	.media-modal-dialog {
		border: 1px solid #3e4874;
		padding-bottom: 0;

		.ant-modal-header {
			background-color: #000a3b;
			border-color: #3e4874;
		}

		.ant-modal-close,
		.ant-modal-title {
			color: #fff;
		}

		.ant-modal-content {
			background-color: rgba(14, 26, 81, 0.8);
		}

		.ant-modal-body {
			padding: 15px;
		}
	}

	.media-modal-tab {
		display: inline-block;
		line-height: 32px;
		height: 32px;
		text-align: center;
		color: #cccccc;
		padding: 0 15px;
		margin-right: 15px;
		background-color: #154279;
		cursor: pointer;
	}

	.media-modal-table {
		color: #fff;
		text-align: center;
		margin-top: 15px;

		.header {
			background-color: #154279;

			.ant-col {
				height: 35px;
				line-height: 35px;
			}
		}

		.body {
			height: 311px;
			overflow-y: scroll;
			scrollbar-width: none;
			-ms-overflow-style: none;

			&::-webkit-scrollbar {
				display: none;
			}
		}

		.row {
			background-color: rgba(38, 68, 111, 0.8);
			border: 1px solid #0690c5;
			
			&.hover:hover{
				background-color: rgba(6, 144, 197, 0.8);
			}

			&+.row {
				border-top: none;
			}

			.ant-col {
				height: 30px;
				line-height: 30px;
			}
		}
	}
</style>
