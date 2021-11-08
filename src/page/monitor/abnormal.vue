<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<div></div>
		</template>
		<template slot="right">
			<a-cascader v-if ="cID==='null'?true:false"  :options="regionData" :fieldNames="fieldNames" placeholder="行政区区域" style="width: 150px" change-on-select
			 @change="regionChange" />
			<a-select v-if ="cID==='null'?true:false"  show-search v-model="CompanyID" placeholder="企业" option-filter-prop="children" style="width: 150px" @focus="companyFocus"
			 @change="companyChange">
				<a-select-option v-for="item in companyList" :value="item.id" :key="item.id">{{item.companyName}}</a-select-option>
			</a-select>
			<a-select v-model="CompanyHoleID" placeholder="排口名称" style="width: 120px">
				<a-select-option v-for="item in holeList" :value="item.id" :key="item.id">{{item.holeName}}</a-select-option>
			</a-select>
			<a-range-picker @change="DateChange" />
			<a-button type="primary" @click="search">查询</a-button>
		</template>
		<template slot="table">
			<a-table style="height: 100%;" :columns="columns" :data-source="data" :loading="loading" :scroll="{ x: scrollx,y: scrolly }"
			 :rowKey="record => record.id" size="middle" :pagination="pagination" @change="pageChange" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
			</a-table>
		</template>
	</sub-menu>
</template>

<script>
	import SubModule from '@/components/subModule.vue'
	import fileDownload from 'js-file-download'

	import {
		getCompanyList,
		getHoleNames,
		abnormalList,
		FaultMonitor
	} from '@/request/api'

	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {
				fieldNames: {
					children: 'child',
					label: 'name',
					value: 'id',
				},
				roleID:global.roleID,
				regionData: global.addDegoins,
				RegionID: null,
				regionID: global.regionID,
				companyList: [],
				CompanyID: [],
				cID:global.companyID,
				holeList: [],
				CompanyHoleID: [],
				StartTime: '',
				EndTime: '',
				scrollx: '',
				scrolly: '',
				columns: [{
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
						title: '故障时间',
						dataIndex: 'faultTimeText',
						align: 'center',
					}, {
						title: '内容',
						dataIndex: 'faultContent',
						align: 'center',
					}, {
						title: '备注',
						dataIndex: 'remarks',
						align: 'center',
					}
				],
				loading: false,
				data: [],
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
			
			if(this.roleID === '2')
			{
				this.getHole(this.cID)
			}
			
			let data = {
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize,
				RegionID: this.regionID,
				companyId:this.roleID === '2'?this.cID:this.CompanyID
			}
			// 获取第一页数据
			this.getData(data)
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
			DateChange(date, dateString) {
				this.StartTime = dateString[0]
				this.EndTime = dateString[1]
			},
			getData(data) {
				this.loading = true
				FaultMonitor(data).then(res => {
					if (res.status === '0') {
						this.data = res.result.list
						const pagination = { ...this.pagination
						}
						pagination.total = res.result.total
						this.pagination = pagination
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
			},
			pageChange(pagination, filters, sorter) {
				const pager = { ...this.pagination
				}
				pager.current = pagination.current
				pager.pageSize = pagination.pageSize
				this.pagination = pager
				let data = {
					RegionID: this.RegionID ? this.RegionID : this.regionID,
					CompanyID: this.roleID === '2'?this.cID:this.CompanyID,
					CompanyHoleID: this.CompanyHoleID.constructor == Array ? '' : this.CompanyHoleID,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
					PageIndex: pagination.current - 1,
					PageSize: pagination.pageSize
				}

				this.getData(data)
			},
			search() {
				this.pagination.current = 1
				this.data = []
				let data = {
					RegionID: this.RegionID ? this.RegionID : this.regionID,
					CompanyID: this.roleID === '2'?this.cID:this.CompanyID,
					CompanyHoleID: this.CompanyHoleID.constructor == Array ? '' : this.CompanyHoleID,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize
				}
				this.getData(data)
			},
			tableHeight(data) {
				this.scrolly = data - 75
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
