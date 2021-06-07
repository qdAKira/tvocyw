<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="showAddModal">新增</a-button>
		</template>
		<template slot="right">
			<a-cascader :options="regionData" :fieldNames="fieldNames" placeholder="行政区区域" style="width: 150px"
				change-on-select @change="regionChange" />
			<a-select show-search v-model="CompanyID" placeholder="企业" option-filter-prop="children"
				style="width: 150px" @focus="companyFocus">
				<a-select-option v-for="item in companyList" :value="item.id" :key="item.id">{{item.companyName}}
				</a-select-option>
			</a-select>
			<a-range-picker @change="DateChange" />
			<a-button type="primary" @click="search">查询</a-button>
		</template>
		<template slot="table">
			<a-table style="height: 100%;" :columns="columns" :data-source="data"
				:scroll="{ x: scrollx,y: scrolly }" :rowKey="record => record.id" size="middle" :pagination="pagination"
				@change="pageChange" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
			</a-table>
		</template>
		<template slot="fixed">
			<div id="components-form-demo-advanced-search">
				<a-modal class="ant-advanced-search-form" forceRender :title="editTile" :visible="addVisible"
					:width="775" centered :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
					<a-form :form="addform" layout="inline" labelAlign="right" :labelCol="{span: 8, offset: 0}"
						:wrapperCol="{span: 16, offset: 0}">
						<a-row :gutter="24">
							<!-- 							<a-col :span="12" v-show="false">
								<a-form-item>
									<a-input v-decorator="['id']" />
								</a-form-item>
							</a-col> -->
							<a-col :span="12">
								<a-form-item label="企业名称">
									<a-select placeholder="企业名称" label-in-value option-filter-prop="children"
										v-decorator="['CompanyID', { rules: [{ required: true, message: '请选择企业名称' }] }]"
										@change="companyChange">
										<a-select-option v-for="item in companys" :key="item.id">{{item.companyName}}
										</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>

							<a-col :span="12">
								<a-form-item label="排口名称">
									<a-select placeholder="排口名称" label-in-value option-filter-prop="children"
										v-decorator="['CompanyHoleID', { rules: [{ required: true, message: '请选择排口' }] }]"
										@change="holeChange">
										<a-select-option v-for="item in holeList" :key="item.id">{{item.holeName}}
										</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>

							<a-col :span="12">
								<a-form-item label="阀门名称">
									<a-select placeholder="阀门名称" label-in-value option-filter-prop="children"
										v-decorator="['valveNameID', { rules: [{ required: true, message: '请选择阀门' }] }]">
										<a-select-option v-for="item in valveList" :key="item.id">{{item.name}}
										</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>

							<a-col :span="12">
								<a-form-item label="阀门执行事项">
									<a-select placeholder="阀门执行事项" label-in-value option-filter-prop="children"
										v-decorator="['ExecutionEventID', { rules: [{ required: true, message: '请选择阀门执行事项' }] }]"
										@change="eventChange">
										<a-select-option v-for="item in events" :key="item.id">{{item.name}}
										</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>

							<a-col :span="12" v-show="statusDisabled">
								<a-form-item label="阀门状态">
									<!-- <a-input :disabled="statusDisabled" v-decorator="['ValveStatus']"
										placeholder="0至100 : 0代表“关”,100代表“开”" /> -->
									<a-switch v-decorator="['ValveStatus',{valuePropName: 'checked'}]" checked-children="开" un-checked-children="关" />
								</a-form-item>
							</a-col>

							<a-col :span="12">
								<a-form-item label="备注">
									<a-input v-decorator="['Remarks']" placeholder="备注" />
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
		controlValves,
		ValveName
	} from '@/request/api'

	import {
		insertValve
	} from '@/request/api2'


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
				regionData: global.addDegoins,
				RegionID: null,
				regionID: global.regionID,
				companyList: [],
				companys: [],
				events: [{
					"id": 22,
					"name": "阀门控制"
				}, {
					"id": 23,
					"name": "提取阀门状态"
				}],
				holeList: [],
				CompanyID: [],
				companyIdKey: '',
				StartTime: '',
				EndTime: '',
				CompanyName: '',
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
					title: '排口名称',
					dataIndex: 'companyHole',
					align: 'center',
				}, {
					title: '操作时间',
					dataIndex: 'operateTimeText',
					align: 'center',
				}, {
					title: '阀门状态',
					dataIndex: 'valveStatusText',
					align: 'center',
				}, {
					title: '阀门执行事项',
					dataIndex: 'executionEvent',
					align: 'center',
				}, {
					title: '执行结果',
					dataIndex: 'executionResult',
					align: 'center',
				}, {
					title: '控制方式',
					dataIndex: 'controlModel',
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
				formLayout: 'horizontal',
				addform: this.$form.createForm(this, {
					name: 'addMoad'
				}),
				editTile: '新增',
				statusDisabled: true,
				valveList: []
			};
		},
		created() {
			// 获取企业列表
			this.getCompany()
			let data = {
				RegionID: this.regionID,
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize
			}


			getCompanyList({
				regionId: this.regionID
			}).then(res => {
				if (res.status === '0') {
					this.companys = res.result
				} else {
					console.log(res.message)
				}
			})



			// 获取第一页数据
			this.getData(data)
		},
		mounted() {
			setInterval(()=>{
				this.search()
			},3000)
		},
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
			DateChange(date, dateString) {
				this.StartTime = dateString[0]
				this.EndTime = dateString[1]
			},
			getData(data) {
				this.loading = true
				controlValves(data).then(res => {
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
					RegionID: this.RegionID ? this.RegionID : this.regionID,
					CompanyID: this.CompanyID.constructor == Array ? null : this.CompanyID,
					StartTime: this.StartTime == '' ? null : this.StartTime,
					EndTime: this.EndTime == '' ? null : this.EndTime,
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize
				}

				this.getData(data)
			},
			search() {
				this.pagination.current = 1
				// this.data = []
				let data = {
					RegionID: this.RegionID ? this.RegionID : this.regionID,
					CompanyID: this.CompanyID.constructor == Array ? null : this.CompanyID,
					StartTime: this.StartTime == '' ? null : this.StartTime,
					EndTime: this.EndTime == '' ? null : this.EndTime,
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize
				}
				this.getData(data)
			},

			showAddModal() {
				this.editTile = '新增'
				this.addVisible = true;
				this.addform.setFieldsValue({
					ValveStatus: false
				})
			},

			// 根据企业ID获取排口列表
			companyChange(val) {
				this.holeList = [];
				this.valveList = []
				this.addform.setFieldsValue({
					CompanyHoleID: [],
					valveNameID: []
				});
				this.companyIdKey = val.key;
				this.getHoles(this.companyIdKey)
			},

			// 根据企业获取排口
			getHoles(holdId) {
				getHoleNames({
					companyId: holdId
				}).then(res => {
					if (res.status === '0') {
						this.holeList = res.result
					} else {
						console.log(res.message)
					}
				})
			},

			holeChange(val) {
				this.valveList = []
				this.addform.setFieldsValue({
					valveNameID: []
				});
				this.getValve(val.key)
			},

			getValve(holdId) {
				ValveName({
					holeId: holdId
				}).then(res => {
					if (res.status === '0') {
						this.valveList = res.result
					} else {
						console.log(res.message)
					}
				})
			},

			eventChange(val) {
				if (val.key == 22) {
					this.statusDisabled = true;
				} else {
					this.statusDisabled = false;
				}

			},

			// 新增/修改--提交
			handleOk(e) {
				e.preventDefault();
				this.addform.validateFields((err, values) => {
					if (!err) {
						const data = {
							companyID: values.CompanyID.key,
							companyName: values.CompanyID.label,
							companyHoleID: values.CompanyHoleID.key,
							companyHole: values.CompanyHoleID.label,
							executionEventID: values.ExecutionEventID.key,
							executionEvent: values.ExecutionEventID.label,
							valveStatus: values.ValveStatus ? '100' : '0',
							// valueStatusText: values.ValveStatus ? values.ValveStatus : '提取阀门状态',
							valveNameID: values.valveNameID.key,
							valveName: values.valveNameID.label,
							remarks: values.Remarks ? values.Remarks : ''
						}

						if (data.executionEventID == '23') {
							data.valveStatus = ''
						}

						this.$confirm({
							title: '提醒！',
							content: '确定对 ' + data.companyName + '' + data.companyHole + '的 ' + data
								.valveName + '进行 ' + data.executionEvent + '吗',
							centered: true,
							mask: false,
							onOk: () => {
								if (this.editTile == '新增') {
									this.confirmLoading = true
									this.addInterface(data)
								} else {
									//data.id = values.id
									//this.modifyInterface(data)
								}
							},
							onCancel() {

							},
						});
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

			// 新增
			addInterface(data) {
				insertValve(data).then(res => {
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
			refresh() {
				this.search()
			},
			eidtReduction() {
				this.addform.setFieldsValue({
					CompanyID: [],
					CompanyHoleID: [],
					valveNameID: [],
					ExecutionEventID: [],
					ValveStatus: false,
					Remarks: ''
				});
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
			}
		}
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

	.table-action {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
