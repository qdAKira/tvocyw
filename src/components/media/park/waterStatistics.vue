<template>
	<div class="media-warp" :style="{left: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">近六月园区企业水量统计</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">近六月园区企业水量统计</div>
		<div class="media-warp-tabel">
			<div class="tabs">
				<div :class="{active: !acvtive}" @click="acvtive = 0">总进</div>
				<div :class="{active: acvtive}" @click="acvtive = 1">总出</div>
			</div>

			<div class="table">
				<div style="width: 65px;">月份</div>
				<div class="table-th" v-for="item in (acvtive ? exportTotal : incomeTotal)">{{item.monthDate}}</div>
				<div class="table-th" v-for="n in 6 - (acvtive ? exportTotal : incomeTotal).length"></div>
			</div>

			<div class="table">
				<div style="width: 65px;">总量/吨</div>
				<div class="table-th" v-for="item in (acvtive ? exportTotal : incomeTotal)">{{item.number}}</div>
				<div class="table-th" v-for="n in 6 - exportTotal.length"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		parkHalfYear
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				acvtive: 0,
				exportTotal: [],
				incomeTotal: []
			}
		},
		created() {
			parkHalfYear({
				regionID: global.regionID
			}).then(res => {
				if (res.status === '0') {
					this.exportTotal = res.result.exportTotal
					this.incomeTotal = res.result.incomeTotal
				} else {
					console.log(res.message)
				}
			})
		},
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
		mounted() {}
	})
</script>

<style scoped lang="less">
	.media-warp {
		position: absolute;
		left: 20px;
		top: 0;
		width: 505px;
		height: 205px;
		background: url(../../../../static/image/fixed1.png) no-repeat left bottom / 100% 186px;
		transition: left 1s;
		-webkit-transition: left 1s;
		/* Safari */

		&-title {
			width: 219px;
			height: 40px;
			margin: 0 auto;
			background: url(../../../../static/image/fixed1-headr.png) no-repeat center center / 100% 100%;
			font-size: 18px;
			line-height: 37px;
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
				display: flex;
				color: #fff;
				text-align: center;
				background-color: rgba(9, 46, 152, 0.5);
				margin-top: 12px;

				&>div {
					height: 40px;
					line-height: 40px;
				}

				.table-th {
					flex: 1;
				}
			}
		}
	}
</style>
