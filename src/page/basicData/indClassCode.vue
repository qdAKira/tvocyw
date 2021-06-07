<template>
	<sub-menu @getHeight="tableHeight($event)">
<!-- 		<template slot="left">
			<a-button type="primary">新建</a-button>
			<a-button type="primary">导入</a-button>
		</template> -->
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
		getIndustryTypes
	} from '@/request/api'

	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {
				replaceFields: {
					children: 'childNameList',
					title: 'regionName',
					key: 'id',
					value: 'regionName'
				},
				columns: [{
						title: '序号',
						dataIndex: 'number',
						scopedSlots: {
							customRender: 'number'
						},
						align: 'center',
						width: 50
					},  {
						title: '行业分类名称',
						dataIndex: 'typeName',
						align: 'center'
					}
				],
				data: [],
				scrollx: '',
				scrolly: '',
				loading: false,
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
			// 获取第一页数据
			this.getData(data)
		},
		mounted() {},
		methods: {
			getData(data) {
				this.loading = true
				getIndustryTypes(data).then(res => {
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
					PageIndex: pagination.current - 1,
					PageSize: pagination.pageSize
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
