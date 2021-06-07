<template>
	<a-modal destroyOnClose :maskClosable="false" :title="title" :visible="visible" :width="1500" :footer="null"
		centered @cancel="handleCancel">
		<div class="charts-header">
			<a-row type="flex">
				<a-col flex="200px" style="line-height: 32px;">
					<a-radio-group v-model="chartType">
						<a-radio value="line">
							折线图
						</a-radio>
						<a-radio value="bar">
							柱状图
						</a-radio>
					</a-radio-group>
				</a-col>
				<a-col flex="auto" style="text-align: right;">
					<a-space style="text-align: left;">
						<a-select show-search v-model="WellID" placeholder="截污井名称" option-filter-prop="children"
							style="width: 150px">
							<a-select-option v-for="item in welllist" :value="item.id" :key="item.id">
								{{item.wellName}}
							</a-select-option>
						</a-select>
						<a-select v-model="FactorID" label-in-value placeholder="污染物因子" style="width: 120px"
							@change="factorChange">
							<a-select-option v-for="item in factorList" :value="item.id" :key="item.id">{{item.factorName}}
							</a-select-option>
						</a-select>
						<a-range-picker @change="DateChange" />
						<a-button type="primary" @click="search">查询</a-button>
					</a-space>
				</a-col>
			</a-row>
		</div>
		<div class="charts-warp">
			<a-carousel arrows effect="fade">
				<div slot="prevArrow" slot-scope="props" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
					<a-icon type="left-circle" />
				</div>
				<div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
					<a-icon type="right-circle" />
				</div>
				<div v-if="avg" style="height: 560px;">
					<!-- 111 -->
					<chart ID="AVG" :value="avgData" :type="chartType" :title="chartTitle" text="平均浓度" :unit="avgunit">
					</chart>
				</div>
				<div v-if="cou" style="height: 560px;">
					<!-- 2222 -->
					<chart ID="COU" :value="couData" :type="chartType" :title="chartTitle" text="排放量" :unit="couunit">
					</chart>
				</div>
				<div v-if="rtd" style="height: 560px;">
					<!-- 2222 -->
					<chart ID="RTD" :value="rtdData" :type="chartType" :title="chartTitle" text="瞬时量" :unit="rtdunit">
					</chart>
				</div>
			</a-carousel>
		</div>
	</a-modal>
</template>

<script>
	import chart from '@/components/chart/chart.vue'

	import {
		realTimeChart,
		getCompanyList
	} from '@/request/api'
	
	import {
        pollutedFactorByWell
	} from '@/request/api2'









	export default ({
		components: {
			'chart': chart,
		},
		props: {
			wellList: {
				type: Array,
				default: []
			},
			getData: {
				type: Function,
				default: null
			},
			avg: {
				type: Boolean,
				default: false
			},
			cou: {
				type: Boolean,
				default: false
			},
			rtd: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: false
			}
		},
		data() {
			return {
				visible: false,
				fieldNames: {
					children: 'child',
					label: 'name',
					value: 'id',
				},
				chartVisble: true,
				chartType: 'line',
				RegionID: null,
				welllist: this.wellList,
				WellID: [],
				factorList: [],
				FactorID: [],
				StartTime: '',
				EndTime: '',
				chartTitle: '',
				avgData: [],
				rtdData: [],
				couData: [],
				rtdunit: '',
				avgunit: '',
				couunit: ''
			}
		},
		created() {
			pollutedFactorByWell().then(res => {
				if (res.status === '0') {
					this.factorList = res.result
				} else {
					console.log(res.message)
				}
			})
		},
		methods: {
			DateChange(date, dateString) {
				this.StartTime = dateString[0]
				this.EndTime = dateString[1]
			},
			search() {
				const data = {
					WellID: this.WellID.constructor == Array ? '' : this.WellID,
					FactorID: this.FactorID.constructor == Array ? '' : this.FactorID.key,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
				}
				this.getData(data)
			},
			handleCancel() {
				this.WellID =[]
				this.FactorID = []
				this.StartTime = ''
				this.EndTime = ''
				this.chartData = []
				this.chartType = 'line'
				this.visible = false
			},
			factorChange(value) {
				this.chartTitle = value.label.replace(/[\r\n]/g, "")
			}
		},
		mounted() {
		},
		watch: {
			wellList: {
				handler(newVal, oldVal) {
					if (newVal) {
						this.welllist = newVal
					} else {
						this.welllist = oldVal
					}
				},
				deep: true
			}
		}
	})
</script>

<style scoped>
	.custom-slick-arrow {
		width: 25px;
		height: 25px;
		font-size: 25px;
		color: #000;
		opacity: 0.3;
	}

	.custom-slick-arrow:before {
		display: none;
	}

	.custom-slick-arrow:hover {
		opacity: 1;
		color: #000;
	}
</style>
