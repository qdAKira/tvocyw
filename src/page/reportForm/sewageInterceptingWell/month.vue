<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="download">导出</a-button>
			<a-button type="primary" @click="chartOpen">图表</a-button>
		</template>
		<template slot="right">
			<a-select show-search v-model="WellID" placeholder="监控点名称" option-filter-prop="children" style="width: 120px"
			 @change="wellChange">
				<a-select-option v-for="item in wellList" :value="item.id" :key="item.id">{{item.wellName}}</a-select-option>
			</a-select>
<!-- 			<a-select v-model="WellMonitorPointID" placeholder="截污井监控点名称" option-filter-prop="children" style="width: 120px">
				<a-select-option v-for="item in wellMonitorPointList" :value="item.id" :key="item.id">{{item.monitorPointName}}</a-select-option>
			</a-select> -->
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
		<template slot="fixed">
			<modal ref="modal" title="数据统计与报表/水质数据报表/月数据报表" :wellList="wellList" avg cou :getData="chartData"></modal>
		</template>
	</sub-menu>
</template>

<script>
	import SubModule from '@/components/subModule.vue'
	import modal from '@/components/chart/well.vue'
	import fileDownload from 'js-file-download'

	import {
		wellNames,
		wellMonitorPoint,
		wellMonthDatas,
		wellMonthChart
	} from '@/request/api'

	import {
        exportWellMonthData
	} from '@/request/api2'

	export default ({
		components: {
			'sub-menu': SubModule,
			'modal': modal
		},
		data() {
			return {
				wellList: [],
				WellID: [],
				wellMonitorPointList: [],
				//WellMonitorPointID: [],
				StartTime: '',
				EndTime: '',
				scrollx: '',
				scrolly: '',
				fieldNames: {
					children: 'childNameList',
					label: 'regionName',
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
						title: '监控点名称',
						dataIndex: 'wellName',
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
			// 获取截污井名称列表
			wellNames().then(res => {
				if (res.status === '0') {
					this.wellList = res.result
				} else {
					console.log(res.message)
				}
			})
			let data = {
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize
			}
			// 获取第一页数据
			this.getFirstPage(data)
		},
		mounted() {},
		methods: {
			wellChange(value) {
				this.getWellMonitorPoint(value)
			},
			getWellMonitorPoint(id) {
				wellMonitorPoint({
					regionId: id
				}).then(res => {
					if (res.status === '0') {
						// this.holeList = res.result
					} else {
						console.log(res.message)
					}
				})
			},
			DateChange(date, dateString) {
				this.StartTime = dateString[0]
				this.EndTime = dateString[1]
			},
			getFirstPage(data){
				this.loading = true
				// 获取列表表头和首页数据
				this.columns = []
				this.columns = this.columns.concat(this.columnsDefault)
				wellMonthDatas(data).then(res => {
					if (res.status === '0') {
						const polluteDict = res.result.list[0].polluteDict
						
						const isFixed = Object.keys(polluteDict).length > 10
						
						this.scrollx = isFixed ? 400 : ''
						
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
				wellMonthDatas(data).then(res => {
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
					WellID: this.WellID.constructor == Array ? '' : this.WellID,
					//WellMonitorPointID: this.WellMonitorPointID.constructor == Array ? '' : this.WellMonitorPointID,
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
			search() {
				this.pagination.current = 1
				this.data = []
				let data = {
					WellID: this.WellID.constructor == Array ? '' : this.WellID,
					//WellMonitorPointID: this.WellMonitorPointID.constructor == Array ? '' : this.WellMonitorPointID,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize
				}
				this.getFirstPage(data)
			},
			
			download() {
				let params = {
					WellID: this.WellID.constructor == Array ? '' : this.WellID,
					//WellMonitorPointID: this.WellMonitorPointID.constructor == Array ? '' : this.WellMonitorPointID,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
				}
				exportWellMonthData(params).then(res => {
                    var iframe =document.createElement("iframe")
                    iframe.style.display ="none";
                    iframe.src = res.result;
                    document.body.appendChild(iframe);
				})
			},
			
			tableHeight(data) {
				this.scrolly = data - 75
			},
			chartOpen() {
				this.$refs.modal.visible = true
			},
			chartData(data) {
				wellMonthChart(data).then(res => {
					if (res.status === '0') {
						if (res.result.avgList && res.result.avgList.length) {
							this.$refs.modal.avgData = res.result.avgList
							this.$refs.modal.avgunit = res.result.avgUnit
						}
						if ( res.result.rtdList && res.result.rtdList.length) {
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
