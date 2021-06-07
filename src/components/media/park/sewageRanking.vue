<template>
	<div class="media-warp" :style="{left: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">企业污水总排放排行</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">企业污水总排放排行</div>
		<div class="media-warp-tabel">
			<div class="tabs">
				<div :class="{active: acvtive == 1}" @click="tabChange(1)">本月</div>
				<div :class="{active: acvtive == 2}" @click="tabChange(2)">本年</div>
			</div>
			<div class="table">
				<div class="table-thead">
					<div class="table-th index">序号</div>
					<div class="table-th name">企业名称</div>
					<div class="table-th number">排放量（吨）</div>
				</div>
				<div class="table-tbody">
					<div class="table-tr" v-for="(item,index) in list">
						<div class="table-td index" v-if="index < 8">{{index + 1}}</div>
						<div class="table-td name">{{item.companyName}}</div>
						<div class="table-td number">{{item.totalNumber}}</div>
					</div>
					<div class="table-tr" v-for="n in (8 - list.length)">
						<div class="table-td index"></div>
						<div class="table-td name"></div>
						<div class="table-td number"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		sewageTotal
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				acvtive: 1,
				list: []
			}
		},
		created() {
			this.tabChange(1)
		},
		methods: {
			tabChange(i) {
				this.list = []
				this.acvtive = i
				sewageTotal({
					regionID: global.regionID,
					DateTag: i
				}).then(res => {
					if (res.status === '0') {
						this.list = res.result
					} else {
						console.log(res.message)
					}
				})
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
		mounted() {}
	})
</script>

<style scoped lang="less">
	.media-warp {
		position: absolute;
		left: 20px;
		top: 215px;
		width: 505px;
		height: 390px;
		background: url(../../../../static/image/fixed2.png) no-repeat left bottom / 100% 372px;
		transition: left 1s;
		-webkit-transition: left 1s;
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
				right: -45px;
				top: 0;
				bottom: 0;
				opacity: 0;
				transition: opacity 0.5s;
				-webkit-transition: opacity 0.5s;
				margin: auto;
			}
		}

		&-tabel {
			padding: 5px 20px 0;

			.tabs {
				display: flex;
				width: 110px;
				height: 26px;
				border-radius: 8px;
				background-color: #06247d;

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

			.table {
				margin-top: 14px;
				color: #fff;

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
					height: 30px;
					line-height: 30px;
					text-align: center;
				}

				.index {
					width: 50px;
				}

				.name {
					flex: 1;
					text-align: left;
					padding-left: 20px;
				}

				.number {
					width: 110px;
				}
			}
		}
	}
</style>
