<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="toAdded">新增</a-button>
		</template>
		<template slot="right">
			<a-cascader :options="regionData" :fieldNames="fieldNames" placeholder="行政区区域" style="width: 150px" change-on-select
			 @change="regionChange" />
			<a-select show-search v-model="CompanyID" placeholder="企业" option-filter-prop="children" style="width: 150px" @focus="companyFocus">
				<a-select-option v-for="item in companyList" :value="item.id" :key="item.id">{{item.companyName}}</a-select-option>
			</a-select>
			<a-range-picker @change="DateChange" />
			<a-button type="primary" @click="search">查询</a-button>
		</template>
		<template slot="table">
			<a-table style="height: 100%;" :columns="columns" :data-source="data" :scroll="{ x: scrollx,y: scrolly }"
			 :rowKey="record => record.id" size="middle" :pagination="pagination" @change="pageChange" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
			</a-table>
		</template>
		<template slot="fixed">
			<a-modal class="ant-advanced-search-form" :maskClosable="false" forceRender title="新增" :visible="modalShow" :width="700" centered
			 :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
				<a-form :form="form" layout="inline" labelAlign="right" :labelCol="{span: 8, offset: 0}" :wrapperCol="{span: 16, offset: 0}">
					<a-row :gutter="24">
						<a-col :span="12">
							<a-form-item label="企业名称">
								<a-select show-search placeholder="企业" label-in-value option-filter-prop="children"
								 v-decorator="['company',{ rules: [{ required: true, message: '请选择企业' }] }]" @change="companyChange">
									<a-select-option v-for="item in companyList2" :key="item.id">{{item.companyName}}</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="排口名称">
								<a-select placeholder="排口" label-in-value v-decorator="['companyHole',{ rules: [{ required: true, message: '请选择排口' }] }]" >
									<a-select-option v-for="item in holeList" :value="item.id" :key="item.id">{{item.holeName}}</a-select-option>
								</a-select>
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
		</template>
	</sub-menu>
</template>

<script>
	import SubModule from '@/components/subModule.vue'
	import fileDownload from 'js-file-download'

	import {
		getCompanyList,
		accessControls,
		addaCcessControls,
		getHoleNames
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
				regionData: global.addDegoins,
				RegionID: null,
				regionID: global.regionID,
				companyList: [],
				companyList2: [],
				holeList: [],
				CompanyID: [],
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
				confirmLoading: false,
				form: this.$form.createForm(this, {
					name: 'Moad'
				}),
				modalShow: false
			};
		},
		created() {
			// 获取企业列表
			this.getCompany()
			let data = {
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize,
				RegionID: global.regionID
			}
			// 获取第一页数据
			this.getData(data)
			
			getCompanyList({
				regionId: this.regionID
			}).then(res => {
				if (res.status === '0') {
					this.companyList2 = res.result
				} else {
					console.log(res.message)
				}
			})
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
				accessControls(data).then(res => {
					if (res.status === '0') {
						this.data = res.result.list
						const pagination = { ...this.pagination
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
				const pager = { ...this.pagination
				}
				pager.current = pagination.current
				pager.pageSize = pagination.pageSize
				this.pagination = pager
				let data = {
					RegionID: this.RegionID ? this.RegionID : this.regionID,
					CompanyID: this.CompanyID.constructor == Array ? '' : this.CompanyID,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
					PageIndex: pagination.current - 1,
					PageSize: pagination.pageSize
				}

				this.getData(data)
			},
			search() {
				this.pagination.current = 1
				let data = {
					RegionID: this.RegionID ? this.RegionID : this.regionID,
					CompanyID: this.CompanyID.constructor == Array ? '' : this.CompanyID,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize
				}
				this.getData(data)
			},
			tableHeight(data) {
				this.scrolly = data - 75
			},
			toAdded() {
				this.modalShow = true;
			},
			handleOk(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						this.confirmLoading = true
						let data = {
							companyID: values.company.key,
							companyName: values.company.label,
							companyHoleID: values.companyHole.key,
							companyHoleName: values.companyHole.label,
							remarks: values.remarks
						}
						addaCcessControls(data).then(res => {
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
			companyChange(value) {
				this.getHole(value.key)
			},
			// 获取排口列表
			getHole(id) {
				getHoleNames({
					companyId: id
				}).then(res => {
					if (res.status === '0') {
						this.holeList = res.result
					} else {
						console.log(res.message)
					}
				})
			},
			reduction(){
				this.form.setFieldsValue({
					company: [],
					companyHole: [],
					remarks: ''
				});
			},
			refresh() {
				this.CompanyID = []
				this.StartTime = ''
				this.EndTime = ''
				this.RegionID = null
				this.search()
			},
			customRow(record, index){
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
</style>
