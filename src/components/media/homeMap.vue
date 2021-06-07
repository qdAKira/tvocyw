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
			<div class="cell">首页</div>
		</div>
		<div class="components-park-mark">
			<div class="cell">
				<img src="../../../static/icon/mark_icon_rain-2.png" alt="">
				雨水排口
			</div>
			<div class="cell">
				<img src="../../../static/icon/mark_icon_sewage-2.png" alt="">
				污水排口
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
				园区总排
			</div>
			<div class="cell">
				<img src="../../../static/icon/mark_icon_5.png" alt="">
				园区进口
			</div>
		</div>
	</div>
</template>

<script>
	import AMap from 'AMap'

	import {
		homePosition
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

				const result = await homePosition({
					regionID: global.regionID,
				}).then(res => {
					if (res.status === '0') {
						return res.result
					} else {
						console.log(res.message)
					}
				})

				Object.keys(result).forEach(key => {
					this.companyList = this.companyList.concat(result[key])
				})
				
				this.companyList = this.companyList.map(item => item.positionName)
				this.companyList = [...new Set(this.companyList)]

				result.rainHoleList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_rain-2.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.positionName + '：' + item.showName
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				result.sewageHoleList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_sewage-2.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.positionName + '：' + item.showName
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				result.fuBiaoList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_2.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.positionName
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				result.microList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_3.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.positionName
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				result.exportList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_4.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.positionName
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				result.incomeList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_5.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.positionName
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				this.map.add(this.markerList)
			},
			filterOption(input, option) {
				return (
					option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
				);
			},
			handleChange(value) {
				this.markerList.forEach(item => {
					if (item.Ce.positionName == value) {
						item.show()
					} else {
						item.hide()
					}
					this.map.setFitView(null, true)
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
