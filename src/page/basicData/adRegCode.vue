<template>
	<sub-menu @getHeight="tableHeight($event)">
        <template slot="left">
			<!-- <a-button type="primary" @click="showAddModal">新增</a-button> -->
		    <!-- <a-button type="danger" @click="delBatch">删除{{IdBatch.length ? '(' + IdBatch.length + ')' : ''}}</a-button> -->
		</template>		
		
		<template slot="table">
			<a-table style="height: 100%;" :columns="columns" :data-source="data" :loading="loading" :scroll="{ x: scrollx,y: scrolly }"
			 :rowKey="record => record.id" size="middle" :pagination="pagination" @change="pageChange" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
<!-- 				<template slot="action" slot-scope="text, record">
					<a-button type="primary" size="small" @click="edit(record)">修改</a-button>
				</template> -->
			</a-table>
		</template>
		<template slot="fixed">
			<div id="components-form-demo-advanced-search">
				<a-modal class="ant-advanced-search-form" forceRender :title="editTile" :visible="addVisible" :width="600" centered
				 :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
					<a-form :form="addform" layout="inline" labelAlign="right" :labelCol="{span: 8, offset: 0}" :wrapperCol="{span: 16, offset: 0}">
						<a-row :gutter="24">
							<a-col :span="12" v-show="false">
								<a-form-item>
									<a-input v-decorator="['id']" />
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="区域名称">
									<a-input v-decorator="['name', { rules: [{ required: true, message: '请输入区域名称' }] }]" placeholder="区域名称" />
								</a-form-item>
							</a-col>
							<a-col :span="12">			
							<a-form-item label="区域级别">
								     <a-select placeholder="区域级别" label-in-value option-filter-prop="children" v-decorator="['regoinLevel', { rules: [{ required: true, message: '请选择区域级别' }] }]"
								      @change="levelChange">
								     	<a-select-option v-for="(item,index) in levels" :value="item" :key="index">{{item}}</a-select-option>
								     </a-select>
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="父级区域">
									<a-select  placeholder="父级区域" label-in-value option-filter-prop="children"
									  v-decorator="['parentID', { rules: [{ required: true, message: '请选择父级区域级别' }] }]">
										<a-select-option v-for="item in parentList" :key="item.id">{{item.name}}</a-select-option>
									</a-select>
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
		getRegions,
	} from '@/request/api'

	import {
		  getParent,
          insertRegion
	} from '@/request/api2'


	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {
				columns: [{
						title: '序号',
						dataIndex: 'number',
						scopedSlots: {
							customRender: 'number'
						},
						align: 'center',
						width: 50
					}, {
						title: '行政区名称',
						dataIndex: 'name',
						align: 'center'
					}, {
						title: '上级区域',
						dataIndex: 'parentName',
						align: 'center'
					},
					{
						title: '区域等级',
						dataIndex: 'regoinLevel',
						align: 'center'
					}
				],
				levels: [1,2,3],
				level:'',
				parentList: [],
				data: [],
				scrollx: '',
				scrolly: '',
				loading: false,
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
				IdBatch: [],
				//levelDisabled: false
			};
		},
		created() {
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
				getRegions(data).then(res => {
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
					PageIndex: pagination.current - 1,
					PageSize: pagination.pageSize
				}
			
				this.getData(data)
			},
			// 区域级别变化
			levelChange(val) {
				this.parentList=[];
				this.addform.setFieldsValue({
					parentID: []
				});		
				this.level = val.key		
				if (val.key == 2 || val.key == 3) {
					//this.levelDisabled = false;
					this.getParentRegion(this.level)
				} else {
					//this.levelDisabled = true;	
					this.parentList=[{"id":-1,"name":'-1'}]
				}
				
			},
			// 获取父级区域
			getParentRegion(number) {
				getParent({
					level: number
				}).then(res => {
					if (res.status === '0') {
						this.parentList = res.result
					} else {
						console.log(res.message)
					}
				})
			},
			showAddModal() {
				this.editTile = '新增'
				this.addVisible = true;
			},
			
			// 新增/修改--提交
			handleOk(e) {
				e.preventDefault();
				this.addform.validateFields((err, values) => {
					if (!err) {
						this.confirmLoading = true
						const data = {
							name: values.name,
							parentID: Array.isArray(values.parentID) ? null:values.parentID.key,
							regoinLevel: Number(values.regoinLevel.key),
						}
						if (this.editTile == '新增') {
							this.addInterface(data)
						} else {
							//data.id = values.id
							//this.modifyInterface(data)
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
			// 新增
			addInterface(data) {
				insertRegion(data).then(res => {
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
					name: '',
					parentID:[],
					regoinLevel:[]
				});
			},
			search() {
				this.pagination.current = 1
				this.data = []
				let data = {
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize
				}
				this.getData(data)
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
