<template>
	<sub-menu @getHeight="tableHeight($event)">
		<!-- <template slot="left">
			<a-button type="primary" @click="showAddModal">新增</a-button>
		    <a-button type="danger" @click="delBatch">删除{{IdBatch.length ? '(' + IdBatch.length + ')' : ''}}</a-button>
		</template> -->
		<template slot="table">
<!-- 			<a-table :row-selection="rowSelection" :columns="columns" :data-source="data" :loading="loading" :rowKey="record => record.id"
			 size="middle" :pagination="pagination" @change="pageChange">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
				<template slot="action" slot-scope="text, record">
					<a-button type="primary" size="small" @click="edit(record)">修改</a-button>
				</template> 
			</a-table>

 -->

			<a-table style="height: 100%;" :columns="columns" :data-source="data" :loading="loading" :scroll="{ x: scrollx,y: scrolly }"
			 :rowKey="record => record.id" size="middle" :pagination="pagination" @change="pageChange" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
			</a-table>
		</template>
		<template slot="fixed">
			<!-- <div id="components-form-demo-advanced-search">
				<a-modal class="ant-advanced-search-form" forceRender :title="editTile" :visible="addVisible" :width="600" centered
				 :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
					<a-form :form="addform" layout="inline" labelAlign="right" :labelCol="{span: 8, offset: 0}" :wrapperCol="{span: 16, offset: 0}">
						<a-row :gutter="24">
							<a-col :span="12" v-show="false">
								<a-form-item>
									<a-input v-decorator="['id']" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="参数名称">
									<a-input v-decorator="['paramName', { rules: [{ required: true, message: '请输入参数名称' }] }]" placeholder="参数名称" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="参数内容">
									<a-input v-decorator="['paramContent', { rules: [{ required: true, message: '请输入参数内容' }] }]" placeholder="参数内容" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="参数说明">
									<a-input v-decorator="['paramExplain']" placeholder="参数说明" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="排序">
									<a-input v-decorator="['orderNumber']" placeholder="排序" />
								</a-form-item>
							</a-col>
						</a-row>
					</a-form>
				</a-modal>
			</div> -->
		</template>
	</sub-menu>
</template>


<script>
	import SubModule from '@/components/subModule.vue'

	import {
		getSysParam,
		insertSysParam,
		delSysParam,
		putSysParam
	} from '@/request/api2'


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
				scrollx: '',
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
						title: '参数名称',
						dataIndex: 'paramName',
						align: 'center'
					},
					{
						title: '参数内容',
						dataIndex: 'paramContent',
						align: 'center'
					},
					{
						title: '参数说明',
						dataIndex: 'paramExplain',
						align: 'center'
					},
					{
						title: '顺序',
						dataIndex: 'orderNumber',
						align: 'center'
					},
					// {
					// 	title: '操作',
					// 	scopedSlots: {
					// 		customRender: 'action'
					// 	},
					// 	width: 120,
					// 	align: 'center',
					// 	dataIndex: 'id'
					// }
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
				scrolly: '',
				// addVisible: false,
				// confirmLoading: false,
				// formLayout: 'horizontal',
				// addform: this.$form.createForm(this, {
				// 	name: 'addMoad'
				// }),
				// editTile: '新增',
				// IdBatch: [],
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
				this.columns = []
				this.columns = this.columns.concat(this.columnsDefault)
				getSysParam(data).then(res => {
					if (res.status === '0') {
						if (res.result) {
							this.dataHandle(res.result, this.pagination)
						} else{
							this.pagination.total = 0
						}
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


			getData(data, pagination) {
				getSysParam(data).then(res => {
					if (res.status === '0') {
						this.dataHandle(res.result, pagination)
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
			},
			showAddModal() {
				this.editTile = '新增'
				this.addVisible = true;
			},


			// 新增/修改--提交
			// handleOk(e) {
			// 	e.preventDefault();
			// 	this.addform.validateFields((err, values) => {
			// 		if (!err) {
			// 			console.log(values)
			// 			this.confirmLoading = true
			// 			const data = {
			// 				paramName: values.paramName,
			// 				paramContent: values.paramContent,
			// 				paramExplain: values.paramExplain ? values.paramExplain : null,
			// 				orderNumber: Number(values.orderNumber)
			// 			}
			// 			if (this.editTile == '新增') {
			// 				this.addInterface(data)
			// 			} else {
			// 				data.id = values.id
			// 				this.modifyInterface(data)
			// 			}
			// 		} else {
			// 			this.$message.error({
			// 				content: res.message,
			// 				key: 'loading',
			// 				duration: 1
			// 			})
			// 		}
			// 	});
			// },



			// // 新增
			// addInterface(data) {
			// 	console.log(data)
			// 	insertSysParam(data).then(res => {
			// 		if (res.status === '0') {
			// 			this.addVisible = false
			// 			this.eidtReduction()
			// 			this.$message.success('添加成功', 3, this.refresh());
			// 		} else {
			// 			console.log(res.message)
			// 		}
			// 		this.confirmLoading = false
			// 	})
			// },

			// //修改			
			// modifyInterface(data) {
			// 	console.log(data)
			// 	console.log("前")
			// 	putSysParam(data).then(res => {
			// 		console.log("后")
			// 		console.log(res)
			// 		if (res.status === '0') {
			// 			this.addVisible = false
			// 			this.eidtReduction()
			// 			this.$message.success('修改成功', 3, this.refresh());
			// 		} else {
			// 			console.log(res.message)
			// 		}
			// 		this.confirmLoading = false
			// 	})
			// },

			handleCancel() {
				this.eidtReduction()
				this.addVisible = false;
			},
			refresh() {
				this.search()
			},

			search() {
				this.pagination.current = 1
				this.data = []
				let data = {
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize
				}
				this.getFirstPage(data)
			},


			eidtReduction() {
				this.addform.setFieldsValue({
					paramName: '',
					paramContent: '',
					paramExplain: '',
					orderNumber: ''
				});
			},

			edit(data) {
				this.editTile = '修改'
				this.addVisible = true;
				this.addform.setFieldsValue({
					paramName: data.paramName,
					paramContent: data.paramContent,
					paramExplain: data.paramExplain,
					orderNumber: data.orderNumber,
					id: data.id
				});
			},
			delBatch() {
				if (this.IdBatch.length) {
					this.$confirm({
						title: '你确定要删除选项吗？',
						content: '删除之后将不可恢复，请谨慎删除。',
						centered: true,
						onOk: () => {
							delSysParam({
								id: this.IdBatch
							}).then(res => {
								if (res.status === '0') {
									this.$message.success('删除成功', 3, this.refresh());
									this.IdBatch = []
								} else {
									console.log(res.message)
								}
							})
						},
						onCancel() {
							console.log('Cancel')
						},
					});
				}
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
		},
		computed: {
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
	/* .ant-advanced-search-form {
		padding: 24px;
		background: #fbfbfb;
		border: 1px solid #d9d9d9;
		border-radius: 6px;
	}

	.ant-advanced-search-form .ant-form-item {
		display: flex;
	}

	.ant-advanced-search-form .ant-form-item-control-wrapper {
		flex: 1;
	}

	#components-form-demo-advanced-search .ant-form {
		max-width: none;
	}

	.table-action {
		display: flex;
		align-items: center;
		justify-content: space-between;
	} */
</style>
