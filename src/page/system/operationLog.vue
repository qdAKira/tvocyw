<template>
	<sub-menu @getHeight="tableHeight($event)">
 		<template slot="left">
	        <a-button type="primary" @click="download">导出</a-button>
		</template>
		<template slot="right">	
			<a-range-picker @change="DateChange" />			
			<a-select show-search v-model="operatorName" placeholder="操作人" option-filter-prop="children" style="width: 150px"
			 @change="operatorChange" >
			  <a-select-option v-for="item in operatorList" :value="item.name" :key="item.id">{{item.name}}</a-select-option>
			</a-select>						
			<a-button type="primary" @click="search">查询</a-button>
		</template>
		
		<template slot="table">
			<a-table style="height: 100%;" :columns="columns" :data-source="data" :loading="loading" :scroll="{ x: scrollx,y: scrolly }"
			 :rowKey="record => record.id" size="middle" :pagination="pagination" @change="pageChange" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
			</a-table>
		</template>
	</sub-menu>
</template>

<script>
	import SubModule from '@/components/subModule.vue'
	import fileDownload from 'js-file-download'



	import {		
		getOperator,
		getOperateLog,
		exportLogs
	} from '@/request/api2'


	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {				
				operatorName:[],
				operatorList: [],
				StartTime: '',
				EndTime: '',
				scrollx: '',
				scrolly: '',
				columns:[],
				columnsDefault: [{
					title: '序号',
					dataIndex: 'number',
					scopedSlots: {
						customRender: 'number'
					},
					align: 'center',
					width: 50
				}, {
					title: '内容',
					dataIndex: 'logContent',
					align: 'center'
				}, {
					title: '时间',
					dataIndex: 'logTime',
					align: 'center'
				}, {
					title: '操作人',
					dataIndex: 'person',
					align: 'center'
				}],
				data: [{
					logContent: '1',
					logTime: '1',
					person: '1',
					id: 0
				}, {
					logContent: '1',
					logTime: '1',
					person: '1',
					id: 1
				}, {
					logContent: '1',
					logTime: '1',
					person: '1',
					id: 2
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
				}
			};
		},
		created() {
			//获取操作人
			getOperator().then(res => {				
				if (res.status === '0') {
					this.operatorList = res.result
				} else {
					console.log(res.message)
				}
			})
			let data = {
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize
			}
		
			this.getFirstPage(data)
			
			
		},
		mounted() {},
		methods: {													  
			getFirstPage(data) {
				this.loading = true
				// 获取列表表头和首页数据
				this.columns = []
				this.columns = this.columns.concat(this.columnsDefault)
				getOperateLog(data).then(res => {
					if (res.status === '0') {						
						if (res.result) {
							this.dataHandle(res.result, this.pagination)
						} else{
							this.pagination.total = 0
						}
					} else {
						console.log(res.message)
						this.pagination.total = 0
					}
					this.loading = false
				})
			},
			
			dataHandle(data, pagination) {
				this.loading = false
				this.data = data.list
				pagination.total = data.total
				this.pagination = pagination
			},
			
	        getData(data,pagination) {
				getOperateLog(data).then(res => {
					if (res.status === '0') {
						this.dataHandle(res.result, pagination)
					} else {
						console.log(res.message)
					}
					this.loading = false
				})
			},

			operatorChange() {
			   
			},
			
            DateChange(date, dateString) {
				this.StartTime = dateString[0]
				this.EndTime = dateString[1]
			},

            pageChange(pagination, filters, sorter) {
				this.loading = true
				let data = {
			        Operator: this.operatorName.constructor == Array ? '' : this.operatorName,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
					PageIndex: pagination.current - 1,
					PageSize: pagination.pageSize
				}

				this.getData(data, pagination)
			},
			search() {
				this.pagination.current = 1
				this.data = []
				let data = {
				    Operator: this.operatorName.constructor == Array ? '' : this.operatorName,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
					PageIndex: this.pagination.current - 1,
					PageSize: this.pagination.pageSize
				}
				this.getFirstPage(data)
			},
			download() {
				let params = {
					Operator: this.operatorName.constructor == Array ? '' : this.operatorName,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
				}
				exportLogs(params).then(res => {
					let blob = new Blob([res],{type:'application/vnd.ms-excel'});
					let url = window.URL.createObjectURL(blob); //表示一个指定的file对象或Blob对象
					let a = document.createElement("a");
					a.download = '操作日志报表'; //命名下载名称
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
		}
	})
</script>

<style scoped>
</style>
