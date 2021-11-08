<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="showAddModal">新增</a-button>
		</template>
		<template slot="right">
			<a-cascader v-if="cID==='null'?true:false" :options="regionData" :fieldNames="fieldNames"
				placeholder="行政区区域" style="width: 150px" change-on-select @change="regionChange" />
			<a-select v-if="cID==='null'?true:false" show-search v-model="CompanyID" placeholder="企业"
				option-filter-prop="children" style="width: 150px" @focus="companyFocus">
				<a-select-option v-for="item in companyList" :value="item.id" :key="item.id">{{item.companyName}}
				</a-select-option>
			</a-select>
			<a-button type="primary" @click="search">查询</a-button>
		</template>
		<template slot="table">
			<a-table style="height: 100%;" :columns="columns" :data-source="data" :loading="loading"
				:scroll="{ x: scrollx,y: scrolly }" :rowKey="record => record.id" size="middle" :pagination="pagination"
				@change="pageChange" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
			</a-table>
		</template>
		<template slot="fixed">
			<div id="components-form-demo-advanced-search">
				<a-modal class="ant-advanced-search-form" forceRender :maskClosable="false" title="新增"
					:visible="addVisible" :width="700" centered :confirm-loading="confirmLoading" @ok="handleOk"
					@cancel="handleCancel">
					<a-form :form="addform" layout="inline" labelAlign="right" :labelCol="{span: 8, offset: 0}"
						:wrapperCol="{span: 16, offset: 0}">
						<a-row :gutter="24">
							<a-col :span="12">
								<a-form-item label="联系人姓名">
									<a-input
										v-decorator="['contactPersonName', {rules: [{ required: true, message: '请输入联系人姓名' }],initialValue: ''}]"
										placeholder="联系人姓名" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="企业名称">
									<a-select show-search option-filter-prop="children"
										v-decorator="['companyID',{rules: [{ required: true, message: '请选择企业名称' }],initialValue: []}]"
										placeholder="企业名称" @change="companyChange">
										<a-select-option v-for="item in companyList2" :key="item.id">
											{{item.companyName}}
										</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :span="12" v-show="false">
								<a-form-item>
									<a-input v-decorator="['companyName', {initialValue: ''}]" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="联系人电话">
									<a-input
										v-decorator="['contactPersonPhone', {rules: [{ required: true, message: '请输入联系人电话' }],initialValue: ''}]"
										placeholder="联系人电话" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="联系人职位">
									<a-input v-decorator="['contactPersonJob', {initialValue: ''}]"
										placeholder="联系人职位" />
								</a-form-item>
							</a-col>
							<a-col :span="24" style="padding-left: 4px;">
								<a-form-item label="备注" :labelCol="{span: 4, offset: 0}"
									:wrapperCol="{span: 20, offset: 0}">
									<a-input v-decorator="['remarks', {initialValue: ''}]" placeholder="备注" />
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
		getHoleNames,
		contactPersons,
		addContactPersons
	} from '@/request/api'

	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {
				roleID: global.roleID,
				value: undefined,
				fieldNames: {
					children: 'regionChilds',
					label: 'name',
					value: 'id',
				},
				regionData: global.regoins,
				RegionID: null,
				companyList: [],
				CompanyID: [],
				cID: global.companyID,
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
					title: '联系人姓名',
					dataIndex: 'contactPersonName',
					align: 'center',
				}, {
					title: '联系人电话',
					dataIndex: 'contactPersonPhone',
					align: 'center',
				}, {
					title: '联系人职位',
					dataIndex: 'contactPersonJob',
					align: 'center',
				}, {
					title: '备注',
					dataIndex: 'remarks',
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
				},
				addVisible: false,
				confirmLoading: false,
				addform: this.$form.createForm(this, {
					name: 'addMoad'
				}),
				companyList2: []
			};
		},
		created() {
			// 获取企业列表
			this.getCompany()
			getCompanyList({
				regionId: this.RegionID
			}).then(res => {
				if (res.status === '0') {
					this.companyList2 = res.result
				} else {
					console.log(res.message)
				}
			})
			let data = {
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize,
				companyId: this.roleID === '2' ? this.cID : this.CompanyID
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
					regionId: this.RegionID
				}).then(res => {
					if (res.status === '0') {
						this.companyList = res.result
					} else {
						console.log(res.message)
					}
				})
			},
			companyFocus() {
				this.getCompany()
			},
			DateChange(date, dateString) {
				this.StartTime = dateString[0]
				this.EndTime = dateString[1]
			},
			getData(data) {
				this.loading = true
				contactPersons(data).then(res => {
					if (res.status === '0') {
						if (res.result) {
							this.data = res.result.list
							const pagination = {
								...this.pagination
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
				const pager = {
					...this.pagination
				}
				pager.current = pagination.current
				pager.pageSize = pagination.pageSize
				this.pagination = pager
				let data = {
					RegionID: this.RegionID,
					CompanyID: this.roleID === '2' ? this.cID : this.CompanyID,
					PageIndex: pagination.current - 1,
					PageSize: pagination.pageSize
				}

				this.getData(data)
			},
			search() {
				this.pagination.current = 1
				this.data = []
				let data = {
					RegionID: this.RegionID,
					CompanyID: this.roleID === '2' ? this.cID : this.CompanyID,
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize
				}
				this.getData(data)
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
			showAddModal() {
				this.addVisible = true;
			},
			handleOk(e) {
				e.preventDefault();
				this.addform.validateFields((err, values) => {
					if (!err) {
						this.confirmLoading = true
						addContactPersons(values).then(res => {
							if (res.status === '0') {
								this.addVisible = false
								this.eidtReduction()
								this.$message.success('添加成功', 3, this.refresh());
							} else {
								console.log(res.message)
							}
							this.confirmLoading = true
						})
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
			companyChange(val) {
				let company = JSON.stringify(this.companyList2)
				company = JSON.parse(company)
				const item = company.find(value => {
					return value.id = val
				})
				this.addform.setFieldsValue({
					companyName: item.companyName
				})
			},
			eidtReduction() {
				this.addform.setFieldsValue({
					companyID: '',
					companyName: '',
					contactPersonName: '',
					contactPersonPhone: '',
					contactPersonJob: '',
					remarks: '',
				});
			},
			refresh() {
				this.CompanyID = []
				this.RegionID = this.regionID
				this.search()
			},
		}
	})
</script>

<style scoped>
</style>
