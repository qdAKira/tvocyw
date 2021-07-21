<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<div></div>
		</template>
		<template slot="right">
			<a-cascader v-if="cID==='null'?true:false" :options="regionData" :fieldNames="fieldNames"
				placeholder="行政区区域" style="width: 150px" change-on-select @change="regionChange" />
			<a-select v-if="cID==='null'?true:false" show-search v-model="CompanyID" placeholder="企业"
				option-filter-prop="children" style="width: 150px" @focus="companyFocus" @change="companyChange">
				<a-select-option v-for="item in companyList" :value="item.id" :key="item.id">{{item.companyName}}
				</a-select-option>
			</a-select>
			<a-select v-model="CompanyHoleID" placeholder="排口名称" style="width: 120px">
				<a-select-option v-for="item in holeList" :value="item.id" :key="item.id">{{item.holeName}}
				</a-select-option>
			</a-select>
			<a-select v-model="IndustryTypeID" placeholder="行业类别" style="width: 120px">
				<a-select-option v-for="item in industryTypeList" :value="item.id" :key="item.id">{{item.name}}
				</a-select-option>
			</a-select>
			<a-select v-model="PollutedLevelID" placeholder="污染物等级" style="width: 120px">
				<a-select-option v-for="item in pollutedLevelList" :value="item.id" :key="item.id">{{item.name}}
				</a-select-option>
			</a-select>
			<a-range-picker @change="DateChange" />
			<a-button type="primary" @click="dataSearch">查询</a-button>
		</template>
		<template slot="table">
			<a-table style="height: 100%;" :columns="columns" :data-source="data" :loading="loading"
				:scroll="{ x: scrollx,y: scrolly }" :rowKey="record => record.id" size="middle" :pagination="pagination"
				@change="pageChange" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
				<a-tooltip slot="accessStatus" slot-scope="text, record, index">
					<template slot="title">
						{{record.accessStatusTime}}
					</template>
					{{text}}
				</a-tooltip>
				<a-tooltip slot="onlineStatus" slot-scope="text, record, index">
					<template slot="title">
						{{record.onlineTimeText}}
					</template>
					{{text}}
				</a-tooltip>
				<a-tooltip slot="instantaneousQuantity" slot-scope="text, record, index">
					<template slot="title">
						{{record.dataTimeText}}
					</template>
					{{text}}
				</a-tooltip>
				<a-tooltip slot="dailyDischargeQuantity" slot-scope="text, record, index">
					<template slot="title">
						{{record.dailyDataTimeText}}
					</template>
					{{text}}
				</a-tooltip>
				<a-tooltip slot="monthDischargeQuantity" slot-scope="text, record, index">
					<template slot="title">
						{{record.monthDataTimeText}}
					</template>
					{{text}}
				</a-tooltip>
				<a-tooltip slot="yearDischargeQuantity" slot-scope="text, record, index">
					<template slot="title">
						{{record.yearDataTimeText}}
					</template>
					{{text}}
				</a-tooltip>
			</a-table>
		</template>
		<template slot="fixed">
			<modal ref="modal" title="数据统计与报表/企业数据报表/实时数据报表" rtd :getData="chartData"></modal>
		</template>
	</sub-menu>
</template>

