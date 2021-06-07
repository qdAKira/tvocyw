<template>
	<div class="media-warp" :style="{right: isMove ? '-505px' : ''}">
		<div class="media-warp-title" @click="myMoveIn">当月企业超标报警情况</div>
		<div class="media-warp-title active" :style="{opacity: opacity}" v-show="isMove" @click="myMoveOut">
			当月企业超标报警情况
		</div>
		<div class="media-warp-chart">
			<div class="media-warning-cell over">
				<div class="number" @click="open(overList,'超标报警数')">{{overTotal}}</div>
				超标报警数
			</div>
			<div class="media-warning-cell handle">
				<div class="number" @click="open(handleList,'已处理数')">{{handleTotal}}</div>
				已处理数
			</div>
			<div class="media-warning-cell examine">
				<div class="number" @click="open(examineList,'已审核数')">{{examineTotal}}</div>
				已审核数
			</div>
			<div class="media-warning-arrow1"></div>
			<div class="media-warning-arrow2"></div>
		</div>
		<a-modal dialogClass="media-modal-dialog" v-model="visible" :title="title" :width="1800" centered
			:footer="null" destroyOnClose>
			<div class="media-modal-body">
				<a-table :rowClassName="rowClassName" :columns="columns" :data-source="data" size="small"
					:customHeaderRow="customHeaderRow" :customRow="customRow" :rowKey="record => record.alarmTimeText">
					<span slot="number" slot-scope="text, record, index">
						{{index + 1 }}
					</span>
				</a-table>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import {
		monthAlarmOver2
	} from '@/request/api'

	export default ({
		props: {},
		data() {
			return {
				isMove: false,
				opacity: '',
				list: [],
				overTotal: '',
				handleTotal: '',
				examineTotal: '',
				visible: false,
				columns: [{
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
					title: '企业名称',
					dataIndex: 'companyName',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '排口名称',
					dataIndex: 'holeName',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '报警内容',
					dataIndex: 'alarmContent',
					align: 'center',
					ellipsis: true,
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '报警时间',
					dataIndex: 'alarmTimeText',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '超标原因',
					dataIndex: 'overStandReason',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '处理措施',
					dataIndex: 'treatmentMeasures',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '处理时间',
					dataIndex: 'fillTimeText',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '处理状态',
					dataIndex: 'processingStatus',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '处理人',
					dataIndex: 'fillName',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '审核状态',
					dataIndex: 'auditStatus',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '审核人',
					dataIndex: 'reviewer',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}, {
					title: '审核时间',
					dataIndex: 'auditTimeText',
					align: 'center',
					customHeaderCell: column => {
						return {
							style: {
								color: '#fff'
							}
						}
					}
				}],
				data: [],
				overList: [],
				handleList: [],
				examineList: [],
				title: ''
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
			rowClassName(record, index){
				return 'warning-table-row'
			},
			open(data,title){
				this.visible = true
				this.title = title
				this.data = data
			}
		},
		mounted() {
			monthAlarmOver2({
				regionID: global.regionID,
			}).then(res => {
				if (res.status === '0') {
					this.overTotal = res.result.overTotal
					this.handleTotal = res.result.processTotal
					this.examineTotal = res.result.auditTotal
					this.overList = res.result.overList
					this.handleList = res.result.processList
					this.examineList = res.result.auditList
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
		height: 463px;
		background: url(../../../../static/image/drainage-state.png) no-repeat left bottom / 100% 443px;
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

		}
	}

	.media-warning-cell {
		position: absolute;
		width: 217px;
		font-size: 18px;
		color: #fff;
		text-align: center;
		animation-duration: 0.25s;
		animation-iteration-count: infinite;

		.number {
			height: 68px;
			background-repeat: no-repeat;
			background-position: 0 0;
			background-size: 100% 100%;
			font-size: 30px;
			line-height: 68px;
			font-weight: bold;
			color: #000;
			margin-bottom: 5px;
			cursor: pointer;
		}

		&.over {
			top: 51px;
			left: 55px;
			transform: rotate(15deg);

			&:hover {
				// animation-name: rotate1;
			}

			.number {
				background-image: url(../../../../static/image/warning-ng-1.png);
			}
		}

		&.handle {
			top: 183px;
			right: 34px;
			transform: rotate(-15deg);

			&:hover {
				// animation-name: rotate2;
			}

			.number {
				background-image: url(../../../../static/image/warning-bg-3.png);
			}
		}

		&.examine {
			bottom: 21px;
			left: 55px;
			transform: rotate(15deg);

			&:hover {
				// animation-name: rotate1;
			}

			.number {
				background-image: url(../../../../static/image/warning-bg-2.png);
			}
		}
	}

	.media-warning-arrow1 {
		position: absolute;
		width: 55px;
		height: 69px;
		top: 117px;
		right: 157px;
		background: url(../../../../static/image/warning-arrow-1.png) no-repeat center center / 100% 100%;
	}

	.media-warning-arrow2 {
		position: absolute;
		width: 78px;
		height: 35px;
		bottom: 150px;
		left: 147px;
		background: url(../../../../static/image/warning-arrow-2.png) no-repeat center center / 100% 100%;
	}

	@keyframes rotate1 {
		0% {
			transform: rotate(15deg);
		}

		25% {
			transform: rotate(10deg);
		}

		75% {
			transform: rotate(20deg);
		}

		100% {
			transform: rotate(15deg);
		}
	}

	@keyframes rotate2 {
		0% {
			transform: rotate(-15deg);
		}

		25% {
			transform: rotate(-10deg);
		}

		75% {
			transform: rotate(-20deg);
		}

		100% {
			transform: rotate(-15deg);
		}
	}
</style>

<style lang="less">
	.ant-table-tbody>.warning-table-row:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td {
		background: rgba(4, 101, 181, 0.8);
	}

	.media-modal-body {

		.ant-pagination-item {
			a {
				color: #fff;
			}
		}

		.ant-pagination-item-active {
			background: #1890ff;
			border-color: #fff;
		}

		.ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis,
		.ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-link-icon,
		.ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-link-icon,
		.ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis,
		.ant-pagination-prev a,
		.ant-pagination-next a {
			color: #fff;
		}

		.ant-pagination-disabled .ant-pagination-item-link,
		.ant-pagination-disabled:hover {
			color: #d6d9d9;
		}

		.ant-table-placeholder {
			background-color: transparent;
		}

		.ant-empty-normal {
			color: #fff;
		}
	}
</style>
