<template>
	<div class="components-media-container" id="map">
		<div class="componets-map-search">
			<a-select v-model="company" show-search placeholder="输入名称" option-filter-prop="children" style="width: 100%"
				:dropdownStyle="dropdownStyle" :filter-option="filterOption" @change="handleChange">
				<a-select-option class="media-search-option" :value="item.w.wellName" v-for="(item,index) in markerList"
					:key="index">{{item.w.wellName}}</a-select-option>
			</a-select>
		</div>
		<div class="components-park-state">
			<div class="cell">地表水点位</div>
		</div>
		<div class="components-park-mark">
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
		<a-modal dialogClass="media-modal-dialog" v-model="visible" :title="glTitle" :width="350" centered
			:footer="null" destroyOnClose>
			<div class="media-modal-body">
				<div class="map-window-sjbox">
					<div class="map-window-sjbox__cell" :style="{width: index ? '50%' : '100%',}"
						v-for="(item,index) in glRelationList"> {{item.name}} ：{{item.value}}
						{{index ? item.unitName : ''}}</div>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import AMap from 'AMap'

	import {
		surfacePosition,
		pointDetail,
		holeData
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
				glMarkers: [],
				glRelationList: [],
				glTitle: ''
			}
		},
		created() {
			let _this = this;
			window.closeInfoWindow = _this.closeInfoWindow;
			window.look = _this.look;
		},
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

				const result = await surfacePosition().then(res => {
					if (res.status === '0') {
						return res.result
					} else {
						console.log(res.message)
					}
				})

				result.fuBiaoList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_2.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.wellName
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				result.microList.forEach(item => {
					item.icon = require(item.wellName == '微型站5号' ?
						'../../../static/icon/mark_icon_3__d.png' :
						'../../../static/icon/mark_icon_3.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.wellName
					if (item.title == '微型站5号') {
						item.animation = 'AMAP_ANIMATION_BOUNCE'
					}
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				result.exportList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_4.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.wellName
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				result.incomeList.forEach(item => {
					item.icon = require('../../../static/icon/mark_icon_5.png')
					item.position = new AMap.LngLat(item.longitude, item.latitude)
					item.title = item.wellName
					const marker = new AMap.Marker(item);
					this.markerList.push(marker)
				})

				this.map.add(this.markerList)

				this.markerList.forEach((item, index) => {
					// let info = this.info[index]
					pointDetail({
						WellID: item.w.wellID,
						PointNatureID: item.w.pointNatureID
					}).then(res => {
						if (res.status === '0') {
							const relationList = res.result.relationList
							const valueList = res.result.valueList

							const infoWindow = new AMap.InfoWindow({
								isCustom: true,
								content: this.createInfoWindow(item.w.title, relationList,
									valueList).join(''),
								offset: new AMap.Pixel(230, 200)
							});

							AMap.event.addListener(item, 'click', () => {
								if (item.w.title == '微型站5号') {
									this.markerList.forEach(item => {
										if (item.w.title == '微型站5号') {
											item.show()
										} else {
											item.hide()
										}
									})
									this.glMarkers = []

									relationList.forEach(item => {
										item.icon = require( item.isUnusual ? '../../../static/icon/glicon.png' : '../../../static/icon/glicon2.png')
										item.position = new AMap.LngLat(item.longitude, item.latitude)
										item.title = item.companyHole
										const marker = new AMap.Marker(item);
										this.glMarkers.push(marker)
									})

									this.map.add(this.glMarkers)
								}
								infoWindow.open(this.map, item.getPosition());
							});

						} else {
							console.log(res.message)
						}
					})



				})

			},
			filterOption(input, option) {
				return (
					option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
				);
			},
			handleChange(value) {
				this.markerList.forEach(item => {

					if (item.w.wellName == value) {
						this.map.setZoomAndCenter(16, [item.w.longitude, item.w.latitude])
					}
					item.setAnimation(item.w.wellName == value && item.w.code == value.code ?
						'AMAP_ANIMATION_BOUNCE' : 'AMAP_ANIMATION_NONE')
				})
			},
			createInfoWindow(title, relationList, valueList) {
				const clearInfoWindow = this.closeInfoWindow()

				var content = []
				content.push('<div class="map-window">')
				content.push('<div class="map-window-title">' + title + '</div>')
				content.push('<div class="map-window-sjt">实时数据</div>')
				if (valueList.length) {
					content.push('<div class="map-window-sjbox">')
					valueList.forEach((item, index) => {
						content.push('<div class="map-window-sjbox__cell" style="width: ' + (index ? '50%' :
							'100%') + '">' + item.name + '：' + item.value + (index ? item.unitName :
							'') + '</div>')
					})
					content.push('</div>')
				}
				content.push('<div class="map-window-pk">')
				content.push('<div class="map-window-pkt">关联排口：</div>')
				content.push('<div class="map-window-pkbox">')
				relationList.forEach((item, index) => {
					content.push('<div class="map-window-pkbox__cell" style="color: ' + (item.isUnusual ?
						'red' : '') + ';">' + item.companyHole)
					if (item.isUnusual) {
						content.push('<span onclick="look(' + item.holeID + ')">查看</span>')
						// content.push('<span onclick="look(' + JSON.stringify(item) + ')">查看</span>')
					}
					content.push('</div>')
				})
				content.push('</div>')
				content.push('</div>')
				content.push('<div class="map-window-close" onclick="closeInfoWindow()"></div>')
				content.push('</div>')

				return content
			},
			closeInfoWindow() {
				this.map.clearInfoWindow();
				this.map.remove(this.glMarkers);
				this.markerList.forEach(item => {
					item.show()
				})
			},
			look(id) {
				this.glRelationList = []
				holeData({
					holeID: id,
				}).then(res => {
					if (res.status === '0') {
						this.glTitle = '（疑似影响）排口数据'
						this.glRelationList = res.result
						this.visible = true
					} else {
						console.log(res.message)
					}
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
		height: auto;

		.map-window-sjbox {
			margin-left: 0;
		}
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
		right: 535px;

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

	.map-window {
		width: 450px;
		border-radius: 20px;
		border: solid 1px #00e8ff;
		background-color: rgba(38, 68, 111, 0.9);
		padding: 5px 20px;
		position: relative;

		&-title {
			font-size: 18px;
			font-weight: bold;
			line-height: 27px;
			text-align: center;
			color: #00f1f6;
		}

		&-sjt {
			font-size: 16px;
			line-height: 27px;
			color: #ffffff;
			margin-bottom: 3px;
		}

		&-sjbox {
			display: flex;
			flex-wrap: wrap;
			color: #fff;
			font-size: 14px;
			margin-left: 25px;
			border-left: 1px solid #fff;
			border-top: 1px solid #fff;

			&__cell {
				height: 20px;
				display: flex;
				align-items: center;
				padding-left: 6px;
				border-right: 1px solid #fff;
				border-bottom: 1px solid #fff;
			}
		}

		&-pk {
			color: #fff;
			font-size: 14px;
			display: flex;
			align-items: flex-start;
			line-height: 20px;
			margin-top: 5px;
		}

		&-pkbox {
			flex: 1;
		}

		&-close {
			position: absolute;
			top: 12px;
			right: 12px;
			width: 18px;
			height: 18px;
			background: url(../../../static/icon/close.png) no-repeat center center / 100% 100%;
			cursor: pointer;
		}
	}

	.map-window-pkbox__cell {
		display: flex;
		align-items: center;
		justify-content: space-between;

		&>span {
			cursor: pointer;
			color: #00ffb4;
		}
	}
</style>
