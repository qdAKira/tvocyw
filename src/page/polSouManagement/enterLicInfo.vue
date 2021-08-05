<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="toAdded">新增</a-button>
			<a-button type="danger" @click="delBatch">删除{{IdBatch.length ? '(' + IdBatch.length + ')' : ''}}</a-button>
		</template>
		<template slot="right">
			<a-cascader v-if="cID==='null'?true:false" :options="regionData" :fieldNames="fieldNames"
				placeholder="行政区区域" style="width: 150px" change-on-select @change="regionChange" />
			<a-select v-if="cID==='null'?true:false" show-search v-model="CompanyID" placeholder="企业"
				option-filter-prop="children" style="width: 150px" @focus="companyFocus">
				<a-select-option v-for="item in companyList" :value="item.id" :key="item.id">{{item.companyName}}
				</a-select-option>
			</a-select>
			<a-input v-model="LicenseCode" placeholder="许可证编号" />
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
					<a-button type="primary" size="small" @click="toEdit(record.id)">修改</a-button>
				</template>
			</a-table>
		</template>
		<template slot="fixed">
			<a-modal class="ant-advanced-search-form" :maskClosable="true" forceRender :title="modalTitle"
				:visible="modalShow" :width="750" centered :confirm-loading="confirmLoading" @ok="handleOk"
				@cancel="handleCancel">
				<a-form :form="form" labelAlign="left">
					<a-row :gutter="24">
						<a-col :span="12" v-show="false">
							<a-form-item>
								<a-input v-decorator="['id',{initialValue: ''}]" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="企业名称" :labelCol="{span: 8, offset: 0}"
								:wrapperCol="{span: 16, offset: 0}">
								<a-select label-in-value option-filter-prop="children"
									v-decorator="['companyID',{ rules: [{ required: true, message: '请选择企业' }],initialValue:[]}]"
									placeholder="企业名称" @change="companyChange">
									<a-select-option v-for="item in companyList" :key="item.id">{{item.companyName}}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="排口名称" :labelCol="{span: 8, offset: 0}"
								:wrapperCol="{span: 16, offset: 0}">
								<a-select label-in-value option-filter-prop="children"
									v-decorator="['companyHoleID',{ rules: [{ required: true, message: '请选择排口' }],initialValue:[]}]"
									placeholder="排口名称">
									<a-select-option v-for="item in holeList" :key="item.id">{{item.holeName}}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="许可证编号" :labelCol="{span: 8, offset: 0}"
								:wrapperCol="{span: 16, offset: 0}">
								<a-input
									v-decorator="['licenseCode',{ rules: [{ required: true, message: '请输入许可证编号' }],initialValue: ''}]"
									placeholder="许可证编号" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="发证机关" :labelCol="{span: 8, offset: 0}"
								:wrapperCol="{span: 16, offset: 0}">
								<a-input v-decorator="['licenseOrgan',{initialValue: ''}]" placeholder="发证机关" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="生效日期" :labelCol="{span: 8, offset: 0}"
								:wrapperCol="{span: 16, offset: 0}">
								<a-date-picker
									v-decorator="['effectiveDate', { rules: [{ type: 'object', required: true, message: '请选择生效日期' }]}]"
									style="width: 100%;" :disabled-date="disabledStartDate" show-time format="YYYY-MM-DD HH:mm:ss"
									@openChange="handleStartOpenChange" placeholder="请选择生效日期" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="截止日期" :labelCol="{span: 8, offset: 0}"
								:wrapperCol="{span: 16, offset: 0}">
								<a-date-picker v-decorator="['deadline', { rules: [{ type: 'object', required: true, message: '请选择生效日期' }]}]" style="width: 100%;" :disabled-date="disabledEndDate"
									show-time format="YYYY-MM-DD HH:mm:ss" :open="endOpen"
									@openChange="handleEndOpenChange" placeholder="请选择截止日期" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-form-item style="display: block;">
						<a-table class="enter-tabel" :columns="factorsColumns" :data-source="factorsData" size="small"
							bordered :pagination="false" :rowKey="record => record.key">
							<template slot="pollutantFactor" slot-scope="text, record">
								<a-select v-model="factorAdd.factor" v-if="record.editable" label-in-value
									placeholder="污染物因子" @change="factorChange">
									<a-select-option v-for="item in factorList" :key="item.id">{{item.factorName}}
									</a-select-option>
								</a-select>
								<template v-else>{{text}}</template>
							</template>
							<template slot="dailyEmissions" slot-scope="text, record">
								<a-input v-if="record.editable" v-model="factorAdd.dailyEmissions" placeholder="日排放量" />
								<template v-else>{{text}}</template>
							</template>
							<template slot="yearEmissions" slot-scope="text, record">
								<a-input v-if="record.editable" v-model="factorAdd.yearEmissions" placeholder="年排放量" />
								<template v-else>{{text}}</template>
							</template>
							<template slot="upperLimit" slot-scope="text, record">
								<a-input v-if="record.editable" v-model="factorAdd.upperLimit" placeholder="上限" />
								<template v-else>{{text}}</template>
							</template>
							<template slot="lowerLimit" slot-scope="text, record">
								<a-input v-if="record.editable" v-model="factorAdd.lowerLimit" placeholder="下限" />
								<template v-else>{{text}}</template>
							</template>
							<template slot="operation" slot-scope="text, record, index">
								<div class="operation-cell">
									<a :disabled="disabledIndex != -1 && disabledIndex != index"
										v-show="record.editable" href="javascript:;"
										@click="factorConfirm(record, index)">确认</a>
									<a :disabled="disabledIndex != -1 && disabledIndex != index"
										v-show="record.editable" href="javascript:;"
										@click="factorCancel(record, index)">取消</a>
									<a :disabled="disabledIndex != -1 && disabledIndex != index"
										v-show="!record.editable" href="javascript:;"
										@click="factorEdit(record, index)">编辑</a>
									<a :disabled="disabledIndex != -1 && disabledIndex != index"
										v-show="!record.editable" href="javascript:;"
										@click="factorDel(record, index)">删除</a>
								</div>
							</template>
							<template slot="footer" slot-scope="currentPageData">
								<div style="text-align: center;">
									<a-icon style="cursor: pointer;" :style="{color: adding ? '#ccc' : '' }"
										type="plus-circle" @click="addFactor" />
								</div>
							</template>
						</a-table>
					</a-form-item>
				</a-form>
			</a-modal>
		</template>
	</sub-menu>
