<template>
	<div class="media-warp" :style="{left: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">当月异常情况统计</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">
			当月异常情况统计
		</div>
		<div class="media-warp-chart">
			<div class="title">当月超标次数前十名</div>
			<div class="table">
				<div class="table-thead">
					<div class="table-th index">序号</div>
					<div class="table-th name">企业名称</div>
					<div class="table-th number">次数</div>
				</div>
				<div class="table-tbody">
					<div class="table-tr" v-for="(item,index) in list">
						<div class="table-td index" v-if="index < 10">{{index + 1}}</div>
						<div class="table-td name">{{item.companyName}}</div>
						<div class="table-td number">{{item.overNumber}}</div>
					</div>
					<div class="table-tr" v-for="n in (10 - list.length)">
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
		videoMonthOver
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				dom: null,
				list: []
			}
		},
		created() {
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
			},
		},
		mounted() {
			videoMonthOver({
				regionID: global.regionID,
			}).then(res => {
				if (res.status === '0') {
					this.list = res.result
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
		left: 20px;
		bottom: 25px;
		width: 505px;
		height: 460px;
		background: url(../../../../static/image/over-number.png) no-repeat left bottom / 100% 445px;
		transition: left 1s;
		-webkit-transition: left 1s;

		&-title {
			width: 238px;
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
			position: relative;
			padding: 20px 0 0 0;
			
			.title{
				color: #02d9fd;
				padding-left: 12px;
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
