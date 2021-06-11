<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="toAdded">新增</a-button>
			<a-button type="danger" @click="delBatch">删除{{IdBatch.length ? '(' + IdBatch.length + ')' : ''}}</a-button>
		</template>
		<template slot="right">
			<a-cascader v-if ="cID==='null'?true:false"   :options="regionData" :fieldNames="fieldNames" placeholder="行政区区域" style="width: 150px"
				change-on-select @change="regionChange" />
			<a-select  v-if ="cID==='null'?true:false"   show-search v-model="CompanyID" placeholder="企业" option-filter-prop="children"
				style="width: 150px" @focus="companyFocus">
				<a-select-option v-for="item in companyList" :value="item.id" :key="item.id">{{item.companyName}}
				</a-select-option>
			</a-select>
			<a-input v-model="MNNumber" placeholder="MN号" />
			<a-button type="primary" @click="search">查询</a-button>
		</template>
		<template slot="table">
			<a-table :row-selection="{ selectedRowKeys: IdBatch, onChange: onSelectChange }" style="height: 100%;"
				:columns="columns" :data-source="data" :loading="loading" :scroll="{ x: scrollx,y: scrolly }"
				:rowKey="record => record.id" size="middle" :pagination="pagination" @change="pageChange"
				:customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
				<template slot="action" slot-scope="text, record">
					<a-button type="primary" size="small" @click="toEdit(record)">修改</a-button>
				</template>
			</a-table>
		</template>
		<template slot="fixed">
			<a-modal class="ant-advanced-search-form" :maskClosable="true" forceRender :title="modalTitle"
				:visible="modalShow" :width="750" centered :confirm-loading="confirmLoading" @ok="handleOk"
				@cancel="handleCancel">
				<a-form :form="form" layout="inline" labelAlign="right" :labelCol="{span: 8, offset: 0}"
					:wrapperCol="{span: 16, offset: 0}">
					<a-row :gutter="24">
						<a-col :span="12" v-show="false">
							<a-form-item>
								<a-input v-decorator="['id',{initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="企业名称">
								<a-select label-in-value option-filter-prop="children"
									v-decorator="['companyID',{ rules: [{ required: true, message: '请选择企业' }],initialValue:[]}]"
									placeholder="企业名称">
									<a-select-option v-for="item in companyList" :key="item.id">{{item.companyName}}</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="排口名称">
								<a-input
									v-decorator="['holeName', { rules: [{ required: true, message: '请输入排口名称' }] ,initialValue: '' }]"
									placeholder="排口名称" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="排口编号">
								<a-input v-decorator="['holeCode',{initialValue: ''}]" placeholder="排口编号" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="监控点性质">
								<a-select label-in-value option-filter-prop="children"
									v-decorator="['pointNatureID',{initialValue: []}]" placeholder="监控点性质">
									<a-select-option v-for="item in pointNatureList" :key="item.id">{{item.name}}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="排口性质">
								<a-select label-in-value option-filter-prop="children"
									v-decorator="['outletNatureID',{initialValue: []}]" placeholder="排口性质">
									<a-select-option v-for="item in outletNatureList" :key="item.id">{{item.name}}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="污染物类别">
								<a-select label-in-value option-filter-prop="children"
									v-decorator="['pollutedTypeID',{initialValue: []}]" placeholder="污染物类别">
									<a-select-option v-for="item in pollutedTypeList" :key="item.id">{{item.name}}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="设备MN号">
								<a-input
									v-decorator="['mnNumber', { rules: [{ required: true, message: '请输入设备MN号' }] ,initialValue: '' }]"
									placeholder="设备MN号" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="排口经度">
								<a-input
									v-decorator="['longitude', { rules: [{ required: true, message: '请输入排口经度' }] ,initialValue: '' }]"
									placeholder="(示例格式): 121.01747297055056" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="排口纬度">
								<a-input
									v-decorator="['latitude', { rules: [{ required: true, message: '请输入排口纬度' }] ,initialValue: '' }]"
									placeholder="(示例格式):32.53790189090469" />
							</a-form-item>
						</a-col>
						<a-col :span="24" style="padding-left: 6px;">
							<a-form-item label="污染物因子" :labelCol="{span: 4, offset: 0}"
								:wrapperCol="{span: 20, offset: 0}">
								<a-checkbox-group v-decorator="['factorList',{initialValue: []}]">
									<a-row>
										<a-col :span="6" v-for="(item,index) in factorList" :key="index">
											<a-checkbox :value="JSON.stringify(item)">
												{{item.factorName}}
											</a-checkbox>
										</a-col>
									</a-row>
								</a-checkbox-group>
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
		getCompanyList,
		companyHoles,
		getFactor,
		natureType
	} from '@/request/api'

	import {
		delCompanyHole,
		insertHole,
		editHole,
		getHoleNature,
		getPollutedFactor,
		getPollutedFactorByID
	} from '@/request/api2'



	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {
				roleID:global.roleID,
				cID:global.companyID,				
				value: [],
				modalShow: false,
				modalTitle: '新增',
				confirmLoading: false,
				form: this.$form.createForm(this, {
					name: 'moad'
				}),
				fieldNames: {
					children: 'child',
					label: 'name',
					value: 'id',
				},
				regionData: global.addDegoins,
				RegionID: null,
				regionID: global.regionID,
				companyList: [],
				pointNatureList: [],
				pollutedTypeList: [],

				factorList: [],
				factorIDs: [],
				factorNames: [],

				CompanyID: [],
				MNNumber: '',
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
						width: 250
					}, {
						title: '排口名称',
						dataIndex: 'holeName',
						align: 'center',
					}, {
						title: '排口编号',
						dataIndex: 'holeCode',
						align: 'center',
					}, {
						title: '监控点性质',
						dataIndex: 'pointNature',
						align: 'center',
					}, {
						title: '排口性质',
						dataIndex: 'outletNature',
						align: 'center',
					}, {
						title: '污染物类别',
						dataIndex: 'pollutedType',
						align: 'center',
					}, {
						title: '设备MN号',
						dataIndex: 'mnNumber',
						align: 'center',
						width: 200
					},{
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
				IdBatch: [],
				selectedRowKeys: [],
				outletNatureList: []
			};
		},
		created() {
			// 获取企业列表
			this.getCompany()

			//获取污染物类别
			getFactor().then(res => {
				if (res.status === '0') {
					this.pollutedTypeList = res.result
				} else {
					console.log(res.message)
				}
			})

			//获取排口监控点性质
			getHoleNature().then(res => {
				if (res.status === '0') {
					this.pointNatureList = res.result
				} else {
					console.log(res.message)
				}
			})
			
			natureType().then(res => {
				if (res.status === '0') {
					this.outletNatureList = res.result
				} else {
					console.log(res.message)
				}
			})

			//获取污染物因子
			getPollutedFactor().then(res => {
				if (res.status === '0') {
					this.factorList = res.result
				} else {
					console.log(res.message)
				}
			})



			let data = {
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize,
				RegionID: global.regionID,
				companyId:this.roleID==='3'?this.cID:this.CompanyID
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
					regionId: this.RegionID ? this.RegionID : this.regionID,
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
			getData(data) {
				this.loading = true
				companyHoles(data).then(res => {
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
					RegionID: this.RegionID ? this.RegionID : this.regionID,
					CompanyID: this.roleID==='3'? this.cID:this.CompanyID,
					MNNumber: '',
					PageIndex: pagination.current - 1,
					PageSize: pagination.pageSize
				}

				this.getData(data)
			},
			search() {
				this.pagination.current = 1
				this.data = []
				let data = {
					RegionID: this.RegionID ? this.RegionID : this.regionID,
					CompanyID: this.roleID==='3'? this.cID:this.CompanyID,
					MNNumber: '',
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize
				}
				this.getData(data)
			},

			// 新增
			toAdded() {
				this.modalTitle = '新增'
				this.modalShow = true;
			},
			toEdit(data) {
				let params = {
					holdId: data.id
				}

				this.modalTitle = '修改'
				this.modalShow = true;
				this.form.setFieldsValue({
					id: data.id,
					companyID: data.companyID ? {
						key: data.companyID,
						label: data.companyName
					} : [],
					holeName: data.holeName,
					holeCode: data.holeCode,
					pointNatureID: data.pointNatureID ? {
						key: data.pointNatureID,
						label: data.pointNature
					} : [],
					pollutedTypeID: data.pollutedTypeID ? {
						key: data.pollutedTypeID,
						label: data.pollutedType
					} : [],
					outletNatureID: data.outletNatureID ? {
						key: data.outletNatureID,
						label: data.outletNature
					}: [],
					mnNumber: data.mnNumber,
					longitude: data.latitude,
					latitude: data.longitude,
					factorList: data.factorList.map(item => {
						return JSON.stringify(item)
					})
				});
			},
			// 提交
			handleOk(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						this.confirmLoading = true

						let data = {
							id: values.id,
							companyID: values.companyID.key,
							companyName: values.companyID.label,
							holeName: values.holeName,
							holeCode: values.holeCode,
							pointNatureID: values.pointNatureID.key,
							pointNature: values.pointNatureID.label,
							pollutedTypeID: values.pollutedTypeID.key,
							pollutedType: values.pollutedTypeID.label,
							outletNatureID: values.outletNatureID.key,
							outletNature: values.outletNatureID.label,
							mnNumber: values.mnNumber,
							factorList: values.factorList.map(item => {
								return JSON.parse(item).id
							}),
							factorNames: values.factorList.map(item => {
								return JSON.parse(item).factorName
							}),
							longitude: values.longitude,
							latitude: values.latitude
						}

						if (this.modalTitle == '新增') {
							this.added(data)
						} else {
							this.edit(data)
						}
						this.confirmLoading = false
					}
				});
			},
			added(data) {
				insertHole(data).then(res => {
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
			edit(data) {
				editHole(data).then(res => {
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
			delBatch() {
				if (this.IdBatch.length) {
					this.$confirm({
						title: '你确定要删除选择的企业排口吗？',
						content: '删除之后将不可恢复，请谨慎删除。',
						centered: true,
						onOk: () => {
							delCompanyHole({
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
			reduction() {
				this.form.setFieldsValue({
					companyID: [],
					holeName: "",
					holeCode: "",
					pointNatureID: [],
					pollutedTypeID: [],
					mnNumber: "",
					id: '',
					longitude: '',
					latitude: '',
					factorList: []
				});
			},
			refresh() {
				this.CompanyID = []
				this.RegionID = null
				this.MNNumber = ''
				this.search()
			},
			checkOnChange(e, checkedValues) {
				if (e.target.checked) {
					this.factorNames.push(checkedValues.factorName);
					this.factorIDs.push(checkedValues.id);
				} else {
					this.factorNames.splice(this.factorNames.indexOf(checkedValues.factorName), 1);
					this.factorIDs.splice(this.factorIDs.indexOf(checkedValues.id), 1);
				}

			},
			tableHeight(data) {
				this.scrolly = data - 75
			},
			handleCancel() {
				this.reduction()
				this.modalShow = false;
			},
			customRow(record, index) {
				return {
					style: {
						backgroundColor: index % 2 ? '#fff' : '#f0f2f5'
					}
				}
			},
			onSelectChange(selectedRowKeys) {
				this.IdBatch = selectedRowKeys
			},
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