</template>

<script>
	import SubModule from '@/components/subModule.vue'
	import fileDownload from 'js-file-download'
	import moment from "moment"

	import {
		AddLicensePollutants,
		updateLicenses,
		getCompanyList,
		companyLicenses,
		getHoleNames,
		addCompanyLicenses,
		delDalanceDetail,
		getBalanceDetailInfo,
		delLicensePollutants,
		putLicensePollutants
	} from '@/request/api'

	import {
		getPollutedFactor
	} from '@/request/api2'

	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {
				roleID: global.roleID,
				cID: global.companyID,
				effectiveDate: null,
				deadline: null,
				endOpen: false,

				fieldNames: {
					children: 'child',
					label: 'name',
					value: 'id',
				},
				regionData: global.addDegoins,
				RegionID: null,
				regionID: global.regionID,
				companyList: [],
				CompanyID: [],
				holeList: [],
				LicenseCode: '',
				scrollx: '',
				scrolly: '',
				columns: [{
					title: '序号',
					dataIndex: 'number',
					scopedSlots: {
						customRender: 'number'
					},
					width: 50,
					align: 'center',
				}, {
					title: '企业名称',
					dataIndex: 'companyName',
					align: 'center',
				}, {
					title: '排口名称',
					dataIndex: 'companyHole',
					align: 'center',
				}, {
					title: '许可证编号',
					dataIndex: 'licenseCode',
					align: 'center',
				}, {
					title: '发证机关',
					dataIndex: 'licenseOrgan',
					align: 'center',
				}, {
					title: '生效日期',
					dataIndex: 'effectiveDateText',
					align: 'center',
				}, {
					title: '截止日期',
					dataIndex: 'deadlineText',
					align: 'center',
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
				IdBatch: [],
				selectedRowKeys: [],
				confirmLoading: false,
				modalTitle: '新增',
				form: this.$form.createForm(this, {
					name: 'moad'
				}),
				modalShow: false,
				factorsColumns: [{
					title: '污染物因子',
					dataIndex: 'pollutantFactor',
					scopedSlots: {
						customRender: 'pollutantFactor'
					},
					width: 120,
					align: 'center',
				}, {
					title: '日排放量',
					dataIndex: 'dailyEmissions',
					scopedSlots: {
						customRender: 'dailyEmissions'
					},
					width: 120,
					align: 'center',
				}, {
					title: '年排放量',
					dataIndex: 'yearEmissions',
					scopedSlots: {
						customRender: 'yearEmissions'
					},
					width: 120,
					align: 'center',
				}, {
					title: '上限',
					dataIndex: 'upperLimit',
					scopedSlots: {
						customRender: 'upperLimit'
					},
					width: 120,
					align: 'center',
				}, {
					title: '下限',
					dataIndex: 'lowerLimit',
					scopedSlots: {
						customRender: 'lowerLimit'
					},
					width: 120,
					align: 'center',
				}, {
					title: '操作',
					dataIndex: 'operation',
					scopedSlots: {
						customRender: 'operation'
					},
					align: 'center',
				}],
				licenseData: [],
				factorsData: [],
				factorList: [],
				factorAdd: {
					dailyEmissions: "",
					factor: [],
					lowerLimit: "",
					upperLimit: "",
					yearEmissions: "",
					editable: false
				},
				factorAddID: null,
				licenseID: null,
				factorTitle: "确认",
				adding: false,
				disabledIndex: -1
			};
		},

		watch: {
			effectiveDate(val) {},
			deadline(val) {},
		},

		created() {
			// 获取企业列表
			this.getCompany()
			let data = {
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize,
				RegionID: global.regionID,
				companyId: this.roleID === '2' ? this.cID : this.CompanyID
			}
			// 获取第一页数据
			this.getData(data)

			//获取污染物因子
			getPollutedFactor().then(res => {
				if (res.status === '0') {
					this.factorList = res.result
					this.factorList = res.result.map(item => {
						delete item.isChoose
						return item
					})
				} else {
					console.log(res.message)
				}
			})
		},
		mounted() {},
		methods: {
			disabledStartDate(effectiveDate) {
				const deadline = this.deadline;
				if (!effectiveDate || !deadline) {
					return false;
				}
				return effectiveDate.valueOf() > deadline.valueOf();
			},

			disabledEndDate(deadline) {
				const effectiveDate = this.effectiveDate;
				if (!deadline || !effectiveDate) {
					return false;
				}
				return effectiveDate.valueOf() >= deadline.valueOf();
			},


			handleStartOpenChange(open) {
				if (!open) {
					this.endOpen = true;
				}
			},


			handleEndOpenChange(open) {
				this.endOpen = open;
			},

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
				companyLicenses(data).then(res => {
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
					CompanyID: this.roleID === '2' ? this.cID : this.CompanyID,
					LicenseCode: this.LicenseCode,
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
					CompanyID: this.roleID === '2' ? this.cID : this.CompanyID,
					LicenseCode: this.LicenseCode,
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
			// 新增
			toAdded() {
				this.modalShow = true;
				this.modalTitle = '新增'
			},



			// 提交
			handleOk(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						this.confirmLoading = true
						const factors = this.factorsData.map(item => {
							return {
								pollutantFactorID: item.pollutantFactorID,
								pollutantFactor: item.pollutantFactor,
								dailyEmissions: item.dailyEmissions,
								yearEmissions: item.yearEmissions,
								upperLimit: item.upperLimit,
								lowerLimit: item.lowerLimit
							}
						})
						console.log(values)

						values.companyName = values.companyID.label
						values.companyID = values.companyID.key
						values.companyHole = values.companyHoleID.label ? values.companyHoleID.label : this
							.licenseData.companyHole
						values.companyHoleID = values.companyHoleID.key
						values.licenseCode = values.licenseCode
						values.licenseOrgan = values.licenseOrgan
						values.deadline = moment(this.deadline).format('YYYY-MM-DD HH:mm:ss')
						values.effectiveDate = moment(this.effectiveDate).format('YYYY-MM-DD HH:mm:ss')
						let data = values
						if (this.modalTitle == '修改') {
							updateLicenses(data).then(res => {
								if (res.status === '0') {
									this.modalShow = false
									this.$message.success('修改成功', 3, this.refresh());
								} else {
									console.log(res.message)
								}
								this.reduction()
								this.confirmLoading = false
							})
						}
						if (this.modalTitle == '新增') {
							data.factors = factors
							addCompanyLicenses(data).then(res => {
								if (res.status === '0') {
									this.modalShow = false
									this.$message.success('添加成功', 3, this.refresh());
								} else {
									console.log(res.message)
								}
								this.reduction()
								this.confirmLoading = false
							})
						}
					}
				});
			},
			// 取消
			handleCancel() {
				this.reduction()
				this.modalShow = false;
			},
			// 初始化
			reduction() {
				this.form.setFieldsValue({
					companyID: [],
					companyHoleID: [],
					licenseCode: '',
					licenseOrgan: '',
					deadline: null,
					effectiveDate: null
				});
				this.effectiveDate = null,
					this.deadline = null,
					this.adding = false
				this.disabledIndex = -1
				this.factorsData = []
				this.holeList = []
				this.licenseData = []
				this.factorAddID = null
				this.licenseID = null
			},
			dateChange1(date, dateString) {},
			companyChange(data) {
				getHoleNames({
					companyId: data.key,
				}).then(res => {
					if (res.status === '0') {
						this.holeList = res.result
					} else {
						console.log(res.message)
					}
				})
			},
			factorChange(data) {
				// console.log(data)
				// const factor = {
				// 	pollutantFactorID: data.key,
				// 	pollutantFactor: data.label
				// }
				// this.factorAdd.factor = factor
			},
			factorEdit(record, index) {
				// this.factorAdd = this.factorsData[index]
				this.adding = true
				if (this.factorsData[index].pollutantFactorID) {
					const factor = {
						key: this.factorsData[index].pollutantFactorID,
						label: this.factorsData[index].pollutantFactor
					}
					this.factorAdd.factor = factor
				} else {
					this.factorAdd.factor = []
				}
				this.factorAdd.dailyEmissions = this.factorsData[index].dailyEmissions
				this.factorAdd.yearEmissions = this.factorsData[index].yearEmissions
				this.factorAdd.upperLimit = this.factorsData[index].upperLimit
				this.factorAdd.lowerLimit = this.factorsData[index].lowerLimit
				this.disabledIndex = index
				this.factorsData[index].editable = true
				this.factorAddID = this.factorsData[index].licensePollutantID
				this.factorTitle = '编辑'
			},
			factorConfirm(record, index) {

				if (this.modalTitle == '修改') {
					if (this.factorTitle == '确认') {
						let factor = {
							companyLicenseID: this.licenseID,
							pollutantFactorID: this.factorAdd.factor.key,
							dailyEmissions: this.factorAdd.dailyEmissions + '',
							yearEmissions: this.factorAdd.yearEmissions + '',
							upperLimit: this.factorAdd.upperLimit + '',
							lowerLimit: this.factorAdd.lowerLimit + '',
						};
						AddLicensePollutants(factor).then(res => {
							if (res.status === '0') {
								//this.$message.success('修改成功', 3)
								// this.modalShow = false
								// this.reduction()
								this.$message.success('添加成功', 3);
								this.factorAddID = res.result
							} else {
								console.log(res.message)
							}
						})
					}
					if (this.factorTitle == '编辑') {
						let factor = {
							id: this.factorAddID,
							pollutantFactorID: this.factorAdd.factor.key,
							dailyEmissions: this.factorAdd.dailyEmissions + '',
							yearEmissions: this.factorAdd.yearEmissions + '',
							upperLimit: this.factorAdd.upperLimit + '',
							lowerLimit: this.factorAdd.lowerLimit + '',
						};
						putLicensePollutants(factor).then(res => {
							if (res.status === '0') {
								this.$message.success('修改成功', 3)
								// this.reduction()
								//this.$message.success('添加成功', 3, this.refresh());
								//this.factorAddID =res.result
							} else {
								console.log(res.message)
							}
						})
					}

				} else {

				}

				if (Array.isArray(this.factorAdd.factor)) {
					this.factorsData[index].pollutantFactorID = ''
					this.factorsData[index].pollutantFactor = ''
				} else {
					this.factorsData[index].pollutantFactorID = this.factorAdd.factor.key
					this.factorsData[index].pollutantFactor = this.factorAdd.factor.label
				}

				this.factorsData[index].licensePollutantID = this.factorAddID
				this.factorsData[index].dailyEmissions = this.factorAdd.dailyEmissions
				this.factorsData[index].yearEmissions = this.factorAdd.yearEmissions
				this.factorsData[index].upperLimit = this.factorAdd.upperLimit
				this.factorsData[index].lowerLimit = this.factorAdd.lowerLimit

				this.factorAdd = {
					factor: [],
					dailyEmissions: '',
					yearEmissions: '',
					upperLimit: '',
					lowerLimit: '',
				}
				this.factorsData[index].editable = false
				this.disabledIndex = -1
				this.adding = false
			},
			factorCancel(record, index) {
				this.factorsData[index].editable = false
				this.disabledIndex = -1
				this.adding = false
				if (this.factorTitle == '确认') {
					this.factorsData.splice(index, 1)
				}
			},
			addFactor() {
				if (!this.adding) {
					this.factorsData.push({
						pollutantFactorID: this.factorList[0].id,
						pollutantFactor: this.factorList[0].factorName,
						dailyEmissions: '',
						yearEmissions: '',
						upperLimit: '',
						lowerLimit: '',
						editable: true
					})

					const factor = {
						key: this.factorList[0].id,
						label: this.factorList[0].factorName,
					}
					this.factorAdd.factor = factor
				}

				this.factorsData.forEach((item, index) => {
					item.key = index + 1
				})
				this.factorAdd = {
					factor: [],
					dailyEmissions: '',
					yearEmissions: '',
					upperLimit: '',
					lowerLimit: '',
				}
				this.disabledIndex = this.factorsData.length - 1
				this.adding = true
				this.factorTitle = '确认'
			},
			factorDel(record, index) {
				this.$confirm({
					title: '你确定要删除吗？',
					centered: true,
					onOk: () => {
						delLicensePollutants({
							id: [record.licensePollutantID],
						}).then(res => {
							if (res.status === '0') {
								this.$message.success('删除成功', 3)
								// this.modalShow = false
								// this.reduction()
								// this.$message.success('添加成功', 3, this.refresh());
								if (this.adding && index == this.factorsData.length - 1) {
									this.adding = false
								}
								this.factorsData.splice(index, 1)
							} else {
								console.log(res.message)
							}
						})
					},
					onCancel() {
						console.log('Cancel')
					},
				});

				// if (this.adding && index == this.factorsData.length - 1) {
				// 	this.adding = false
				// }
				// this.factorsData.splice(index, 1)
			},
			refresh() {
				this.CompanyID = []
				this.RegionID = null
				this.LicenseCode = ''
				this.search()
			},
			onSelectChange(selectedRowKeys) {
				this.IdBatch = selectedRowKeys
			},
			delBatch() {
				if (this.IdBatch.length) {
					this.$confirm({
						title: '你确定要删除选择的企业排口吗？',
						content: '删除之后将不可恢复，请谨慎删除。',
						centered: true,
						onOk: () => {
							delDalanceDetail({
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
			async toEdit(id) {
				const companyId = await getBalanceDetailInfo({
					id: id,
				}).then(res => {
					if (res.status === '0') {
						const data = res.result

						this.form.setFieldsValue({
							id: id,
							companyID: data.companyID ? {
								key: data.companyID,
								label: data.companyName
							} : [],
							companyHoleID: data.companyHoleID ? {
								key: data.companyHoleID,
								label: data.companyHoleName
							} : [],
							licenseCode: data.licenseCode,
							licenseOrgan: data.licenseOrgan,
							effectiveDate:moment(data.effectiveDate).format('YYYY-MM-DD HH:mm:ss'),
							deadline:moment(data.deadline).format('YYYY-MM-DD HH:mm:ss')

						})
						this.licenseID = data.id
						this.factorsData = data.pollutantFactors
						this.factorsData.forEach((item, index) => {
							item.key = index + 1
						})
						console.log(this.$moment(data.effectiveDate, 'YYYY-MM-DD HH:mm:ss'))
						// this.effectiveDate = this.$moment(data.effectiveDate, 'YYYY-MM-DD HH:mm:ss')
						// this.deadline = this.$moment(data.deadlineText, 'YYYY-MM-DD HH:mm:ss')
						this.licenseData = data
						return data.companyID
					} else {
						console.log(res.message)
					}
				})

				getHoleNames({
					companyId: companyId,
				}).then(res => {
					if (res.status === '0') {
						this.holeList = res.result
					} else {
						console.log(res.message)
					}
				})

				this.modalTitle = '修改'
				this.modalShow = true;
			},
		}
	})
</script>

<style scoped>
	.operation-cell {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
</style>

<style>
	.enter-tabel .ant-table-placeholder {
		display: none;
	}

	.noneClass .ant-select-selection__placeholder {
		color: #f5222d;
	}
</style>
