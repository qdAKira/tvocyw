<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="modalShow = true">新增</a-button>
			<a-button type="danger" @click="delBatch">删除{{IdBatch.length ? '(' + IdBatch.length + ')' : ''}}</a-button>
		</template>
		<template slot="table">
			<a-table :row-selection="rowSelection" style="height: 100%;" :columns="columns" :data-source="data"
				:loading="loading" :scroll="{ x: scrollx,y: scrolly }" :rowKey="record => record.id" size="middle"
				:pagination="pagination" @change="pageChange" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
			</a-table>
		</template>
		<template slot="fixed">
			<a-modal class="ant-advanced-search-form" :maskClosable="false" forceRender title="新增" :visible="modalShow"
				:width="600" centered :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
				<a-form :form="form" layout="inline" labelAlign="right" :labelCol="{span: 8, offset: 0}"
					:wrapperCol="{span: 16, offset: 0}">
					<a-row :gutter="24">
						<a-col :span="12">
							<a-form-item label="企业名称">
								<a-select placeholder="企业名称" option-filter-prop="children"
									v-decorator="['companyID', { rules: [{ required: true, message: '请选择企业名称' }] }]">
									<a-select-option v-for="item in companys" :key="item.id">{{item.companyName}}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="平衡进">
								<a-input
									v-decorator="['balanceEnter', { rules: [{ required: true, message: '请选择平衡进' }] }]"
									placeholder="平衡进" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="平衡出">
								<a-input
									v-decorator="['balanceOut', { rules: [{ required: true, message: '请选择平衡出' }] }]"
									placeholder="平衡出" />
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
			</a-modal>
		</template>
	</sub-menu>
</template>

<script>
	import SubModule from '@/components/subModule.vue'
	import fileDownload from 'js-file-download'

	import {
		companyConfigBalanceRelations,
		getCompanyList,
		addCompanyConfig,
		delCompanyConfig
	} from '@/request/api'

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
				regionID: global.regionID,
				companys: [],
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
				}, {
					title: '平衡进',
					dataIndex: 'balanceEnter',
					align: 'center',
				}, {
					title: '平衡出',
					dataIndex: 'balanceOut',
					align: 'center',
				}],
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
			getCompanyList({
				regionId: this.regionID,
			}).then(res => {
				if (res.status === '0') {
					this.companys = res.result
				} else {
					console.log(res.message)
				}
			})

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
				companyConfigBalanceRelations(data).then(res => {
					if (res.status === '0') {
						this.data = res.result.list
						const pagination = {
							...this.pagination
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
				const pager = {
					...this.pagination
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
			// 提交
			handleOk(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						this.confirmLoading = true
						addCompanyConfig(values).then(res => {
							if (res.status === '0') {
								this.modalShow = false
								this.reduction()
								this.$message.success('添加成功', 3, this.refresh());
							} else {
								console.log(res.message)
							}
							this.confirmLoading = false
						})
					}
				});
			},
			handleCancel() {
				this.reduction()
				this.modalShow = false;
			},
			// 初始化form
			reduction() {
				this.form.setFieldsValue({
					companyID: [],
					balanceEnter: '',
					balanceOut: ''
				});
			},
			refresh() {
				this.pagination.current = 1
				this.data = []
				let data = {
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize,
				}
				this.getData(data)
			},
			delBatch() {
				if (this.IdBatch.length) {
					this.$confirm({
						title: '你确定要删除选择的内容吗？',
						content: '删除之后将不可恢复，请谨慎删除。',
						centered: true,
						onOk: () => {
							delCompanyConfig({
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
			customRow(record, index) {
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
</style>
