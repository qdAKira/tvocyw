<template>
	<div class="media-warp" :style="{bottom: isMove ? '-316px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">企业水平衡情况</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">企业水平衡情况
		</div>
		<div class="media-warp-chart">
			<div class="tabs">
				<div :class="{active: acvtive == 1}" @click="tabChange(1)">基本平衡</div>
				<div :class="{active: acvtive == 2}" @click="tabChange(2)">不平衡</div>
			</div>
			<div class="table">
				<div class="table-thead">
					<div class="table-th index">序号</div>
					<div class="table-th name">企业名称</div>
				</div>
				<div class="table-tbody">
					<div class="table-tr" v-for="(item,index) in acvtive == 1 ? balanceName : unBalanceName">
						<div class="table-td index" v-if="index < 8">{{index + 1}}</div>
						<div class="table-td name">{{item.name}}</div>
						<div class="table-td look"><span @click="look(item)">查看</span></div>
					</div>
					<div class="table-tr" v-for="n in (8 - (acvtive == 1 ? balanceName.length : unBalanceName.length))">
						<div class="table-td index"></div>
						<div class="table-td name"></div>
						<div class="table-td number"></div>
					</div>
				</div>
			</div>
		</div>
		<a-modal dialogClass="media-modal-dialog" v-model="visible" :title="companyName + '-水平衡情况'" :width="1720"
			centered :footer="null" destroyOnClose>
			<div class="media-modal-body">
				<div class="media-jinkou">
					<div class="cell" v-for="item in incomeDetailList">
						<div class="waterType">{{item.waterType}}:</div>
						<div class="waterQuantity">{{item.waterQuantity}}(吨)</div>
					</div>
				</div>
				<div class="media-chukou">
					<div class="cell" v-for="item in exportDetailList">
						<div class="waterType">{{item.waterType}}:</div>
						<div class="waterQuantity">{{item.waterQuantity}}(吨)</div>
					</div>
				</div>
				<div class="incomeWaterTotal">{{incomeWaterTotal}}(吨)</div>
				<div class="exportWaterTotal">{{exportWaterTotal}}(吨)</div>
				<div class="error">{{balanceError}}</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import {
		companyBalance,
		balanceDetail
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				list: [],
				acvtive: 1,
				balanceName: [],
				unBalanceName: [],
				companyName: '',
				visible: false,
				incomeDetailList: [],
				incomeWaterTotal: 0,
				exportDetailList: [],
				exportWaterTotal: 0,
				balanceError: ''
			}
		},
		created() {},
		methods: {
			tabChange(i) {
				this.acvtive = i
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
			look(data) {
				this.visible = true
				this.companyName = data.name
				balanceDetail({
					RegionID: global.regionID,
					CompanyID: data.id
				}).then(res => {
					if (res.status === '0') {
						this.incomeDetailList = res.result.incomeDetailList
						this.incomeWaterTotal = res.result.incomeWaterTotal
						this.exportDetailList = res.result.exportDetailList
						this.exportWaterTotal = res.result.exportWaterTotal
						this.balanceError = res.result.balanceError
					} else {
						console.log(res.message)
					}
				})
			}
		},
		mounted() {
			companyBalance({
				regionID: global.regionID,
			}).then(res => {
				if (res.status === '0') {
					this.balanceName = res.result.balanceName
					this.unBalanceName = res.result.unBalanceName
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
		right: 535px;
		bottom: 25px;
		width: 830px;
		height: 316px;
		background: url(../../../../static/image/management.png) no-repeat left bottom / 100% 300px;
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
			padding: 5px 0 0 0;

			.tabs {
				position: absolute;
				top: -15px;
				right: 10px;
				display: flex;
				width: 150px;
				height: 26px;
				border-radius: 8px;
				background-color: #06247d;
				z-index: 100;
				margin-bottom: 10px;

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
					width: 82px;
					background-color: #13ecce;
					border-radius: 9px;
					flex: none;
					color: #000;
				}
			}

			.title {
				color: #02d9fd;
				padding-left: 12px;
			}

			.table {
				margin-top: 14px;
				color: #fff;
				height: 234px;
				overflow-y: scroll;

				&-thead {
					display: flex;
					background-color: rgba(9, 46, 152, 0.5);
				}

				&-tr {
					display: flex;

					&:nth-child(even) {
						background-color: rgba(9, 46, 152, 0.5);
					}
				}

				&-th,
				&-td {
					height: 26px;
					line-height: 26px;
					text-align: center;
				}

				.index {
					width: 100px;
				}

				.name {
					flex: 1;
					text-align: left;
					padding-left: 20px;
				}

				.number {
					width: 110px;
				}

				.look {
					width: 200px;
					text-align: center;

					&>span {
						color: #00ffb4;
						cursor: pointer;
					}
				}

				&::-webkit-scrollbar {
					background-color: #051e6b;
					border: solid 1px #0690c5;
				}

				&::-webkit-scrollbar-thumb {
					border-radius: 10px;
					background: #238bf3 url(../../../../static/image/scrollbar-icon.png) no-repeat center center / 13px 10px;
				}
			}
		}
	}

	.media-modal-body {
		height: 900px;
		background: url(../../../../static/image/spsbg.png) no-repeat center center / 100% 100%;
		position: relative;
	}

	.media-jinkou {
		width: 390px;
		position: absolute;
		top: 581px;
		left: 319px;
		color: #fff;

		.cell {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 20px;
			height: 41px;
			line-height: 41px;
			margin-bottom: 11px;

			.waterType {
				padding-left: 16px;
			}

			.waterQuantity {
				padding-left: 16px;
				width: 198px;
			}
		}
	}

	.media-chukou {
		width: 464px;
		position: absolute;
		top: 613px;
		right: 82px;
		color: #fff;

		.cell {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 20px;
			height: 41px;
			line-height: 41px;
			margin-bottom: 11px;

			.waterType {
				padding-left: 16px;
			}

			.waterQuantity {
				padding-left: 16px;
				width: 199px;
			}
		}
	}

	.incomeWaterTotal {
		position: absolute;
		font-size: 20px;
		color: #fff;
		top: 752px;
		left: 83px;
		width: 197px;
		height: 43px;
		line-height: 43px;
		text-align: center;
	}

	.exportWaterTotal {
		position: absolute;
		font-size: 20px;
		color: #fff;
		width: 196px;
		height: 43px;
		line-height: 43px;
		text-align: center;
		top: 734px;
		right: 583px;
	}

	.error {
		color: #19e0fe;
		position: absolute;
		font-size: 20px;
		bottom: 19px;
		left: 810px;
	}
</style>
