<template>
	<div class="media-warp" :style="{bottom: isMove ? '-316px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">监测设备数量</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">监测设备数量</div>
		<div class="media-warp-chart">
			<div id="water3" class="chart"></div>
		</div>
		<div v-show="visible" class="equipment-modal-body equipment" ref="equipment">
			<div class="equipment-modal-title">监测设备（COD）</div>
			<div class="equipment-modal-th">
				<a-row>
					<a-col :span="3">
						序号
					</a-col>
					<a-col :span="16">
						名称
					</a-col>
					<a-col :span="5" style="text-align: center;">
						<span style="cursor: pointer;" :style="{color: active == 0 ? '' : '#fff'}"
							@click="typeChange(0)">在线</span>/<span style="cursor: pointer;"
							:style="{color: active == 1 ? '' : '#fff'}" @click="typeChange(1)">离线</span>
					</a-col>
				</a-row>
			</div>
			<div class="equipment-modal-tr" v-for="(item,index) in (active ? offList : onlineList)"
				v-if="index < current * 10 && index >= (current - 1) * 10">
				<a-row>
					<a-col :span="3">
						{{index + 1 - (current - 1) * 10}}
					</a-col>
					<a-col :span="16" style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
						{{item.companyHole}}
					</a-col>
					<a-col :span="5" style="text-align: center;">
						{{item.onlineStatus}}
					</a-col>
				</a-row>
			</div>
			<a-pagination class="equipment-modal-page" simple size="small" :current="current"
				:total="active ? offList.length : onlineList.length" @change="onChange" :pageSize="10"
				hideOnSinglePage />
		</div>
	</div>
</template>

<script>
	import {
		deviceNumber,
		monitorStaus
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
						// formatter: '{b} : {c}'
						formatter: params => {
							return params.name + '：' + params.data.onlineNumber + '/' + params.value + '（在线/总数）'
						}
					},
					series: {
						type: 'pie',
						radius: [0, 90],
						center: ['50%', '50%'],
						roseType: 'radius',
						label: {
							color: '#49b6db',
							formatter: '{b}',
							fontSize: 18
						},
						data: [],
						color: ['#df1f20', '#9e8a6a', '#00ff00', '#2085ca', '#77c8ff', '#ccbe04', '#8820ca'],
						itemStyle: {
							shadowColor: 'rgba(0, 0, 0, 0.5)',
							shadowBlur: 10
						}
					}
				},
				visible: false,
				current: 1,
				total: 0,
				active: 0,
				onlineList: [],
				offList: []
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
			},
			onCancel() {
				this.current = 1
				this.active = 0
			},
			typeChange(i) {
				this.active = i
				this.current = 1
			},
			getMonitorStaus(id) {
				monitorStaus({
					regionID: global.regionID,
					factorID: id
				}).then(res => {
					if (res.status === '0') {
						this.visible = true
						this.offList = res.result.offList
						this.onlineList = res.result.onlineList

					} else {
						console.log(res.message)
					}
				})
			},
			onChange(current) {
				this.current = current;
			}
		},
		mounted() {
			this.dom = this.$echarts.init(document.getElementById('water3'))

			deviceNumber({
				regionID: global.regionID,
			}).then(res => {
				if (res.status === '0') {
					const series = res.result.map(item => ({
						name: item.factorName,
						value: item.number,
						id: item.factorID,
						onlineNumber: item.onlineNumber
					}))

					this.option.series.data = series
					this.dom.setOption(this.option)
					this.dom.resize()
					this.dom.on('click', params => {
						this.title = params.name
						this.getMonitorStaus(params.data.id)
					});

				} else {
					console.log(res.message)
				}
			})

			document.addEventListener('click', (e) => {
				if (this.$refs.equipment) {
					if (!this.$refs.equipment.contains(e.target)) {
						this.visible = false
						this.current = 1
						this.active = 0
					}
				}
			})
		}
	})
</script>

<style scoped lang="less">
	.media-warp {
		position: absolute;
		left: 560px;
		bottom: 25px;
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
			top: -315px;
			position: absolute;
			width: 400px;
			left: 0;
			right: 0;
			margin: auto;
		}
	}
</style>

<style lang="less">
	.equipment-modal-dialog {
		border-radius: 20px;
		border: solid 1px #00e8ff;
		padding-bottom: 0;
		overflow: hidden;

		.ant-modal-content {
			background-color: rgba(38, 68, 111, 0.8);
		}

		.ant-modal-body {
			padding: 0 15px 5px;
		}
	}

	.equipment-modal-page {
		text-align: center;
		color: #fff;

		a {
			color: #fff;
		}

		.ant-pagination-simple-pager input {
			background-color: #0d44bd;
		}

		.ant-pagination-simple-pager input:hover {
			border-color: #fff;
		}

		.ant-pagination-disabled .ant-pagination-item-link {
			color: #d6d9d9;
		}
	}
</style>
