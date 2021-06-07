<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="download">导出</a-button>
		</template>
		<template slot="right">
			<a-range-picker @change="DateChange" />
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
		messageRecords,
		messageRecordsTables
	} from '@/request/api'

	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {
				value: undefined,
				fieldNames: {
					children: 'regionChilds',
					label: 'name',
					value: 'id',
				},
				regionData: global.regoins,
				RegionID: global.regionID,
				companyList: [],
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
					title: '报警预警内容',
					dataIndex: 'alarmMessageContent',
					align: 'center',
					ellipsis: true
				}, {
					title: '时间',
					dataIndex: 'alarmTimeText',
					align: 'center',
				}, {
					title: '报警类别',
					dataIndex: 'alarmType',
					align: 'center',
				}, {
					title: '短信接收人',
					dataIndex: 'receivePerson',
					align: 'center',
				}, {
					title: '接收号码',
					dataIndex: 'receiveNumber',
					align: 'center',
				}, {
					title: '是否发送',
					dataIndex: 'remarks1',
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
				}
			};
		},
		created() {
			let data = {
				RegionID:this.RegionID,
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize
			}
			// 获取第一页数据
			this.getData(data)
		},
		mounted() {},
		methods: {
			DateChange(date, dateString) {
				this.StartTime = dateString[0]
				this.EndTime = dateString[1]
			},
			getData(data) {
				this.loading = true
				messageRecords(data).then(res => {
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
					RegionID:this.RegionID,
					StartTime: this.StartTime,
					EndTime: this.EndTime,
					PageIndex: pagination.current - 1,
					PageSize: pagination.pageSize
				}

				this.getData(data)
			},
			search() {
				this.pagination.current = 1
				this.data = []
				let data = {
					RegionID:this.RegionID,
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
			customRow(record, index){
				return {
					style: {
						backgroundColor: index % 2 ? '#fff' : '#f0f2f5'
					}
				}
			},
			download() {
				let data = {
					StartTime: this.StartTime,
					EndTime: this.EndTime
				}
				messageRecordsTables(data).then(res => {
					let blob = new Blob([res], {
						type: 'application/vnd.ms-excel'
					});
					let url = window.URL.createObjectURL(blob); //表示一个指定的file对象或Blob对象
					let a = document.createElement("a");
					a.style.display = "none";
					a.href = url;
					document.body.appendChild(a);
					a.click(); //点击触发下载  
					window.URL.revokeObjectURL(a.href); //下载完成进行释放
					document.body.removeChild(a);
				})
			},
		}
	})
</script>

<style scoped>
</style>
