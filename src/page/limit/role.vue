<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="toAdded">新增</a-button>
		</template>
		<template slot="table">
			<a-table style="height: 100%;" :columns="columns" :data-source="data" :scroll="{ x: scrollx,y: scrolly }"
				:loading="loading" :rowKey="record => record.id" size="middle" :pagination="pagination"
				:customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
				<a slot="resources" slot-scope="text, record" href="javascript:;" @click="plan(text)">权限分配</a>
				<template slot="action" slot-scope="text, record">
					<a-button type="primary" size="small" @click="toEdit(record)">修改</a-button>
				</template>
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
							<a-col :span="12" v-show="false">
								<a-form-item>
									<a-input v-decorator="['id']" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="角色名称">
									<a-input
										v-decorator="['roleName', { rules: [{ required: true, message: '请输入角色名称' }] }]"
										placeholder="用户名" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="备注">
									<a-input v-decorator="['remarks']" placeholder="备注" />
								</a-form-item>
							</a-col>
						</a-row>
					</a-form>
				</a-modal>
			</div>
			<a-modal title="资源" :width="800" :visible="resVisible" maskClosable centered
				:confirm-loading="confirmLoading2" @cancel="handleCancel2" @ok="handleOk2">
				<div style="height: 700px;overflow-y: scroll;">
					<a-tree v-model="checkedKeys" checkable :tree-data="treeData" defaultExpandAll />
				</div>
			</a-modal>
		</template>
	</sub-menu>
</template>

<script>
	import SubModule from '@/components/subModule.vue'

	import {
		getRolesList,
		addRole,
		putRole,
		getRoleResources,
		putRoleResources,
		newRoute
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
					width: 60
				}, {
					title: '角色名称',
					dataIndex: 'roleName',
					align: 'center'
				}, {
					title: '备注',
					dataIndex: 'remarks',
					align: 'center'
				}, {
					title: '资源',
					scopedSlots: {
						customRender: 'resources'
					},
					align: 'center',
					width: 120,
					dataIndex: 'id',
					key: 'resources'
				}, {
					title: '操作',
					scopedSlots: {
						customRender: 'action'
					},
					width: 120,
					align: 'center',
					dataIndex: 'id'
				}],
				data: [],
				loading: false,
				pagination: {
					defaultPageSize: 20,
					pageSize: 20,
					current: 1,
					total: 0,
					hideOnSinglePage: true
				},
				resVisible: false,
				resources: [],
				roleId: '',
				scrollx: '',
				scrolly: '',
				treeData: [],
				checkedKeys: [],
				confirmLoading2: false
			};
		},
		created() {
			this.getData()
		},
		mounted() {},
		methods: {
			getData(data) {
				this.loading = true
				getRolesList({
					roleID: global.roleID,
					PageIndex: 0,
					PageSize: 25
				}).then(res => {
					if (res.status === '0') {
						if (res.result) {
							this.data = res.result.list
						}
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
			},
			// 提交
			handleOk(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						this.confirmLoading = true
						if (this.modalTitle == '新增') {
							this.added(values)
						} else {
							this.edit(values)
						}
					}
				});
			},
			handleCancel() {
				this.reduction()
				this.modalShow = false;
			},
			// 新增
			toAdded() {
				this.modalTitle = '新增'
				this.modalShow = true;
			},
			added(data) {
				addRole(data).then(res => {
					if (res.status === '0') {
						this.modalShow = false
						this.reduction()
						this.$message.success('添加成功', 3, this.getData());
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
				this.form.setFieldsValue({
					roleName: data.roleName,
					remarks: data.remarks,
					id: data.id
				});
			},
			edit(data) {
				putRole(data).then(res => {
					if (res.status === '0') {
						this.modalShow = false
						this.reduction()
						this.$message.success('修改成功', 3, this.getData());
					} else {
						console.log(res.message)
					}
					this.confirmLoading = false
				})
			},
			// 初始化form
			reduction() {
				this.form.setFieldsValue({
					roleName: '',
					remarks: ''
				});
			},
			plan(id) {
				this.roleId = id
				getRoleResources({
					roleId: id
				}).then(res => {
					if (res.status === '0') {
						this.resources = res.result
						this.resources.reverse()

						let treeArray = []

						this.resources.forEach(item => {
							const arr = item.resourceLevel.split("-")
							
							if (item.isChoose == 1) {
								this.checkedKeys.push(item.resourceLevel)
							}
							
							item.children = []
							item.key = item.resourceLevel
							item.title = item.resourceName
							if (arr.length == 1) {
								treeArray.push(item)
							} else if (arr.length == 2) {
								treeArray[treeArray.length - 1].children.push(item)
							} else if (arr.length == 3) {
								treeArray[treeArray.length - 1].children[treeArray[treeArray.length -
									1].children.length - 1].children.push(item)
							}
						})
						
						this.treeData = treeArray

						this.resVisible = true
					} else {
						console.log(res.message)
					}
				})
			},
			handleChange(e, id, i) {
				this.resources[i].isChoose = e.target.checked ? 1 : 0
				const data = {
					roleID: this.roleId,
					resourceID: id,
					isChoose: this.resources[i].isChoose
				}
				putRoleResources(data).then(res => {
					if (res.status === '0') {
					} else {
						console.log(res.message)
						this.resources[i].isChoose = e.target.checked ? 0 : 1
					}
				})
			},
			tableHeight(data) {
				this.scrolly = data - 75
			},
			customRow(record, index) {
				return {
					style: {
						backgroundColor: index % 2 ? '#fff' : '#f0f2f5'
					}
				}
			},
			handleOk2() {
				this.confirmLoading2 = true
				putRoleResources({
					roleID: this.roleId,
					nameList: this.checkedKeys
				}).then(res => {
					if (res.status === '0') {
						this.resVisible = false
						this.checkedKeys = []
					} else {
						console.log(res.message)
					}
					this.confirmLoading2 = false
				})
			},
			handleCancel2() {
				this.resVisible = false
				this.checkedKeys = []
			},
			getNewRoute(){
				newRoute({
					roleID: this.roleId
				}).then(res => {
					if (res.status === '0') {
						console.log(res.result)
					} else {
						console.log(res.message)
					}
				})
			}
		}
	})
</script>

<style scoped>
</style>