<script>
	import SubModule from '@/components/subModule.vue'
	import modal from '@/components/chart/enterprise.vue'
	import fileDownload from 'js-file-download'

	import {
		timeDatas,
		getCompanyList,
		getIndustryType,
		getHoleNames,
		getPollutedLevel,
		realTimeChart,
		getFactor,
		companyMonitor
	} from '@/request/api'

	import {
		exportCompanyTimeData
	} from '@/request/api2'





	export default ({
		components: {
			'sub-menu': SubModule,
			'modal': modal
		},
		data() {
			return {
				roleID: global.roleID,
				regionData: global.addDegoins,
				RegionID: null,
				regionID: global.regionID,
				companyList: [],
				CompanyID: [],
				cID: global.companyID,
				holeList: [],
				CompanyHoleID: [],
				industryTypeList: [],
				IndustryTypeID: [],
				pollutedLevelList: [],
				PollutedLevelID: [],
				StartTime: '',
				EndTime: '',
				scrollx: '',
				scrolly: '',
				fieldNames: {
					children: 'child',
					label: 'name',
					value: 'id',
				},
				columns: [],
				columnsDefault: [{
						title: '序号',
						dataIndex: 'number',
						scopedSlots: {
							customRender: 'number'
						},
						align: 'center',
						width: 50
					}, {
						title: '企业名称',
						dataIndex: 'companyName',
						align: 'center',
					},
					{
						title: '排口名称',
						dataIndex: 'holeName',
						align: 'center',
					},
					{
						title: '监测时间',
						dataIndex: 'monitorTimeText',
						align: 'center',
					}, {
						title: '在线状态',
						dataIndex: 'onlineStatus',
						scopedSlots: {
							customRender: 'onlineStatus'
						},
						align: 'center',
					}
				],
				loading: false,
				data: [],
				parameter: {},
				pagination: {
					defaultPageSize: 20,
					pageSize: 20,
					showQuickJumper: true,
					showSizeChanger: true,
					current: 1,
					total: 0
				},
			};
		},
		created() {
			if (this.roleID === '3') {
				this.getHole(this.cID)
			}

			// 获取企业列表
			this.getCompany()


			// 获取行业类别
			getIndustryType().then(res => {
				if (res.status === '0') {
					this.industryTypeList = res.result
				} else {
					console.log(res.message)
				}
			})
			// 获取污染物等级
			getPollutedLevel().then(res => {
				if (res.status === '0') {
					this.pollutedLevelList = res.result
				} else {
					console.log(res.message)
				}
			})
			let data = {
				pageIndex: this.pagination.current - 1,
				pageSize: this.pagination.pageSize,
				regionId: Number(this.regionID),
				companyId: this.roleID === '3' ? this.cID : this.CompanyID
			}
			this.getFirstPage(data)

			getFactor().then(res => {
				if (res.status === '0') {
					console.log(res)
					this.factorList = res.result
				} else {
					console.log(res.message)
				}
			})
		},
		mounted() {},
		methods: {
			regionChange(value) {
				this.RegionID = value[value.length - 1]
				this.companyList = []
				this.CompanyID = []
			},
			// 获取企业列表方法
			getCompany() {
				getCompanyList({
					regionId: this.RegionID ? this.RegionID : this.regionID,
				}).then(res => {
					if (res.status === '0') {
						this.companyList = res.result
					} else {
						console.log(res.message)
					}
				})
			},
			// 获取排口列表
			getHole(id) {
				getHoleNames({
					companyId: id
				}).then(res => {
					if (res.status === '0') {
						console.log(res.result)
						this.holeList = res.result
					} else {
						console.log(res.message)
					}
				})
			},
			companyFocus() {
				this.getCompany()
			},
			companyChange(value) {
				this.CompanyHoleID = []
				this.getHole(value)
			},
			getFirstPage(data) {
				this.loading = true
				// 获取列表表头和首页数据
				this.columns = []
				this.columns = this.columns.concat(this.columnsDefault)
				companyMonitor(data).then(res => {
					console.log(res)
					if (res.status === '0') {
						if (res.result) {
							const factors = res.result.list[0].factors
							
							factors.forEach((item, index) => {
								this.columns.push({
									title: item.factorName,
									dataIndex: 'factors' + (index + 1),
									align: 'center',
								})
							})
							this.dataHandle(res.result, this.pagination)
						}else{
							this.pagination.total = 0
						}
					} else {
						console.log(res.message)
						this.pagination.total = 0
					}
					this.loading = false
				})
			},
			getData(data, pagination) {
				companyMonitor(data).then(res => {
					if (res.status === '0') {
						this.dataHandle(res.result, pagination)
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
			},
			pageChange(pagination, filters, sorter) {
				this.loading = true
				let data = {
					regionId: this.RegionID ? this.RegionID : this.regionID,
					companyID: this.roleID === '3' ? this.cID : this.CompanyID,
					holeId: this.CompanyHoleID.constructor == Array ? '' : this.CompanyHoleID,
					levelId: this.PollutedLevelID.constructor == Array ? '' : this.PollutedLevelID,
					industryTypeId: this.IndustryTypeID.constructor == Array ? '' : this.IndustryTypeID,
					startDate: this.StartTime,
					endDate: this.EndTime,
					pageIndex: pagination.current - 1,
					pageSize: pagination.pageSize
				}
				this.getData(data, pagination)
			},
			dataHandle(data, pagination) {
				data.list.forEach(item => {
					// item = Object.assign(item, item.polluteDict)
					item.factors.forEach((fac, index) => {
						item['factors' + (index + 1)] = fac.instantaneousQuantity
					})
				})
				this.loading = false
				this.data = data.list
				pagination.total = data.total
				this.pagination = pagination
			},
			DateChange(date, dateString) {
				this.StartTime = dateString[0]
				this.EndTime = dateString[1]
			},
			dataSearch() {
				this.pagination.current = 1
				this.data = []
				let data = {
					regionId: this.RegionID ? this.RegionID : this.regionID,
					companyId: this.roleID === '3' ? this.cID : this.CompanyID,
					holeId: this.CompanyHoleID.constructor == Array ? '' : this.CompanyHoleID,
					levelId: this.PollutedLevelID.constructor == Array ? '' : this.PollutedLevelID,
					industryTypeId: this.IndustryTypeID.constructor == Array ? '' : this.IndustryTypeID,
					startDate: this.StartTime,
					endDate: this.EndTime,
					pageIndex: this.pagination.current - 1,
					pageSize: this.pagination.pageSize
				}
				this.getFirstPage(data)
			},
			tableHeight(data) {
				this.scrolly = data - 75
			},
			chartOpen() {
				this.$refs.modal.visible = true
			},
			chartData(data) {
				realTimeChart(data).then(res => {
					if (res.status === '0') {
						if (res.result.avgList && res.result.avgList.length) {
							this.$refs.modal.avgData = res.result.avgList
							this.$refs.modal.avgunit = res.result.avgUnit
						}
						if (res.result.rtdList && res.result.rtdList.length) {
							this.$refs.modal.rtdData = res.result.rtdList
							this.$refs.modal.rtdunit = res.result.rtdUnit
						}
						if (res.result.couList && res.result.couList.length) {
							this.$refs.modal.couData = res.result.couList
							this.$refs.modal.couunit = res.result.couUnit
						}
					} else {
						console.log(res.message)
					}
				})
			},
			customRow(record, index) {
				return {
					style: {
						backgroundColor: index % 2 ? '#fff' : '#f0f2f5'
					}
				}
			}
		}
	})
</script>

<style scoped>
</style>
