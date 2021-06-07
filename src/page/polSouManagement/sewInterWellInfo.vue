<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="toAdded">新增</a-button>
			<a-button type="danger" @click="delBatch">删除{{IdBatch.length ? '(' + IdBatch.length + ')' : ''}}</a-button>
		</template>
		<template slot="right">
			<a-input v-model="WellName" placeholder="截污井名称" />
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
						<a-form-item label="监控点名称">
						    <a-input v-decorator="['WellName', { rules: [{ required: true, message: '请输入截污井名称' }] ,initialValue: '' }]"
							placeholder="监控点名称" />							
						</a-form-item>
					</a-col>	
					<a-col :span="12">
						<a-form-item label="监控点简称">
						    <a-input v-decorator="['WellShortName', { rules: [{ required: true, message: '请输入截污井简称' }] ,initialValue: '' }]"
							placeholder="监控点名称简称" />							
						</a-form-item>
					</a-col>	
					<a-col :span="12">
						<a-form-item label="监控点编号">
						    <a-input v-decorator="['WellCode', { rules: [{ required: true, message: '请输入截污井编号' }] ,initialValue: '' }]"
							placeholder="监控点编号" />							
						</a-form-item>
					</a-col>						
					<a-col :span="12">
						<a-form-item label="中心经度">
						    <a-input v-decorator="['Longitude']" placeholder="中心经度" />							
						</a-form-item>
					</a-col>					
					<a-col :span="12">
						<a-form-item label="中心纬度">
						    <a-input v-decorator="['Latitude']" placeholder="中心纬度" />							
						</a-form-item>
					</a-col>										
					<a-col :span="12">
						<a-form-item label="负责人">
						    <a-input v-decorator="['ResponsibleLeader']" placeholder="负责人" />							
						</a-form-item>
					</a-col>											
					<a-col :span="12">
						<a-form-item label="地址">
						    <a-input v-decorator="['AddressName']" placeholder="地址" />							
						</a-form-item>
					</a-col>												
					<a-col :span="12">
						<a-form-item label="备注">
						    <a-input v-decorator="['Remarks']" placeholder="备注" />							
						</a-form-item>
					</a-col>																					
					<a-col :span="12">
						<a-form-item label="监控点性质">
							<a-select label-in-value option-filter-prop="children"
								v-decorator="['PointNatureID',{ rules: [{ required: true, message: '请选择截污井监控点性质' }],initialValue:[]}]" placeholder="监控点性质">
								<a-select-option v-for="item in pointNatureList" :key="item.id">{{item.name}}</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>															
					<a-col :span="12">
						<a-form-item label="设备编码">
						    <a-input v-decorator="['MonitorPointCode', { rules: [{ required: true, message: '请输入设备编码' }] ,initialValue: '' }]"
							placeholder="设备编码" />							
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
		wells
	} from '@/request/api'
	
	
	import
	{
		insertWell,
		editWell,
		delWell,
		getWellNature
	} from '@/request/api2'
	

	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {
				value: undefined,
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
				WellName: '',
				pointNatureList:[],
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
					title: '监控点名称',
					dataIndex: 'wellName',
					align: 'center',
				}, 
				{
					title: '监控点性质',
					dataIndex: 'pointNature',
					align: 'center',
				}, 									
				{
					title: '监控点编号',
					dataIndex: 'wellCode',
					align: 'center',
				}, 
				{
					title: '设备编码',
					dataIndex: 'monitorPointCode',
					align: 'center',
					width: 200
				}, 			
				{
					title: '中心经度',
					dataIndex: 'longitude',
					align: 'center',
				}, {
					title: '中心纬度',
					dataIndex: 'latitude',
					align: 'center',
				}, {
					title: '负责人',
					dataIndex: 'responsibleLeader',
					align: 'center',
				}, {
					title: '地址',
					dataIndex: 'addressName',
					align: 'center',
				},
				{
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
			
			//获取截污井监控点性质
			getWellNature().then(res => {
				if (res.status === '0') {
					this.pointNatureList = res.result
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
				wells(data).then(res => {
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
					WellName: '',
					PageIndex: pagination.current - 1,
					PageSize: pagination.pageSize
				}

				this.getData(data)
			},
			search() {
				this.pagination.current = 1
				this.data = []
				let data = {
					WellName: '',
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
				this.modalTitle = '修改'
				this.modalShow = true;
				this.form.setFieldsValue({
					id: data.id,
					WellName:data.wellName,
					WellShortName:data.wellShortName,					
					WellCode:data.wellCode,
					Longitude:data.longitude,
					Latitude:data.latitude,
					ResponsibleLeader:data.responsibleLeader,
					AddressName:data.addressName,
					Remarks:data.remarks,
					MonitorPointCode:data.monitorPointCode,
					PointNatureID: data.pointNatureID ? {
						key: data.pointNatureID,
						label: data.pointNature
					} : [],
				});
			},
			// 提交
			handleOk(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if (!err) {
						this.confirmLoading = true
						let data = {
							id:values.id,
							pointNatureID:values.PointNatureID.key,
							pointNature:values.PointNatureID.label,
							wellName: values.WellName,
							wellShortName: values.WellShortName,						
							wellCode: values.WellCode,
							longitude: values.Longitude,
							latitude:values.Latitude,
							responsibleLeader:values.ResponsibleLeader,
							addressName:values.AddressName,
							remarks:values.Remarks,
							monitorPointCode:values.MonitorPointCode,
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
				insertWell(data).then(res => {
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
				editWell(data).then(res => {
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
						title: '你确定要删除选择的截污井信息吗？',
						content: '删除之后将不可恢复，请谨慎删除。',
						centered: true,
						onOk: () => {
							delWell({
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
					WellName:'',
					WellShortName:'',						
					WellCode:'',
					Longitude:'',
					Latitude:'',
					ResponsibleLeader:'',
					AddressName:'',
					Remarks:'',
					PointNatureID:'',
					MonitorPointCode:'',
					id:''
				});
			},
			
			refresh() {
				this.WellName=''
				this.search()
			},
			
			tableHeight(data) {
				this.scrolly = data - 75
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
