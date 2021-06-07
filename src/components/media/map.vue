<template>
	<div class="components-media-container" id="map">
		<div class="componets-map-search">
			<a-select v-model="company" show-search placeholder="输入名称" option-filter-prop="children" style="width: 100%"
				:dropdownStyle="dropdownStyle" :filter-option="filterOption" @change="handleChange">
				<a-select-option class="media-search-option" :value="JSON.stringify(item)"
					v-for="(item,index) in companyList" :key="index">{{item.name}}</a-select-option>
			</a-select>
			<div class="message" style="margin-top: 5px;">当日报警数：<span style="color: #ca2020;">{{dayAlarmNumber}}</span>
				起</div>
			<div class="message">处理数：<span style="color: #06ff23;">{{dayProcessNumber}}</span> 起</div>
		</div>
		<div class="components-park-state">
			<div class="cell">园区整体水平衡关系一：<span
					:style="{color: parkBalanceOne == '平衡' ? '#06ff23' : '#ca2020'}">{{parkBalanceOne}}</span></div>
			<div class="cell">园区整体水平衡关系二：<span
					:style="{color: parkBalanceTwo == '平衡' ? '#06ff23' : '#ca2020'}">{{parkBalanceTwo}}</span></div>
			<div class="cell">当前外环境进口一水质，正常：<span style="color: #06ff23;">{{oneNormal}}</span>，异常：<span
					style="color: #ca2020;">{{oneAbnormal}}</span></div>
			<div class="cell">当前外环境进口二水质，正常：<span style="color: #06ff23;">{{twoNormal}}</span>，异常：<span
					style="color: #ca2020;">{{twoAbnormal}}</span></div>
		</div>
		<div class="components-park-mark">
			<div class="cell">
				<img src="../../../static/icon/mark_icon_1.png" alt="">
				污染源企业
			</div>
			<div class="cell">
				<img src="../../../static/icon/mark_icon_2.png" alt="">
				浮标站
			</div>
			<div class="cell">
				<img src="../../../static/icon/mark_icon_3.png" alt="">
				微型站
			</div>
			<div class="cell">
				<img src="../../../static/icon/mark_icon_4.png" alt="">
				园区总排图标
			</div>
			<div class="cell">
				<img src="../../../static/icon/mark_icon_5.png" alt="">
				园区总进图标
			</div>
		</div>
		<a-modal dialogClass="media-modal-dialog" v-model="visible" :title="title" :width="1400" centered :footer="null"
			destroyOnClose>
			<div class="media-modal-tabbs">
				<div class="media-modal-tab" :style="{backgroundColor: active == 0 ? '#238bf3' : ''}"
					@click="active = 0">自动监测</div>
				<template v-if="code == 1">
					<div class="media-modal-tab" :style="{backgroundColor: active == 1 ? '#238bf3' : ''}"
						@click="active = 1">状态及报警处置</div>
					<div class="media-modal-tab" :style="{backgroundColor: active == 2 ? '#238bf3' : ''}"
						@click="active = 2">各进出水占比</div>
				</template>
			</div>
			<div class="media-modal-body" v-show="active == 0">
				<div class="media-modal-form">
					<template v-if="code == 1">
						<div class="media-modal-cell">组织机构代码：{{info.organCode}}</div>
						<div class="media-modal-cell">企业负责人：{{info.companyResponsibleLeader}}</div>
						<div class="media-modal-cell">行业分类：{{info.industryType}}</div>
						<div class="media-modal-cell">负责人联系电话：{{info.companyResponsibleLeaderPhone}}</div>
						<div class="media-modal-cell">企业地址：{{info.addressName}}</div>
						<div class="media-modal-cell">区域：{{info.regionName}}</div>
					</template>
					<template v-else-if="code == 2">
						<div class="media-modal-cell">监测点名称：{{info.wellName}}</div>
						<div class="media-modal-cell">负责人：{{info.responsibleLeader}}</div>
						<div class="media-modal-cell">中心经度：{{info.longitude}}</div>
						<div class="media-modal-cell">中心纬度：{{info.latitude}}</div>
						<div class="media-modal-cell">地址：{{info.addressName}}</div>
					</template>
				</div>
				<div class="media-modal-table">
					<div class="header">
						<div class="th" style="width: 118px;">
							{{code == 1 ? '排口名称' : '监控点名称'}}
						</div>
						<div class="th" style="width: 150px;">
							实时数据时间
						</div>
						<div class="th" style="max-width: 101px;flex: 1;" v-for="item in instantsHeader"
							:key="item.factorName">
							{{item.factorName}}
						</div>
					</div>
					<div class="body">
						<div class="row" v-for="item in list" :key="item.mainMonitorID">
							<div class="td" style="width: 118px;">
								{{code == 1 ? item.holeName : item.wellName}}
							</div>
							<div class="td" style="width: 150px;">
								{{item.monitorTime}}
							</div>
							<div class="td" style="max-width: 101px;flex: 1;" v-for="ins in item.instants"
								:key="ins.factorName">
								{{ins.instantQuantity}}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="media-modal-body" v-show="active == 1">
				<warningChart :id="companyId" v-if="active == 1"></warningChart>
			</div>
			<div class="media-modal-body" v-show="active == 2">
				<waterChart v-if="active == 2"></waterChart>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import AMap from 'AMap'

	import warningChart from '@/components/media/park/warning.vue'
	import waterChart from '@/components/media/park/waterProp.vue'

	import {
		getParkData,
		getSignDetial,
		getWarning
	} from '@/request/api'

	export default ({
		components: {
			'warningChart': warningChart,
			'waterChart': waterChart
		},
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
				company: [],
				map: null,
				markerList: []
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

				const result = await getParkData({
					regionID: global.regionID,
				}).then(res => {
					if (res.status === '0') {
						return res.result
					} else {
						console.log(res.message)
					}
				})

				// this.companyList = result.companyList

				const companyList = result.companyList
				const fuBiaoList = result.fuBiaoList
				const wellList = result.wellList
				const parkExportList = result.parkExportList
				const parkIncomeList = result.parkIncomeList

				this.companyList = this.companyList.concat(companyList)
				this.companyList = this.companyList.concat(fuBiaoList)
				this.companyList = this.companyList.concat(wellList)
				this.companyList = this.companyList.concat(parkExportList)
				this.companyList = this.companyList.concat(parkIncomeList)

				this.parkBalanceOne = result.parkBalanceOne
				this.parkBalanceTwo = result.parkBalanceTwo
				this.oneNormal = result.oneNormal
				this.oneAbnormal = result.oneAbnormal
				this.twoNormal = result.twoNormal
				this.twoAbnormal = result.twoAbnormal
				this.dayAlarmNumber = result.dayAlarmNumber
				this.dayProcessNumber = result.dayAlarmNumber

				companyList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_1.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.name
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				fuBiaoList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_2.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.name
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				wellList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_3.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.name
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				parkExportList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_4.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.name
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				parkIncomeList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_5.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.name
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				this.map.add(this.markerList)
				this.map.setFitView(null, true)
				this.markerList.forEach((item, index) => {
					AMap.event.addListener(item, 'click', (e) => {
						this.openModal(e)
					});
				})
			},
			openModal(e) {
				this.active = 0
				this.info = []
				this.list = []
				this.instantsHeader = []
				this.visible = true
				this.title = e.target.Ce.title
				this.code = e.target.Ce.code
				getSignDetial({
					id: e.target.Ce.id,
					code: e.target.Ce.code
				}).then(res => {
					if (res.status === '0') {
						this.info = res.result
						this.list = e.target.Ce.code == 1 ? res.result.holes : res.result.wells
						if (this.list.length) {
							this.instantsHeader = e.target.Ce.code == 1 ? res.result.holes[0].instants : res
								.result
								.wells[0].instants
						}
					} else {
						console.log(res.message)
					}
				})

				if (e.target.Ce.code == 1) {
					this.companyId = e.target.Ce.id
				}

				this.markerList.forEach(item => {
					item.setAnimation('AMAP_ANIMATION_NONE')
				})
			},
			filterOption(input, option) {
				return (
					option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
				);
			},
			handleChange(value) {
				value = JSON.parse(value)

				this.map.setZoomAndCenter(16, [value.longitude, value.latitude])

				this.markerList.forEach(item => {
					item.setAnimation(item.Ce.id == value.id && item.Ce.code == value.code ?
						'AMAP_ANIMATION_BOUNCE' : 'AMAP_ANIMATION_NONE')
				})
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
		width: 445px;
		height: 120px;
		background: url(../../../static/image/state.png) no-repeat center center / 100% 100%;
		margin-left: -178px;
		left: 50%;
		padding: 0 15px;
		z-index: 100;
		cursor: default;

		.cell {
			height: calc(100% / 4);
			line-height: 30px;
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
		width: 150px;
		border-radius: 10px;
		border: 2px dashed #0dbbe7;
		z-index: 100;
		right: 515px;

		.cell {
			display: flex;
			align-items: center;
			height: 44px;
			color: #00e8ff;
			padding: 0 10px;

			&>img {
				margin-right: 10px;
			}
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
</style>
