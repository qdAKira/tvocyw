<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="showAddModal">新增</a-button>
			<a-button type="primary" @click="download">导出</a-button>
			<a-button type="danger" @click="delBatch">删除{{IdBatch.length ? '(' + IdBatch.length + ')' : ''}}</a-button>
		</template>
		<template slot="right">
			<a-cascader :options="regionData" :fieldNames="fieldNames" placeholder="行政区区域" style="width: 150px" change-on-select
			 @change="regionChange" />
			<a-select show-search v-model="CompanyID" placeholder="企业" option-filter-prop="children" style="width: 150px">
				<a-select-option v-for="item in companyList" :value="item.id" :key="item.id">{{item.companyName}}</a-select-option>
			</a-select>
			<a-input v-model="UserName" placeholder="用户名" />
			<a-button type="primary" @click="search">查询</a-button>
		</template>
		<template slot="table">
			<a-table :row-selection="rowSelection" :columns="columns" :data-source="data" :loading="loading" :rowKey="record => record.id"
			 size="middle" :pagination="pagination" :scroll="{ x: scrollx,y: scrolly }" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
				<template slot="action" slot-scope="text, record">
					<a-button type="primary" size="small" @click="edit(record)">修改</a-button>
				</template>
			</a-table>
		</template>
		<template slot="fixed">
			<div id="components-form-demo-advanced-search">
				<a-modal class="ant-advanced-search-form" forceRender :maskClosable="false" :title="editTile" :visible="addVisible"
				 :width="600" centered :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
					<a-form :form="addform" layout="inline" labelAlign="right" :labelCol="{span: 8, offset: 0}" :wrapperCol="{span: 16, offset: 0}">
						<a-row :gutter="24">
							<a-col :span="12" v-show="false">
								<a-form-item>
									<a-input v-decorator="['id']" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="用户名">
									<a-input v-decorator="['userName', { rules: [{ required: true, message: '请输入用户名' }] }]" placeholder="用户名" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="中文用户名">
									<a-input v-decorator="['chineseUserName']" placeholder="中文用户名" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="密码">
									<div style="display: inline-flex;align-items: center;">
										<a-input-password :disabled="passwordDisabled" v-decorator="['password', { rules: [{ required: !passwordDisabled, message: '请输入密码' }] }]"
										 placeholder="密码" />
										<a-button v-show="editTile == '修改'" type="link" @click="passwordDisabled = !passwordDisabled">{{passwordDisabled ? '修改' : '取消'}}</a-button>
									</div>
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="行政区">
									<a-cascader :options="regionData2" :fieldNames="fieldNames2" placeholder="行政区区域" change-on-select v-decorator="['regionID', { rules: [{ required: true, message: '请选择行政区区域' }] }]"
									 @change="regionChangeAdd" />
								</a-form-item>
							</a-col>
							<a-col :span="12" v-show="false">
								<a-form-item>
									<a-input v-decorator="['region']" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="角色名称">
									<a-select placeholder="角色" label-in-value option-filter-prop="children" v-decorator="['role', { rules: [{ required: true, message: '请选择角色' }] }]"
									 @change="roleChange">
										<a-select-option v-for="item in rolesLsit" :key="item.id">{{item.name}}</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="企业名称">
									<a-select :disabled="companyDisabled" show-search placeholder="企业" label-in-value option-filter-prop="children"
									 v-decorator="['companyID',{ rules: [{ required: !companyDisabled, message: '请选择企业' }] }]">
										<a-select-option v-for="item in companyList2" :key="item.id">{{item.companyName}}</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :span="24" style="padding-left: 6px;">
								<a-form-item label="备注" :labelCol="{span: 4, offset: 0}" :wrapperCol="{span: 20, offset: 0}">
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
	import fileDownload from 'js-file-download'

	import {
		getCompanyList,
		getUsers,
		exportUsers,
		insertUsers,
		delUsers,
		putUsers,
		getRoles
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
				fieldNames2: {
					children: 'child',
					label: 'name',
					value: 'id',
				},
				regionData: global.addDegoins,
				regionID: global.regionID,
				roleID: global.roleID,
				regionData2: global.addDegoins,
				RegionID: null,
				companyList: [],
				companyList2: [],
				CompanyID: [],
				UserName: '',
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
						title: '用户名',
						dataIndex: 'userName',
						align: 'center',
						customCell: (record, index)=>{
						}
					},
					{
						title: '中文用户名',
						dataIndex: 'chineseUserName',
						align: 'center'
					}, {
						title: '角色',
						dataIndex: 'roleName',
						align: 'center'
					},
					{
						title: '行政区',
						dataIndex: 'regionName',
						align: 'center'
					}, {
						title: '企业名称',
						dataIndex: 'companyName',
						align: 'center'
					}, {
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
				addVisible: false,
				confirmLoading: false,
				formLayout: 'horizontal',
				addform: this.$form.createForm(this, {
					name: 'addMoad'
				}),
				editTile: '新增',
				passwordDisabled: false,
				IdBatch: [],
				rolesLsit: [],
				companyDisabled: true,
				regionName:''
			};
		},
		created() {
			// 获取企业列表
			this.getCompany(this.regionID)
			this.getCompanyAdd()
			let data = {
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize,
				RoleID: this.roleID,
				RegionID: this.regionID
			}
			// 获取第一页数据
			this.getData(data)

			getRoles().then(res => {
				if (res.status === '0') {
					this.rolesLsit = res.result
				} else {
					console.log(res.message)
				}
			})
		},
		mounted() {},
		methods: {
			regionChange(value) {
				this.RegionID = value[value.length - 1]
				this.companyList = []
				this.CompanyID = []
				this.getCompany(this.RegionID)
			},
			regionChangeAdd(value, selectedOptions) {
				this.companyList2 = []
				this.addform.setFieldsValue({
					companyID: [],
					region: selectedOptions ? selectedOptions[selectedOptions.length - 1].regionName : ''
				});
				selectedOptions.forEach((item, index) => {
					this.regionName  += index?'/'+ item.name: item.name
				})				
				this.getCompanyAdd(value[value.length - 1])
			},
			// 获取企业列表方法
			getCompany(id) {
				getCompanyList({
					regionId: id ? id : null
				}).then(res => {
					if (res.status === '0') {
						this.companyList = res.result
					} else {
						console.log(res.message)
					}
				})
			},
			getCompanyAdd(id) {
				getCompanyList({
					regionId: id
				}).then(res => {
					if (res.status === '0') {
						this.companyList2 = res.result
					} else {
						console.log(res.message)
					}
				})
			},
			getData(data) {
				this.loading = true
				getUsers(data).then(res => {
					if (res.status === '0') {
						if (res.result) {
							this.data = res.result.list
							const pagination = { ...this.pagination
							}
							pagination.total = res.result.total
							this.pagination = pagination
						}
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
					RegionID: this.RegionID,
					CompanyID: this.CompanyID.constructor == Array ? '' : this.CompanyID,
					UserName: '',
					PageIndex: pagination.current - 1,
					PageSize: pagination.pageSize,
					roleID: this.roleID
				}

				this.getData(data)
			},
			search() {
				this.pagination.current = 1
				this.data = []
				let data = {
					RegionID: this.RegionID ? this.RegionID : this.regionID,
					CompanyID: this.CompanyID.constructor == Array ? '' : this.CompanyID,
					UserName: this.UserName,
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize,
					roleID: this.roleID
				}
				this.getData(data)
			},
			showAddModal() {
				this.editTile = '新增'
				this.passwordDisabled = false
				this.regionData2 = global.addDegoins
				this.addVisible = true;
			},
			// 新增
			addInterface(data) {
				insertUsers(data).then(res => {
					if (res.status === '0') {
						this.addVisible = false
						this.eidtReduction()
						this.$message.success('添加成功', 3, this.refresh());
					} else {
						console.log(res.message)
					}
					this.confirmLoading = false
				})
			},
			// 修改
			modifyInterface(data) {
				if (!data.password) {
					data.password = null
				}
				putUsers(data).then(res => {
					if (res.status === '0') {
						this.addVisible = false
						this.eidtReduction()
						this.$message.success('修改成功', 3, this.refresh());
					} else {
						console.log(res.message)
					}
					this.confirmLoading = false
				})
			},
			// 新增/修改--提交
			handleOk(e) {
				e.preventDefault();
				this.addform.validateFields((err, values) => {
					if (!err) {
						this.confirmLoading = true
						let regionIDLevel = ''
						values.regionID.forEach((item, index) => {
							regionIDLevel += index ? '-' + item : item
						})
						console.log(values.role)
						const data = {
							userName: values.userName,
							chineseUserName: values.chineseUserName ? values.chineseUserName : null,
							password: values.password,
							regionID: Number(values.regionID[values.regionID.length - 1]),
							regionIDLevel: regionIDLevel,
							region: this.regionName,
							roleID: Array.isArray(values.role) ? null : values.role.key,
							roleName: Array.isArray(values.role) ? '' : values.role.label,
							companyID: Array.isArray(values.companyID) ? null : values.companyID.key,
							companyName: Array.isArray(values.companyID) ? '' : values.companyID.label,
							remarks: values.remarks ? values.remarks : ''
						}
						console.log(data)
						if (this.editTile == '新增') {
							this.addInterface(data)
						} else {
							data.id = values.id
							this.modifyInterface(data)
						}
					} else {
						this.$message.error({
							content: res.message,
							key: 'loading',
							duration: 1
						})
					}
				});
			},
			handleCancel() {
				this.eidtReduction()
				this.addVisible = false;
			},
			refresh() {
				this.CompanyID = []
				this.RegionID = this.regionID
				this.UserName = ''
				this.search()
			},
			eidtReduction() {
				this.addform.setFieldsValue({
					userName: '',
					chineseUserName: '',
					password: '',
					regionID: [],
					region: '',
					role: [],
					companyID: [],
					remarks: ''
				});
			},
			edit(data) {
				this.editTile = '修改'
				this.passwordDisabled = true
				this.regionData2 = global.addDegoins
				this.addVisible = true;
				if (data.roleID == 1 || data.roleID == 2) {
					this.companyDisabled = true
				}
				this.addform.setFieldsValue({
					userName: data.userName,
					chineseUserName: data.chineseUserName,
					password: '',
					regionID: data.regoinIDLevel.split("-").map(Number),
					region: data.regionName,
					companyID: data.companyID ? {
						key: data.companyID,
						label: data.companyName
					} : [],
					role: data.roleID ? {
						key: data.roleID,
						label: data.roleName
					} : [],
					remarks: data.remarks,
					id: data.id
				});

			},
			delBatch() {
				if (this.IdBatch.length) {
					this.$confirm({
						title: '你确定要删除选择的用户吗？',
						content: '删除之后将不可恢复，请谨慎删除。',
						centered: true,
						onOk: () => {
							delUsers({
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
			// 角色变化
			roleChange(val) {
				if (val.key == 1 || val.key == 2) {
					this.companyDisabled = true
					this.addform.setFieldsValue({
						companyID: [],
					});
				} else {
					this.companyDisabled = false
				}
			},
			download() {
				let data = {
					RegionID: this.RegionID ? this.RegionID : this.regionID,
					CompanyID: this.CompanyID.constructor == Array ? '' : this.CompanyID,
					UserName: this.UserName,
					roleID: this.roleID
				}
				exportUsers(data).then(res => {
					let blob = new Blob([res],{type:'application/vnd.ms-excel'});
					let url = window.URL.createObjectURL(blob); //表示一个指定的file对象或Blob对象
					let a = document.createElement("a");
					a.download = '用户报表'; //命名下载名称
					a.style.display="none";
					a.href = url;
					document.body.appendChild(a);
					a.click(); //点击触发下载  
					window.URL.revokeObjectURL(a.href); //下载完成进行释放
					document.body.removeChild(a);
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

	/* .table-action {
		display: flex;
		align-items: center;
		justify-content: space-between;
	} */
</style>
