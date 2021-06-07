<template>
	<sub-menu @getHeight="tableHeight($event)">
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

	import {
          getSysCode
	} from '@/request/api2'

	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {
				scrollx: '',
				scrolly: '',
				//columns:[],
				columns: [{
						title: '序号',
						dataIndex: 'number',
						scopedSlots: {
							customRender: 'number'
						},
						align: 'center',
						width: 50
					}, {
						title: '代码名称',
						dataIndex: 'codeName',
						align: 'center'
					}, {
						title: '父代码名称',
						dataIndex: 'parentCodeName',
						align: 'center'
					}
				],
				data: [{
					codeName: '1',
					parentCodeName: '1',
					id: 0
				}, {
					codeName: '1',
					parentCodeName: '1',					
					id: 1
				}, {
					codeName: '1',
					parentCodeName: '1',
					id: 2
				}],
				loading: false,
				//data: [],
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
			
			let data = {
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize
			}
			
			this.getFirstPage(data)
			
			
			
		},
		mounted() {},
		methods: {
			
			getFirstPage(data) {
				this.loading = true
				// 获取列表表头和首页数据
			/* 	this.columns = []
				this.columns = this.columns.concat(this.columnsDefault) */
				getSysCode(data).then(res => {
					if (res.status === '0') {						
						this.dataHandle(res.result, this.pagination)
					} else {
						console.log(res.message)
						this.pagination.total = 0
					}
					this.loading = false
				})
			},
			
			
			dataHandle(data, pagination) {
				this.loading = false
				this.data = data.list
				pagination.total = data.total
				this.pagination = pagination
			},
			
			pageChange(pagination, filters, sorter) {
				this.loading = true
				let data = {
					PageIndex: pagination.current - 1,
					PageSize: pagination.pageSize
				}
			
				this.getData(data, pagination)
			},
			
			
			getData(data,pagination) {
				getSysCode(data).then(res => {
					if (res.status === '0') {
						this.dataHandle(res.result, pagination)
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
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
