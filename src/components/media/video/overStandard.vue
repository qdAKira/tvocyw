<template>
	<div class="media-warp" :style="{right: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">查看当月超标图像(数据叠加)</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">
			企业水平衡情况
		</div>
		<div class="media-warp-chart">
			<div class="table">
				<div class="table-thead">
					<div class="table-th index">序号</div>
					<div class="table-th name">企业名称</div>
					<div class="table-th number">时间</div>
					<div class="table-th look"></div>
				</div>
				<div class="table-tbody">
					<div class="table-tr" v-for="(item,index) in list">
						<div class="table-td index" v-if="index < 25">{{index + 1}}</div>
						<div class="table-td name">{{item.companyName}}</div>
						<div class="table-td number">{{item.dateTimeText}}</div>
						<div class="table-td look"><span @click="look(item.url)">查看</span></div>
					</div>
					<div class="table-tr" v-for="n in (25 - list.length)">
						<div class="table-td index"></div>
						<div class="table-td name"></div>
						<div class="table-td number"></div>
					</div>
				</div>
			</div>
		</div>
		<template slot="fixed">
			<a-modal :visible="imgVisble" width="auto" destroyOnClose :footer="null" centered :closable="false" :bodyStyle="bodyStyle" wrapClassName="img-modal" @cancel="imgVisble = false">
				<img class="modal-img" :src="imgsrc" alt="">
			</a-modal>
		</template>
	</div>
</template>

<script>
	import {
		videoOverlay
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
				imgVisble: false,
				bodyStyle: {
					padding: 0
				},
				imgsrc: ''
			}
		},
		created() {},
		methods: {
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
			look(url){
				this.imgVisble = true
				this.imgsrc = url
			}
		},
		mounted() {
			videoOverlay({
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
		right: 20px;
		top: 10px;
		width: 490px;
		height: 925px;
		background: url(../../../../static/image/surface-water.png) no-repeat left bottom / 100% 905px;
		transition: right 1s;
		-webkit-transition: right 1s;

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
			padding: 30px 0 0 0;
			
			.tabs {
				position: absolute;
				top: 10px;
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
				height: 780px;
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
					width: 180px;
				}
				
				.look{
					width: 50px;
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
</style>
