<template>
	<div class="components-media-container" id="map">
		<div class="componets-map-search">
			<a-select v-model="company" show-search placeholder="输入名称" option-filter-prop="children" style="width: 100%"
				:dropdownStyle="dropdownStyle" :filter-option="filterOption" @change="handleChange">
				<a-select-option class="media-search-option" :value="item" v-for="(item,index) in companyList"
					:key="index">{{item}}</a-select-option>
			</a-select>
		</div>
		<div class="components-park-state">
			<div class="cell">企业污水排口点位</div>
		</div>
		<div class="components-park-mark">
			<div class="cell">
				<img src="../../../static/icon/mark_icon_sewage-2.png" alt="">
				污水排口
			</div>
		</div>
		<a-modal dialogClass="media-modal-dialog" v-model="visible" :title="title" :width="1800" centered :footer="null"
			destroyOnClose @cancel="onCancel">
			<div class="media-modal-body sewage">
				<div class="media-modal-tabbs">
					<div class="media-modal-tab" :class="{'active': tabActive == 0}" @click="tabChange(0)">实时监控</div>
					<div class="media-modal-tab" :class="{'active': tabActive == 1}" @click="tabChange(1)">实时历史数据</div>
					<div class="media-modal-tab" :class="{'active': tabActive == 2}" @click="tabChange(2)">分钟数据</div>
					<div class="media-modal-tab" :class="{'active': tabActive == 3}" @click="tabChange(3)">小时数据</div>
					<div class="media-modal-tab" :class="{'active': tabActive == 4}" @click="tabChange(4)">日数据</div>
					<div class="media-modal-tab" :class="{'active': tabActive == 5}" @click="tabChange(5)">月数据</div>
					<div class="media-modal-tab" :class="{'active': tabActive == 6}" @click="tabChange(6)">年数据</div>
					<div style="float: right;" v-show="tabActive > 0">
						<a-date-picker v-model="startValue" :disabled-date="disabledStartDate" format="YYYY-MM-DD"
							placeholder="开始日期" />
						<a-date-picker style="margin-left: 10px;" v-model="endValue" :disabled-date="disabledEndDate"
							format="YYYY-MM-DD" placeholder="结束日期" />
						<a-button style="float: right;margin-left: 10px;" type="primary" @click="search">查询</a-button>
					</div>
				</div>
				<a-table :rowClassName="rowClassName" :columns="columns" :data-source="data" size="small"
					:customHeaderRow="customHeaderRow" :customRow="customRow" :rowKey="record => record.id"
					:loading="loading" :pagination="pagination" @change="pageChange">
					<span slot="number" slot-scope="text, record, index">
						{{index + 1 }}
					</span>
				</a-table>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import AMap from 'AMap'
	import moment from "moment"

	import {
		holePosition,
		monitorTimeData,
		monitorOldData,
		monitorMinuteData,
		monitorHourData,
		monitorDayData,
		monitorMonthData,
		monitorYearData
	} from '@/request/api'

	export default ({
		components: {},
		props: {},
		data() {
			return {
				visible: false,
				active: 1,
				title: '',
				code: '',
				companyId: '',
				info: {},
				list: [],
				instantsHeader: [],
				parkBalanceOne: '',
				parkBalanceTwo: '',
				oneNormal: 0,
				oneAbnormal: 0,
				twoNormal: 0,
				twoAbnormal: 0,
				dayAlarmNumber: 0,
				dayProcessNumber: 0,
				dropdownStyle: {
					backgroundColor: '#26446f',
					boxShadow: '0 2 px 8 px rgba(6, 144, 197, 0.15)'
				},
				companyList: [],
				holeList: [],
				company: [],
				map: null,
				markerList: [],
				title: '',
				columns: [],
				columnsDefault: [{
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
					title: '检测时间',
					dataIndex: 'monitorTimeText',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}],
				tabActive: 0,
				loading: false,
				data: [],
				pagination: {
					defaultPageSize: 10,
					pageSize: 10,
					current: 1,
					total: 0,
					hideOnSinglePage: true
				},
				param: {},
				startValue: null,
				endValue: null,
				startOpen: false,
				endOpen: false,
			}
		},
		created() {},
		methods: {
			async init() {
				this.map = new AMap.Map('map', {
					mapStyle: global.mapStyle,
					center: [121.06404, 32.541833],
					viewMode: '3D',
					pitch: 30,
					resizeEnable: true,
					zoom: 14.55,
					isHotspot: false
				})

				const result = await holePosition({
					regionID: global.regionID,
				}).then(res => {
					if (res.status === '0') {
						return res.result
					} else {
						console.log(res.message)
					}
				})

				this.holeList = result
				const companyList = result.map(item => item.companyName)
				this.companyList = [...new Set(companyList)]

				result.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_sewage-2.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.companyName + '：' + item.holeName
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})


				this.map.add(this.markerList)

				this.markerList.forEach((item, index) => {
					AMap.event.addListener(item, 'click', () => {
						this.title = item.w.companyName + '-' + item.w.holeName
						this.visible = true
						this.param.holeID = item.w.holeID
						this.param.HoleID = item.w.holeID
						this.startValue = null
						this.endValue = null
						this.param.StartTime = null
						this.param.EndTime = null
						this.param.PageIndex = this.pagination.current - 1
						this.param.PageSize = this.pagination.pageSize
						this.getData(this.tabActive, this.param)
					});
				})
			},
			filterOption(input, option) {
				return (
					option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
				);
			},
			handleChange(value) {
				this.markerList.forEach(item => {
					if (item.Ce.companyName == value) {
						item.show()
					} else {
						item.hide()
					}
				})
				this.map.setFitView(null, true)
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
			rowClassName(record, index) {
				return 'warning-table-row'
			},
			tabChange(i) {
				if (this.tabActive != i) {
					this.data = []
					this.columns = []
					this.tabActive = i
					this.pagination.current = 1
					this.pagination.total = 0
					this.startValue = null
					this.endValue = null
					this.param.StartTime = this.startValue
					this.param.EndTime = this.endValue
					this.param.PageIndex = this.pagination.current - 1
					this.param.PageSize = this.pagination.pageSize
					this.getData(i, this.param)
				}
			},
			pageChange(pagination) {
				this.param.PageIndex = pagination.current - 1
				this.param.PageSize = pagination.pageSize
				this.getData(this.tabActive, this.param, pagination)
			},
			search() {
				this.data = []
				this.columns = []
				this.pagination.current = 1
				this.pagination.total = 0
				this.param.StartTime = this.startValue ? moment(this.startValue).format('YYYY-MM-DD') : null
				this.param.EndTime = this.endValue ? moment(this.endValue).format('YYYY-MM-DD') : null
				this.param.PageIndex = this.pagination.current - 1
				this.param.PageSize = this.pagination.pageSize
				this.getData(this.active, this.param)
			},
			getData(i, data, pagination) {
				this.columns = []
				this.columns = this.columns.concat(this.columnsDefault)
				this.loading = true
				switch (i) {
					case 0:
						this.getMonitorTime(data)
						break;
					case 1:
						this.getMonitorOld(data, pagination)
						break
					case 2:
						this.getMonitorMinute(data, pagination)
						break
					case 3:
						this.getMonitorHour(data, pagination)
						break
					case 4:
						this.getMonitorDay(data, pagination)
						break
					case 5:
						this.getMonitorMonth(data, pagination)
						break
					case 6:
						this.getMonitorYear(data, pagination)
						break
					default:
						break;
				}
			},
			disabledStartDate(startValue) {
				const endValue = this.endValue;
				if (!startValue || !endValue) {
					return false;
				}

				let endDate = moment(endValue._d).format('YYYY-MM-DD')
				endDate = new Date(endDate)
				const startDate = new Date(endDate.setMonth(endDate.getMonth() - 1))

				if (this.tabActive > 0 && this.tabActive < 4) {
					if (startValue.valueOf() > endValue.valueOf()) {
						return true
					} else {
						if (startDate.valueOf() > new Date(startValue._d.toLocaleDateString())) {
							return true
						} else {
							return false
						}
					}
				} else if (this.tabActive > 3) {
					if (startValue.valueOf() > endValue.valueOf()) {
						return true
					}
				}
			},
			disabledEndDate(endValue) {
				const startValue = this.startValue;
				if (!endValue || !startValue) {
					return false;
				}
				let startDate = moment(startValue._d).format('YYYY-MM-DD')
				startDate = new Date(startDate)
				const endDate = new Date(startDate.setMonth(startDate.getMonth() + 1))
				if (this.tabActive > 0 && this.tabActive < 4) {
					if (startValue.valueOf() >= endValue.valueOf()) {
						return true
					} else {
						if (endDate.valueOf() >= endValue.valueOf()) {
							return false
						} else {
							return true
						}
					}
				} else if (this.tabActive > 3) {
					if (startValue.valueOf() > endValue.valueOf()) {
						return true
					}
				}
			},
			// handleStartOpenChange(open) {
			// 	this.startOpen = open
			// 	console.log(this.startValue)
			// 	if (!open && !this.endValue && this.startValue) {
			// 		this.endOpen = true;
			// 	}
			// },
			// handleEndOpenChange(open) {
			// 	this.endOpen = open;
			// 	if (!open && !this.startValue && this.endValue) {
			// 		this.startOpen = true;
			// 	}
			// },
			getMonitorTime(data) {
				monitorTimeData(data).then(res => {
					if (res.status === '0') {
						this.columns.push({
							title: '在线状态',
							dataIndex: 'status',
							align: 'center',
							ellipsis: true,
							customHeaderCell: column => {
								return {
									style: {
										color: '#fff'
									}
								}
							}
						})
						Object.keys(res.result[0].polluteDict).forEach(key => {
							this.columns.push({
								title: key,
								dataIndex: key,
								align: 'center',
								customHeaderCell: column => {
									return {
										style: {
											color: '#fff'
										}
									}
								}
							})
						});
						res.result.forEach(item => {
							item = Object.assign(item, item.polluteDict)
						})
						this.data = res.result
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
			},
			getMonitorOld(data, pagination) {
				monitorOldData(data).then(res => {
					if (res.status === '0') {
						Object.keys(res.result.list[0].polluteDict).forEach(key => {
							this.columns.push({
								title: key,
								dataIndex: key,
								align: 'center',
								customHeaderCell: column => {
									return {
										style: {
											color: '#fff'
										}
									}
								}
							})
						});
						res.result.list.forEach(item => {
							item = Object.assign(item, item.polluteDict)
						})
						this.data = res.result.list
						if (pagination) {
							pagination.total = res.result.total
							this.pagination = pagination
						} else {
							this.pagination.total = res.result.total
						}
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
			},
			getMonitorMinute(data, pagination) {
				monitorMinuteData(data).then(res => {
					if (res.status === '0') {
						Object.keys(res.result.list[0].polluteDict).forEach(key => {
							this.columns.push({
								title: key,
								dataIndex: key,
								align: 'center',
								customHeaderCell: column => {
									return {
										style: {
											color: '#fff'
										}
									}
								}
							})
						});
						res.result.list.forEach(item => {
							item = Object.assign(item, item.polluteDict)
						})
						this.data = res.result.list
						if (pagination) {
							pagination.total = res.result.total
							this.pagination = pagination
						} else {
							this.pagination.total = res.result.total
						}
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
			},
			getMonitorHour(data, pagination) {
				monitorHourData(data).then(res => {
					if (res.status === '0') {
						Object.keys(res.result.list[0].polluteDict).forEach(key => {
							this.columns.push({
								title: key,
								dataIndex: key,
								align: 'center',
								customHeaderCell: column => {
									return {
										style: {
											color: '#fff'
										}
									}
								}
							})
						});
						res.result.list.forEach(item => {
							item = Object.assign(item, item.polluteDict)
						})
						this.data = res.result.list
						if (pagination) {
							pagination.total = res.result.total
							this.pagination = pagination
						} else {
							this.pagination.total = res.result.total
						}
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
			},
			getMonitorDay(data, pagination) {
				monitorDayData(data).then(res => {
					if (res.status === '0') {
						Object.keys(res.result.list[0].polluteDict).forEach(key => {
							this.columns.push({
								title: key,
								dataIndex: key,
								align: 'center',
								customHeaderCell: column => {
									return {
										style: {
											color: '#fff'
										}
									}
								}
							})
						});
						res.result.list.forEach(item => {
							item = Object.assign(item, item.polluteDict)
						})
						this.data = res.result.list
						if (pagination) {
							pagination.total = res.result.total
							this.pagination = pagination
						} else {
							this.pagination.total = res.result.total
						}
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
			},
			getMonitorMonth(data, pagination) {
				monitorMonthData(data).then(res => {
					if (res.status === '0') {
						Object.keys(res.result.list[0].polluteDict).forEach(key => {
							this.columns.push({
								title: key,
								dataIndex: key,
								align: 'center',
								customHeaderCell: column => {
									return {
										style: {
											color: '#fff'
										}
									}
								}
							})
						});
						res.result.list.forEach(item => {
							item = Object.assign(item, item.polluteDict)
						})
						this.data = res.result.list
						if (pagination) {
							pagination.total = res.result.total
							this.pagination = pagination
						} else {
							this.pagination.total = res.result.total
						}
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
			},
			getMonitorYear(data, pagination) {
				monitorYearData(data).then(res => {
					if (res.status === '0') {
						Object.keys(res.result.list[0].polluteDict).forEach(key => {
							this.columns.push({
								title: key,
								dataIndex: key,
								align: 'center',
								customHeaderCell: column => {
									return {
										style: {
											color: '#fff'
										}
									}
								}
							})
						});
						res.result.list.forEach(item => {
							item = Object.assign(item, item.polluteDict)
						})
						this.data = res.result.list
						if (pagination) {
							pagination.total = res.result.total
							this.pagination = pagination
						} else {
							this.pagination.total = res.result.total
						}
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
			},
			onCancel() {
				this.columns = []
				this.param = {}
				this.tabActive = 0
			}
		},
		mounted() {
			this.init()
		}
	})
</script>

<style scoped lang="less">
	.components-media-container {
		height: 100%;
	}

	.media-modal-tabbs {
		margin-bottom: 10px;
	}

	.media-modal-body {
		height: 520px;
	}

	.media-modal-form {
		padding: 0 10px;
		color: #fff;
	}

	.media-modal-cell {
		display: inline-block;
		width: 50%;
		height: 40px;
		line-height: 40px;
		border-bottom: 1px dashed #fff;
	}

	.media-modal-table {
		text-align: initial;

		// overflow-x: scroll;
		.body {
			height: auto;
		}

		.header {
			// min-width: 100%;
			// white-space: nowrap;
			display: flex;

			.th {
				display: inline-block;
				height: 35px;
				line-height: 35px;
				text-align: center;
			}
		}

		.row {
			// min-width: 100%;
			// white-space: nowrap;
			border: 0;
			display: flex;

			.td {
				display: inline-block;
				height: 30px;
				line-height: 30px;
				text-align: center;
			}
		}
	}

	.components-park-state {
		position: absolute;
		top: 15px;
		width: 355px;
		height: 40px;
		background: url(../../../static/image/state.png) no-repeat center center / 100% 100%;
		left: 0;
		right: 0;
		margin: 0 auto;
		padding: 0 15px;
		z-index: 100;
		cursor: default;

		.cell {
			height: calc(100% / 4);
			line-height: 40px;
			color: #00e8ff;
			text-align: center;
		}
	}

	.componets-map-search {
		position: absolute;
		left: 535px;
		top: 15px;
		width: 220px;
		z-index: 100;

		.message {
			color: #06dfff;
			line-height: 25px;
		}
	}

	.components-park-mark {
		position: absolute;
		top: 15px;
		width: 200px;
		border-radius: 10px;
		border: 2px dashed #0dbbe7;
		z-index: 100;
		right: 530px;

		.cell {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 50px;
			color: #00e8ff;
			padding: 0 30px 0 20px;

			&>img {
				margin-right: 10px;
			}
		}
	}

	.media-modal-tab {
		&.active {
			color: #fff;
			background-color: #238bf3;
		}
	}
</style>

<style lang="less">
	.componets-map-search {

		.ant-select,
		.ant-select-arrow {
			color: #fff
		}

		.ant-select-selection {
			background: #154279 url(../../../static/icon/search-icon.png) no-repeat 5px center / 20px auto;
			border-color: #0690c5;
		}

		.ant-select-selection__rendered {
			margin-left: 30px;
		}
	}

	.media-search-option {
		background-color: #26446f;
		color: #fff;

		&.ant-select-dropdown-menu-item-active:not(.ant-select-dropdown-menu-item-disabled),
		&.ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled) {
			background-color: #0465b5;
		}
	}

	.media-modal-body.sewage {
		min-height: 520px;
		height: auto;
	}
</style>
