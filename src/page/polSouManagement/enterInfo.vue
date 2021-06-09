<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="toAdded">新增</a-button>
			<a-button type="primary">导入</a-button>
		    <a-button type="danger" @click="delBatch">删除{{IdBatch.length ? '(' + IdBatch.length + ')' : ''}}</a-button>
		</template>
		<template slot="right">
			<a-cascader v-if ="cID==='null'?true:false"  :options="regionData" :fieldNames="fieldNames" placeholder="行政区区域" style="width: 150px"
				change-on-select @change="regionChange" />
			<a-select v-if ="cID==='null'?true:false"   show-search v-model="CompanyID" placeholder="企业" option-filter-prop="children"
				style="width: 150px" @focus="companyFocus">
				<a-select-option v-for="item in companyList" :value="item.id" :key="item.id">{{item.companyName}}
				</a-select-option>
			</a-select>
			<a-select v-model="IndustryTypeID" placeholder="行业类别" style="width: 120px">
				<a-select-option v-for="item in industryTypeList" :value="item.id" :key="item.id">{{item.name}}
				</a-select-option>
			</a-select>
			<a-select v-model="PollutedLevelID" placeholder="污染物等级" style="width: 120px">
				<a-select-option v-for="item in pollutedLevelList" :value="item.id" :key="item.id">{{item.name}}
				</a-select-option>
			</a-select>
			<a-button type="primary" @click="search">查询</a-button>
		</template>
		<template slot="table">
			<a-table :row-selection="rowSelection" style="height: 100%;" :columns="columns" :data-source="data"
				:loading="loading" :scroll="{ x: scrollx,y: scrolly }" :rowKey="record => record.id" size="middle"
				:pagination="pagination" @change="pageChange" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
				<template slot="action" slot-scope="text, record">
					<a-button type="primary" size="small" @click="toEdit(record)">修改</a-button>
				</template>
			</a-table>
		</template>
		<template slot="fixed">
			<a-modal class="ant-advanced-search-form" :maskClosable="false" forceRender :title="modalTitle"
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
							<a-form-item label="污染源编码">
								<a-input v-decorator="['pollutedSourceCode',{initialValue: ''}]" placeholder="污染源编码" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="组织机构代码">
								<a-input
									v-decorator="['organCode', { rules: [{ required: true, message: '请输入组织机构代码' }] ,initialValue: '' }]"
									placeholder="组织机构代码" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="企业名称">
								<a-input
									v-decorator="['companyName', { rules: [{ required: true, message: '请输入企业名称' }],initialValue: '' }]"
									placeholder="企业名称" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="企业简称">
								<a-input v-decorator="['companyShortName',{initialValue: ''}]" placeholder="企业简称" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="行政区">
								<a-cascader :options="regionData2" :fieldNames="fieldNames2" placeholder="行政区区域"
									change-on-select
									v-decorator="['regionID', { rules: [{ required: true, message: '请选择行政区区域' }] ,initialValue: [] }]"
									@change="regionChangeAdd" />
							</a-form-item>
						</a-col>
						<a-col :span="12" v-show="false">
							<a-form-item>
								<a-input v-decorator="['region',{initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="注册类型">
								<a-select label-in-value option-filter-prop="children"
									v-decorator="['registerType',{initialValue: []}]" placeholder="注册类型">
									<a-select-option v-for="item in registerTypeList" :key="item.id">{{item.name}}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="单位类别">
								<a-select label-in-value option-filter-prop="children"
									v-decorator="['companyType',{initialValue: []}]" placeholder="单位类别">
									<a-select-option v-for="item in companyTypeList" :key="item.id">{{item.name}}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="单位隶属关系">
								<a-select label-in-value option-filter-prop="children"
									v-decorator="['companyRelationship',{initialValue: []}]" placeholder="单位隶属关系">
									<a-select-option v-for="item in companyRelationList" :key="item.id">{{item.name}}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="企业规模">
								<a-select label-in-value option-filter-prop="children"
									v-decorator="['companyScope',{initialValue: []}]" placeholder="企业规模">
									<a-select-option v-for="item in companyScopeList" :key="item.id">{{item.name}}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="行业类型">
								<a-select label-in-value option-filter-prop="children"
									v-decorator="['industryType',{initialValue: []}]" placeholder="行业类型">
									<a-select-option v-for="item in industryTypeList" :key="item.id">{{item.name}}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="污染源等级">
								<a-select label-in-value option-filter-prop="children"
									v-decorator="['pollutedSourceLevel',{initialValue: []}]" placeholder="污染源等级">
									<a-select-option v-for="item in pollutedLevelList" :key="item.id">{{item.name}}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="地址">
								<a-input v-decorator="['addressName',{initialValue: ''}]" placeholder="地址" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="中心经度">
								<a-input v-decorator="['longitude',{ rules: [{ required: true, message: '请输入企业经度' }],initialValue: '' }]" placeholder="中心经度" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="中心纬度">
								<a-input v-decorator="['latitude',{ rules: [{ required: true, message: '请输入企业纬度' }],initialValue: '' }]" placeholder="中心纬度" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="环保机构名称">
								<a-input v-decorator="['environmentProtectionName',{initialValue: ''}]"
									placeholder="环保机构名称" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="企业负责人">
								<a-input v-decorator="['companyResponsibleLeader',{initialValue: ''}]"
									placeholder="企业负责人" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="企业负责人电话">
								<a-input v-decorator="['companyResponsibleLeaderPhone',{initialValue: ''}]"
									placeholder="企业负责人电话" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="环保负责人">
								<a-input v-decorator="['epResponsibleLeader',{initialValue: ''}]" placeholder="环保负责人" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="环保负责人电话">
								<a-input v-decorator="['epResponsibleLeaderPhone',{initialValue: ''}]"
									placeholder="环保负责人电话" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="企业状态">
								<a-input v-decorator="['companyStatus',{initialValue: ''}]" placeholder="企业状态" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="排序">
								<a-input type="number" v-decorator="['sort',{initialValue: ''}]" placeholder="排序" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="备注">
								<a-input v-decorator="['remarks',{initialValue: ''}]" placeholder="备注" />
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
		getIndustryType,
		getPollutedLevel,
		companyBases,
		getRegisterType,
		getCompanyType,
		getCompanyRelation,
		getCompanyScope,
		addCompanyBases,
		putCompanyBases
	} from '@/request/api'
	
	import{
	     delCompanyBase,
	} from '@/request/api2'




	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {
				roleID:global.roleID,
				cID:global.companyID,	
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
				fieldNames2: {
					children: 'child',
					label: 'name',
					value: 'id',
				},
				registerTypeList: [],
				companyTypeList: [],
				companyRelationList: [],
				companyScopeList: [],
				industryTypeList: [],
				pollutedLevelList: [],
				regionData2: global.addDegoins,
				regionData: global.addDegoins,
				RegionID: null,
				regionID: global.regionID,
				companyList: [],
				CompanyID: [],
				IndustryTypeID: [],
				PollutedLevelID: [],
				scrollx: 2910,
				scrolly: '',
				columns: [{
					title: '序号',
					dataIndex: 'number',
					scopedSlots: {
						customRender: 'number'
					},
					align: 'center',
					fixed: 'left',
					width: 50
				}, {
					title: '污染源编码',
					dataIndex: 'pollutedSourceCode',
					align: 'center',
					fixed: 'left',
					width: 100
				}, {
					title: '组织结构代码',
					dataIndex: 'organCode',
					align: 'center',
					fixed: 'left',
					width: 200
				}, {
					title: '企业名称',
					dataIndex: 'companyName',
					align: 'center',
					fixed: 'left',
					width: 200
				}, {
					title: '企业简称',
					dataIndex: 'companyShortName',
					align: 'center',
					fixed: 'left',
					width: 100
				}, {
					title: '行政区',
					dataIndex: 'regionName',
					align: 'center',
					width: 100
				}, {
					title: '注册类型',
					dataIndex: 'registerType',
					align: 'center',
					width: 100
				}, {
					title: '单位类别',
					dataIndex: 'companyType',
					align: 'center',
					width: 120
				}, {
					title: '单位隶属关系',
					dataIndex: 'companyRelationship',
					align: 'center',
					width: 120
				}, {
					title: '企业规模',
					dataIndex: 'companyScope',
					align: 'center',
					width: 100
				}, {
					title: '行业分类',
					dataIndex: 'industryTypeName',
					align: 'center',
					width: 100
				}, {
					title: '污染源等级',
					dataIndex: 'pollutedSourceLevel',
					align: 'center',
					width: 100
				}, {
					title: '地址',
					dataIndex: 'addressName',
					align: 'center',
					width: 500
				}, {
					title: '中心经度',
					dataIndex: 'longitude',
					align: 'center',
					width: 150
				}, {
					title: '中心纬度',
					dataIndex: 'latitude',
					align: 'center',
					width: 150
				}, {
					title: '环保机构名称',
					dataIndex: 'environmentProtectionName',
					align: 'center',
					width: 100
				}, {
					title: '企业负责人',
					dataIndex: 'companyResponsibleLeader',
					align: 'center',
					width: 100
				}, {
					title: '企业负责人电话',
					dataIndex: 'companyResponsibleLeaderPhone',
					align: 'center',
					width: 120
				}, {
					title: '环保负责人',
					dataIndex: 'epResponsibleLeader',
					align: 'center',
					width: 100
				}, {
					title: '环保负责人电话',
					dataIndex: 'epResponsibleLeaderPhone',
					align: 'center',
					width: 120
				}, {
					title: '企业状态',
					dataIndex: 'companyStatus',
					align: 'center',
					width: 100
				}, {
					title: '排序',
					dataIndex: 'sort',
					align: 'center',
					width: 100
				}, {
					title: '备注',
					dataIndex: 'remarks',
					align: 'center',
					width: 100
				}, {
					title: '操作',
					scopedSlots: {
						customRender: 'action'
					},
					width: 120,
					fixed: 'right',
					align: 'center',
					dataIndex: 'id'
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
				IdBatch: []
			};
		},
		created() {
			// 获取企业列表
			this.getCompany()
			// 获取行业类别
			getIndustryType().then(res => {
				if (res.status === '0') {
					this.industryTypeList = res.result
				} else {
					console.log(res.message)
				}
			})
			// 获取污染物等级
			getPollutedLevel().then(res => {
				if (res.status === '0') {
					this.pollutedLevelList = res.result
				} else {
					console.log(res.message)
				}
			})
			// 获取注册类型
			getRegisterType().then(res => {
				if (res.status === '0') {
					this.registerTypeList = res.result
				} else {
					console.log(res.message)
				}
			})

			// 获取单位类别
			getCompanyType().then(res => {
				if (res.status === '0') {
					this.companyTypeList = res.result
				} else {
					console.log(res.message)
				}
			})

			getCompanyRelation().then(res => {
				if (res.status === '0') {
					this.companyRelationList = res.result
				} else {
					console.log(res.message)
				}
			})

			getCompanyScope().then(res => {
				if (res.status === '0') {
					this.companyScopeList = res.result
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
				companyBases(data).then(res => {
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
					PollutedLevelID: this.PollutedLevelID.constructor == Array ? '' : this.PollutedLevelID,
					IndustryTypeID: this.IndustryTypeID.constructor == Array ? '' : this.IndustryTypeID,
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
					PollutedLevelID: this.PollutedLevelID.constructor == Array ? '' : this.PollutedLevelID,
					IndustryTypeID: this.IndustryTypeID.constructor == Array ? '' : this.IndustryTypeID,
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize
				}
				this.getData(data)
			},
			tableHeight(data) {
				this.scrolly = data - 75
			},
			regionChangeAdd(value, selectedOptions) {
				this.form.setFieldsValue({
					region: selectedOptions ? selectedOptions[selectedOptions.length - 1].name : ''
				});
			},
			// 新增
			toAdded() {
				this.modalTitle = '新增'
				this.modalShow = true;
			},
			// 修改
			toEdit(data) {
				this.modalTitle = '修改'
				this.modalShow = true;
				this.form.setFieldsValue({
					id: data.id,
					addressName: data.addressName,
					companyName: data.companyName,
					companyRelationship: data.companyRelationshipID ? {
						key: data.companyRelationshipID,
						label: data.companyRelationship
					} : [],
					companyResponsibleLeader: data.companyResponsibleLeader,
					companyResponsibleLeaderPhone: data.companyResponsibleLeaderPhone,
					companyScope: data.companyScopeID ? {
						key: data.companyScopeID,
						label: data.companyScope
					} : [],
					companyShortName: data.companyShortName,
					companyStatus: data.companyStatus,
					companyType: data.companyTypeID ? {
						key: data.companyTypeID,
						label: data.companyType
					} : [],
					environmentProtectionName: data.environmentProtectionName,
					epResponsibleLeader: data.epResponsibleLeader,
					epResponsibleLeaderPhone: data.epResponsibleLeaderPhone,
					industryType: data.industryTypeID ? {
						key: data.industryTypeID,
						label: data.industryType
					} : [],
					latitude: data.latitude,
					longitude: data.longitude,
					organCode: data.organCode,
					pollutedSourceCode: data.pollutedSourceCode,
					pollutedSourceLevel: data.pollutedSourceLevelID ? {
						key: data.pollutedSourceLevelID,
						label: data.pollutedSourceLevel
					} : [],
					region: data.regionName,
					regionID: data.regionIDLevel.split("-").map(Number),
					registerType: data.registerTypeID ? {
						key: data.registerTypeID,
						label: data.registerType
					} : [],
					remarks: data.remarks,
					sort: data.sort,
				});
			},
			// 提交
			handleOk(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {

						values.regionIDLevel = ''

						values.regionID.forEach((item, index) => {
							values.regionIDLevel += index ? '-' + item : item
						})

						values.regionID = values.regionID[values.regionID.length - 1]

						values.registerTypeID = Array.isArray(values.registerType) ? null : values.registerType
							.key
						values.registerType = Array.isArray(values.registerType) ? '' : values.registerType
							.label

						values.companyTypeID = Array.isArray(values.companyType) ? null : values
							.companyType.key
						values.companyType = Array.isArray(values.companyType) ? '' : values.companyType
							.label

						values.companyRelationshipID = Array.isArray(values.companyRelationship) ? null :
							values.companyRelationship.key
						values.companyRelationship = Array.isArray(values.companyRelationship) ? '' : values
							.companyRelationship.label

						values.companyScopeID = Array.isArray(values.companyScope) ? null : values.companyScope
							.key
						values.companyScope = Array.isArray(values.companyScope) ? '' : values.companyScope
							.label

						values.industryTypeID = Array.isArray(values.industryType) ? null : values.industryType
							.key
						values.industryType = Array.isArray(values.industryType) ? '' : values.industryType
							.label

						values.pollutedSourceLevelID = Array.isArray(values.pollutedSourceLevel) ? null :
							values.pollutedSourceLevel.key
						values.pollutedSourceLevel = Array.isArray(values.pollutedSourceLevel) ? '' : values
							.pollutedSourceLevel.label

						values.sort = Number(values.sort)

						if (this.modalTitle == '新增') {
							this.added(values)
						} else {
							this.edit(values)
						}
					}
				});
			},
			added(data) {
				addCompanyBases(data).then(res => {
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
			edit(data){
				putCompanyBases(data).then(res => {
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
						title: '你确定要删除选择的企业吗？',
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
						
			refresh() {
				this.CompanyID = []
				this.RegionID = null
				this.PollutedLevelID = []
				this.IndustryTypeID = []
				this.search()
			},
			reduction() {
				this.form.setFieldsValue({
					addressName: "",
					companyName: "",
					companyRelationship: [],
					companyResponsibleLeader: "",
					companyResponsibleLeaderPhone: "",
					companyScope: [],
					companyShortName: "",
					companyStatus: "",
					companyType: [],
					environmentProtectionName: "",
					epResponsibleLeader: "",
					epResponsibleLeaderPhone: "",
					industryType: [],
					latitude: "",
					longitude: "",
					organCode: "",
					pollutedSourceCode: "",
					pollutedSourceLevel: [],
					region: "",
					regionID: [],
					registerType: [],
					remarks: "",
					sort: "",
					id: ''
				});
			},
			handleCancel() {
				this.reduction()
				this.modalShow = false;
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
</style>
