<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="download">导出</a-button>
			<a-button type="primary" @click="chartOpen">图表</a-button>
		</template>
		<template slot="right">
			<a-cascader v-if ="cID==='null'?true:false"  :options="regionData" :fieldNames="fieldNames" placeholder="行政区区域" style="width: 150px" change-on-select @change="regionChange" />
			<a-select   v-if ="cID==='null'?true:false" show-search v-model="CompanyID" placeholder="企业" option-filter-prop="children" style="width: 150px" @focus="companyFocus"
			 @change="companyChange">
				<a-select-option v-for="item in companyList" :value="item.id" :key="item.id">{{item.companyName}}</a-select-option>
			</a-select>
			<a-select v-model="CompanyHoleID" placeholder="排口名称" style="width: 120px">
				<a-select-option v-for="item in holeList" :value="item.id" :key="item.id">{{item.holeName}}</a-select-option>
			</a-select>
			<a-select v-model="IndustryTypeID" placeholder="行业类别" style="width: 120px">
				<a-select-option v-for="item in industryTypeList" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
			</a-select>
			<a-select v-model="PollutedLevelID" placeholder="污染物等级" style="width: 120px">
				<a-select-option v-for="item in pollutedLevelList" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
			</a-select>
			<a-range-picker @change="DateChange" />
			<a-button type="primary" @click="dataSearch">查询</a-button>
		</template>
		<template slot="table">
			<a-table style="height: 100%;" :columns="columns" :data-source="data" :loading="loading" :scroll="{ x: scrollx,y: scrolly }"
			 :rowKey="record => record.id" size="middle" :pagination="pagination" @change="pageChange" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
			</a-table>
		</template>
		<template slot="fixed">
			<modal ref="modal" title="数据统计与报表/企业数据报表/年数据报表" avg cou :getData="chartData"></modal>
		</template>
	</sub-menu>
</template>

<script>
	import SubModule from '@/components/subModule.vue'
	import modal from '@/components/chart/enterprise.vue'
	import fileDownload from 'js-file-download'

	import {
		yearDatas,
		getCompanyList,
		getIndustryType,
		getHoleNames,
		getPollutedLevel,
		yearChart
	} from '@/request/api'

	import {
      exportCompanyYearData
	} from '@/request/api2'



	export default ({
		components: {
			'sub-menu': SubModule,
			'modal': modal
		},
		data() {
			return {
				roleID:global.roleID,
				regionData: global.addDegoins,
				RegionID: null,
				regionID: global.regionID,
				RegionID: '',
				companyList: [],
				CompanyID: [],
				cID:global.companyID,
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
						fixed: 'left',
						width: 50
					}, {
						title: '企业名称',
						dataIndex: 'companyName',
						align: 'center',
						fixed: 'left',
						width: 200
					},
					{
						title: '排口名称',
						dataIndex: 'holeName',
						align: 'center',
						fixed: 'left',
						width: 100
					},
					{
						title: '监测时间',
						dataIndex: 'monitorTimeText',
						align: 'center',
						fixed: 'left',
						width: 150
					}, {
						title: '污染物类别',
						dataIndex: 'pollutedType',
						align: 'center',
						fixed: 'left',
						width: 100
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
				}
			};
		},
		created() {
			// 获取企业列表
			this.getCompany()
			
			if(this.roleID==='3')
			{
				this.getHole(this.cID)
			}
			
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
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize,
				RegionID: this.regionID,
				companyId:this.roleID==='3'?this.cID:this.CompanyID
			}
			this.getFirstPage(data)
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
				yearDatas(data).then(res => {
					if (res.status === '0') {
						const polluteDict = res.result.list[0].polluteDict
						
						const isFixed = Object.keys(polluteDict).length > 10
						
						this.scrollx = isFixed ? 600 : ''
						
						this.columns.forEach((item,index)=>{
							item.fixed = isFixed
							if (index && !isFixed) {
								item.width = ''
							}
						})
						
						Object.keys(polluteDict).forEach(key => {
							this.columns.push({
								title: key,
								dataIndex: key,
								align: 'center',
								width: isFixed ? 140 : ''
							})
							this.scrollx += isFixed ? 140 : ''
						});
						this.dataHandle(res.result, this.pagination)
					} else {
						console.log(res.message)
						this.pagination.total = 0
					}
					this.loading = false
				})
			},
			getData(data, pagination) {
				yearDatas(data).then(res => {
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
					RegionID: this.RegionID ? this.RegionID : this.regionID,
					CompanyID: this.roleID==='3'?this.cID:this.CompanyID,
					CompanyHoleID: this.CompanyHoleID.constructor == Array ? '' : this.CompanyHoleID,
					PollutedLevelID: this.PollutedLevelID.constructor == Array ? '' : this.PollutedLevelID,
					IndustryTypeID: this.IndustryTypeID.constructor == Array ? '' : this.IndustryTypeID,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
					PageIndex: pagination.current - 1,
					PageSize: pagination.pageSize
				}

				this.getData(data, pagination)
			},
			dataHandle(data, pagination) {
				data.list.forEach(item => {
					item = Object.assign(item, item.polluteDict)
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
					RegionID: this.RegionID ? this.RegionID : this.regionID,
					CompanyID: this.roleID==='3'?this.cID:this.CompanyID,
					CompanyHoleID: this.CompanyHoleID.constructor == Array ? '' : this.CompanyHoleID,
					PollutedLevelID: this.PollutedLevelID.constructor == Array ? '' : this.PollutedLevelID,
					IndustryTypeID: this.IndustryTypeID.constructor == Array ? '' : this.IndustryTypeID,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize
				}
				this.getFirstPage(data)
			},
			download() {
				let params = {
					RegionID: this.RegionID ? this.RegionID : this.regionID,
					CompanyID: this.roleID==='3'?this.cID:this.CompanyID,
					CompanyHoleID: this.CompanyHoleID.constructor == Array ? '' : this.CompanyHoleID,
					PollutedLevelID: this.PollutedLevelID.constructor == Array ? '' : this.PollutedLevelID,
					IndustryTypeID: this.IndustryTypeID.constructor == Array ? '' : this.IndustryTypeID,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
				}
				exportCompanyYearData(params).then(res => {
                    var iframe =document.createElement("iframe")
                    iframe.style.display ="none";
                    iframe.src = res.result;
                    document.body.appendChild(iframe);
				})
			},
			
			
			tableHeight(data) {
				this.scrolly = data - 75
			},
			chartOpen(){
				this.$refs.modal.visible = true
			},
			chartData(data){
				yearChart(data).then(res => {
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
			customRow(record, index){
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
