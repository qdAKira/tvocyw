<template>
	<div class="media-warp" :style="{bottom: isMove ? '-316px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">上月企业平衡报告</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">上月企业平衡报告
		</div>
		<div class="media-warp-chart">
			<div class="tabs">
				<div :class="{active: acvtive == 1}" @click="tabChange(1)">企业</div>
				<div :class="{active: acvtive == 2}" @click="tabChange(2)">行业</div>
			</div>
			<div class="media-warp-chart">
				<div class="header">
					<div class="index">序号</div>
					<div class="name">{{acvtive == 1 ? '企业名称' : '行业类型'}}</div>
					<div class="look"></div>
				</div>
				<div class="scroll">
					<div class="cell" v-for="(item,index) in (acvtive == 1 ? list1 : list2)"
						:key="acvtive == 1 ? item.reportID : item.id">
						<div class="index">{{index + 1}}</div>
						<div class="name">{{acvtive == 1 ? item.companyName : item.name}}</div>
						<div class="look"><span @click="look(acvtive == 1 ? item.reportID : item.id)">查看</span></div>
					</div>
				</div>
			</div>
		</div>
		<a-modal dialogClass="media-modal-dialog" v-model="visible" :title="(acvtive == 1? '企业' : '行业') + '水平衡评估报告'" :width="1200" centered
			:footer="null" destroyOnClose>
			<div class="media-modal-body">
				<a-row>
					<a-col :span="3">
						<div class="media-message-cell">评估对象</div>
					</a-col>
					<a-col :span="9">
						<div class="media-message-cell">{{message.name}}</div>
					</a-col>
					<a-col :span="3">
						<div class="media-message-cell">评估时间</div>
					</a-col>
					<a-col :span="9">
						<div class="media-message-cell">{{message.reportTime}}</div>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="3">
						<div class="media-message-cell">评估人员</div>
					</a-col>
					<a-col :span="9">
						<div class="media-message-cell">洋口园区水环境管理系统</div>
					</a-col>
					<a-col :span="3">
						<div class="media-message-cell">评估内容</div>
					</a-col>
					<a-col :span="9">
						<div class="media-message-cell">{{acvtive == 1 ? '企业' : '行业'}}水平衡</div>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="3">
						<div class="media-message-cell" style="height: 180px;">评估详情</div>
					</a-col>
					<a-col :span="21">
						<div class="media-message-cell text" style="height: 180px;line-height: 30px;padding-top: 15px;padding-bottom: 15px;">{{message.report}}</div>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="3">
						<div class="media-message-cell">评估结果</div>
					</a-col>
					<a-col :span="21">
						<div class="media-message-cell text">{{message.reportResult}}</div>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="3">
						<div class="media-message-cell">报告生成时间</div>
					</a-col>
					<a-col :span="21">
						<div class="media-message-cell text">{{message.createReportTime}}</div>
					</a-col>
				</a-row>
				<!-- <div class="header">
					<div class="name">企业名称：{{message.companyName}}</div>
					<div class="date">报告时间：{{message.reportTime}}</div>
				</div>
				<div class="title">报告内容</div>
				<div class="message">{{message.report}}</div>
				<div class="create" style="text-align: right;">{{message.createReportTime}}</div> -->
			</div>
		</a-modal>
	</div>
</template>

<script>
	import {
		balanceReport,
		lastMonthCompany,
		industryName,
		industryReport
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				dom: null,
				list1: [],
				list2: [],
				visible: false,
				message: {},
				acvtive: 1
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
			getDataIn() {
				lastMonthCompany({
					regionID: global.regionID,
				}).then(res => {
					if (res.status === '0') {
						this.list1 = res.result
					} else {
						console.log(res.message)
					}
				})
			},
			getDataIn2() {
				industryName().then(res => {
					if (res.status === '0') {
						this.list2 = res.result
					} else {
						console.log(res.message)
					}
				})
			},
			look(id) {
				this.visible = true
				if (this.acvtive == 1) {
					balanceReport({
						reportID: id,
					}).then(res => {
						if (res.status === '0') {
							this.message = res.result
						} else {
							console.log(res.message)
						}
					})
				} else{
					industryReport({
						reportID: id,
					}).then(res => {
						if (res.status === '0') {
							this.message = res.result
						} else {
							console.log(res.message)
						}
					})
				}
			},
			tabChange(i) {
				this.acvtive = i
			},
		},
		mounted() {
			this.getDataIn()
			this.getDataIn2()
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
			padding-top: 10px;

			.tabs {
				position: absolute;
				top: -10px;
				right: 10px;
				display: flex;
				width: 150px;
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

			.header {
				position: absolute;
				width: 100%;
				left: 0;
				top: 10px;
				background-color: #154279;
				display: flex;
				align-items: center;
				color: #fff;
				height: 38px;

				.index {
					width: 100px;
					text-align: center;
					margin-right: 150px;
				}

				.name {
					flex: 1;
				}
			}

			.scroll {
				height: 210px;
				overflow-y: scroll;
				margin-top: 38px;

				&::-webkit-scrollbar {
					background-color: #051e6b;
					border: solid 1px #0690c5;
				}

				&::-webkit-scrollbar-thumb {
					border-radius: 10px;
					background: #238bf3 url(../../../../static/image/scrollbar-icon.png) no-repeat center center / 13px 10px;
				}
			}

			.cell {
				display: flex;
				align-items: center;
				height: 30px;
				color: #fff;
				background-color: rgba(21, 66, 121, 0.8);
				border: solid 1px #0690c5;

				&+.cell {
					border-top: 0;
				}

				&:hover {
					background-color: rgba(4, 101, 181, 0.8);
				}

				.index {
					width: 100px;
					text-align: center;
					margin-right: 150px;
				}

				.name {
					flex: 1;
				}

				.look {
					width: 200px;
					text-align: center;

					&>span {
						color: #00ffb4;
						cursor: pointer;
					}
				}
			}

			.chart {
				height: 100%;
			}
		}
	}

	.media-modal-body {
		color: #fff;
		font-size: 16px;
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 50px;
			border-bottom: 1px solid #fff;
		}

		.title {
			text-align: center;
			line-height: 50px;
			font-size: 20px;
			margin-top: 15px;
		}

		.message {
			text-indent: 2em;
			height: 400px;
			line-height: 40px;
		}
	}
	
	.media-message-cell{
		border-right: 1px solid #fff;
		border-bottom: 1px solid #fff;
		height: 60px;
		line-height: 60px;
		text-align: center;
		
		&.text{
			padding: 0 60px;
			text-align: left;
		}
	}
</style>
