<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<!-- <a-button type="primary" @click="toAdded">新增</a-button>
			<a-button type="danger" @click="delBatch">删除{{IdBatch.length ? '(' + IdBatch.length + ')' : ''}}</a-button> -->
		</template>
		<template slot="table">
			<a-table :columns="columns" :scroll="{ y: scrolly }" :data-source="data"
				:loading="loading" :rowKey="record => record.id" size="middle" :pagination="pagination"
				@change="pageChange" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
				<!-- <template slot="action" slot-scope="text, record">
					<a-button type="primary" size="small" @click="toEdit(record)">修改</a-button>
				</template> -->
			</a-table>
		</template>
		<template slot="fixed">
			<div id="components-form-demo-advanced-search">
				<a-modal class="ant-advanced-search-form" :maskClosable="false" forceRender :title="modalTitle"
					:visible="modalShow" :width="600" centered :confirm-loading="confirmLoading" @ok="handleOk"
					@cancel="handleCancel">
					<a-form :form="form" layout="inline" labelAlign="right" :labelCol="{span: 8, offset: 0}"
						:wrapperCol="{span: 16, offset: 0}">
						<a-row :gutter="24">
							<a-col :span="12" v-show="false" style="height: 64px;">
								<a-form-item>
									<a-input v-decorator="['id']" />
								</a-form-item>
							</a-col>
							<a-col :span="12" style="height: 64px;">
								<a-form-item label="资源名称">
									<a-input
										v-decorator="['resourceName', { rules: [{ required: true, message: '请输入资源名称' }] }]"
										placeholder="资源名称" />
								</a-form-item>
							</a-col>
							<a-col :span="12" style="height: 64px;">
								<a-form-item label="资源URL">
									<a-input v-decorator="['resourceURL']" placeholder="资源URL" />
								</a-form-item>
							</a-col>
							<a-col :span="12" style="height: 64px;">
								<a-form-item label="资源等级">
									<a-select option-filter-prop="children" v-decorator="['level',{initialValue: 1}]"
										placeholder="资源等级" @change="levelChange">
										<a-select-option :value="1">
											一级资源
										</a-select-option>
										<a-select-option :value="2">
											二级资源
										</a-select-option>
										<a-select-option :value="3">
											三级资源
										</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :span="12" style="height: 64px;" v-show="firstResourceShow">
								<a-form-item label="一级资源">
									<a-select option-filter-prop="children"
										v-decorator="['firstResourceID',{initialValue: []}]" placeholder="一级资源"
										@change="firstResourceChange">
										<a-select-option v-for="item in firstResource" :value="item.id" :key="item.id">
											{{item.name}}
										</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :span="12" style="height: 64px;" v-show="secondResourceShow" >
								<a-form-item label="二级资源">
									<a-select option-filter-prop="children"
										v-decorator="['secondResourceID',{initialValue: []}]" placeholder="二级资源">
										<a-select-option v-for="item in secondResource" :value="item.id" :key="item.id">
											{{item.name}}
										</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :span="24" style="padding-left: 6px;height: 64px;">
								<a-form-item label="备注" :labelCol="{span: 4, offset: 0}"
									:wrapperCol="{span: 20, offset: 0}">
									<a-input v-decorator="['remarks']" placeholder="备注" />
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

	import {
		getResources,
		addResources,
		putResources,
		delResources,
		UpResource,
		DownResource,
		resourcesDetail
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
				columns: [{
						title: '序号',
						dataIndex: 'number',
						scopedSlots: {
							customRender: 'number'
						},
						align: 'center',
						width: 50
					}, {
						title: '资源名称',
						dataIndex: 'resourceName',
						align: 'center'
					}, {
						title: '资源URL',
						dataIndex: 'resourceURL',
						align: 'center'
					}
					// , {
					// 	title: '父资源名称',
					// 	dataIndex: 'parentResourceName',
					// 	align: 'center'
					// }, {
					// 	title: '顺序',
					// 	dataIndex: 'orderNumber',
					// 	align: 'center'
					// }, {
					// 	title: '是否有效',
					// 	dataIndex: 'effectiveText',
					// 	align: 'center'
					// }
					, {
						title: '备注',
						dataIndex: 'remarks',
						align: 'center'
					}, {
						title: '操作',
						scopedSlots: {
							customRender: 'action'
						},
						width: 120,
						align: 'center',
						dataIndex: 'id'
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
				},
				scrolly: '',
				firstResource: [],
				firstResourceShow: false,
				secondResource: [],
				secondResourceShow: false
			};
		},
		created() {
			let data = {
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize
			}
			// 获取第一页数据
			this.getData(data)

			UpResource().then(res => {
				if (res.status === '0') {
					this.firstResource = [...res.result]
				} else {
					console.log(res.message)
				}
				this.loading = false
			})
		},
		mounted() {},
		methods: {
			getData(data) {
				this.loading = true
				getResources(data).then(res => {
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
			// 页码变更
			pageChange(pagination, filters, sorter) {
				const pager = {
					...this.pagination
				}
				pager.current = pagination.current
				pager.pageSize = pagination.pageSize
				this.pagination = pager
				let data = {
					PageIndex: pagination.current - 1,
					PageSize: pagination.pageSize,
				}

				this.getData(data)
			},
			// 新增
			toAdded() {
				this.modalTitle = '新增'
				this.modalShow = true;
			},
			// 提交
			handleOk(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						values.firstResourceID = Array.isArray(values.firstResourceID) ? '' : values
							.firstResourceID
						values.secondResourceID = Array.isArray(values.secondResourceID) ? '' : values
							.secondResourceID
						this.confirmLoading = true
						if (this.modalTitle == '新增') {
							let {
								id,
								...data
							} = values;
							this.added(data)
						} else {
							this.edit(values)
						}
					}
				});
			},
			handleCancel() {
				this.reduction()
				this.modalShow = false;
				this.confirmLoading = false
			},
			// 新增
			toAdded() {
				this.modalTitle = '新增'
				this.modalShow = true;
			},
			added(data) {
				addResources(data).then(res => {
					if (res.status === '0') {
						this.modalShow = false
						this.reduction()
						this.$message.success('添加成功', 3, this.refresh());
					} else {
						console.log(res.message)
					}
					this.confirmLoading = false
				})
			},
			// 修改
			toEdit(data) {
				this.modalTitle = '修改'
				this.modalShow = true;
				resourcesDetail({
					sourceID: data.id
				}).then(res => {
					if (res.status === '0') {
						switch (res.result.level) {
							case 1:
								this.firstResourceShow = false
								this.secondResourceShow = false
								break;
							case 2:
								this.firstResourceShow = true
								break;
							case 3:
								this.firstResourceShow = true
								this.secondResourceShow = true
								DownResource({
									sourceID: res.result.firstResourceID
								}).then(res => {
									if (res.status === '0') {
										this.secondResource = [...res.result]
									} else {
										console.log(res.message)
									}
									this.loading = false
								})
								break;
							default:
								break;
						}

						const {
							firstResource,
							secondResource,
							...param
						} = res.result;

						this.form.setFieldsValue({
							...param,
							...{
								id: data.id
							}
						});
					} else {
						console.log(res.message)
					}
				})
			},
			edit(data) {
				putResources(data).then(res => {
					if (res.status === '0') {
						this.modalShow = false
						this.reduction()
						this.$message.success('修改成功', 3, this.refresh());
					} else {
						console.log(res.message)
					}
					this.confirmLoading = false
				})
			},
			// 初始化form
			reduction() {
				this.form.setFieldsValue({
					resourceName: '',
					resourceURL: '',
					remarks: '',
					level: 1,
					firstResourceID: [],
					secondResourceID: []
				});
				this.firstResourceShow = false
				this.secondResourceShow = false
			},
			delBatch() {
				if (this.IdBatch.length) {
					this.$confirm({
						title: '你确定要删除选择的内容吗？',
						content: '删除之后将不可恢复，请谨慎删除。',
						centered: true,
						onOk: () => {
							delResources({
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
			refresh() {
				this.data = []
				let data = {
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize,
				}
				this.getData(data)
			},
			tableHeight(data) {
				this.scrolly = data - 80
			},
			customRow(record, index) {
				return {
					style: {
						backgroundColor: index % 2 ? '#fff' : '#f0f2f5'
					}
				}
			},
			levelChange(val) {
				this.secondResource = []
				this.form.setFieldsValue({
					firstResourceID: [],
					secondResourceID: []
				})
				switch (val) {
					case 1:
						this.firstResourceShow = false
						this.secondResourceShow = false
						break;
					case 2:
						this.firstResourceShow = true
						break;
					case 3:
						this.firstResourceShow = true
						this.secondResourceShow = true
						break;
					default:
						break;
				}
			},
			firstResourceChange(val) {
				this.form.setFieldsValue({
					secondResourceID: []
				})
				DownResource({
					sourceID: val
				}).then(res => {
					if (res.status === '0') {
						this.secondResource = [...res.result]
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
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
	.ant-advanced-search-form .ant-form-item {
		display: flex;
	}

	.ant-advanced-search-form .ant-form-item-control-wrapper {
		flex: 1;
	}

	#components-form-demo-advanced-search .ant-form {
		max-width: none;
	}
</style>
