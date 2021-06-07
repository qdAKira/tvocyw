<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<!-- <a-button type="primary" @click="toAdded">新增</a-button>
			<a-button type="danger" @click="delBatch">删除{{IdBatch.length ? '(' + IdBatch.length + ')' : ''}}</a-button> -->
		</template>
		<template slot="table">
			<a-table :row-selection="rowSelection" :columns="columns" :data-source="data" :loading="loading" :rowKey="record => record.id"
			 size="middle" :pagination="pagination" @change="pageChange">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
				<template slot="action" slot-scope="text, record">
					<a-button type="primary" size="small" @click="toEdit(record)">修改</a-button>
				</template>
			</a-table>
		</template>
		<template slot="fixed">
			<div id="components-form-demo-advanced-search">
				<a-modal class="ant-advanced-search-form" :maskClosable="false" forceRender :title="modalTitle" :visible="modalShow"
				 :width="600" centered :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
					<a-form :form="form" layout="inline" labelAlign="right" :labelCol="{span: 8, offset: 0}" :wrapperCol="{span: 16, offset: 0}">
						<a-row :gutter="24">
							<a-col :span="12" v-show="false">
								<a-form-item>
									<a-input v-decorator="['id']" />
								</a-form-item>
							</a-col>
						</a-row>
					</a-form>
				</a-modal>
			</div>
		</template>
	</sub-menu>
</template>

<script>
	import SubModule from '@/components/subModule.vue'

	import {} from '@/request/api'

	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {
				modalShow: false,
				modalTitle: '新增',
				confirmLoading: false,
				IdBatch: [],
				form: this.$form.createForm(this, {
					name: 'moad'
				}),
				columns: [{
					title: '序号',
					dataIndex: 'number',
					scopedSlots: {
						customRender: 'number'
					},
					align: 'center'
				}, {
					title: '角色名称',
					dataIndex: 'roleName',
					align: 'center'
				}, {
					title: '资源名称',
					dataIndex: 'resourceName',
					align: 'center'
				}, {
					title: '操作',
					scopedSlots: {
						customRender: 'action'
					},
					width: 120,
					align: 'center',
					dataIndex: 'id'
				}],
				data: []
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
				getResources(data).then(res => {
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
		},computed: {
			rowSelection() {
				return {
					onChange: (selectedRowKeys, selectedRows) => {
						this.IdBatch = selectedRowKeys
					}
				};
			},
		},
	})
</script>

<style scoped>
</style>
