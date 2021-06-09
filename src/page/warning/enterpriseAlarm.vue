<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary" @click="download">导出</a-button>
		</template>
		<template slot="right">
			<a-select v-if="cID==='null'?true:false" show-search v-model="CompanyID" placeholder="企业"
				option-filter-prop="children" style="width: 150px" @focus="companyFocus">
				<a-select-option v-for="item in companyList" :value="item.id" :key="item.id">{{item.companyName}}
				</a-select-option>
			</a-select>
			<a-range-picker @change="DateChange" />
			<a-button type="primary" @click="search">查询</a-button>
		</template>
		<template slot="table">
			<a-table style="height: 100%;" :columns="columns" :data-source="data" :loading="loading"
				:scroll="{ x: scrollx,y: scrolly }" :rowKey="record => record.id" size="middle" :pagination="pagination"
				@change="pageChange" :customRow="customRow">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
				<a slot="picPath" slot-scope="text, record" href="javascript:;"
					:disabled="record.picPath ? false : true"
					@click="img(text, record)">{{record.picPath ? '查看' : '无'}}</a>
			</a-table>
		</template>
		<template slot="fixed">
			<a-modal :visible="imgVisble" width="auto" destroyOnClose :footer="null" centered :closable="false"
				:bodyStyle="bodyStyle" wrapClassName="img-modal" @cancel="imgVisble = false">
				<img class="modal-img" :src="imgsrc" alt="">
			</a-modal>
		</template>
	</sub-menu>
</template>

<script>
	import SubModule from '@/components/subModule.vue'
	import fileDownload from 'js-file-download'

	import {
		getCompanyList,
		getHoleNames,
		companyAlarms,
		companyAlarmsTables
	} from '@/request/api'

	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {
				roleID: global.roleID,
				value: undefined,
				regionID: global.regionID,
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
						width: 80,
					}, {
						title: '企业名称',
						dataIndex: 'companyName',
						align: 'center',
					}, {
						title: '报警预警内容',
						dataIndex: 'alarmContent',
						align: 'center',
						ellipsis: true
					},
					{
						title: '报警时间',
						dataIndex: 'alarmTimeText',
						align: 'center',
					}, {
						title: '报警类型',
						dataIndex: 'alarmType',
						align: 'center',
					}, {
						title: '超标原因',
						dataIndex: 'overStandReason',
						align: 'center',
					}, {
						title: '处理措施',
						dataIndex: 'treatmentMeasures',
						align: 'center',
					}, {
						title: '填表时间',
						dataIndex: 'fillTimeText',
						align: 'center',
					}, {
						title: '填报人',
						dataIndex: 'fillName',
						align: 'center',
					}, {
						title: '图片',
						scopedSlots: {
							customRender: 'picPath'
						},
						align: 'center',
						width: 120,
						dataIndex: 'id',
						key: 'picPath'
					}, {
						title: '处理状态',
						dataIndex: 'processingStatus',
						align: 'center',
					}, {
						title: '备注',
						dataIndex: 'remarks',
						align: 'center',
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
				bodyStyle: {
					padding: 0
				},
				imgsrc: '',
				imgVisble: false
			};
		},
		created() {
			// 获取企业列表
			this.getCompany()
			let data = {
				RegionID: this.regionID,
				PageIndex: this.pagination.current - 1,
				PageSize: this.pagination.pageSize,
				companyId: this.roleID === '3' ? this.cID : this.CompanyID
			}
			// 获取第一页数据
			this.getData(data)
		},
		mounted() {},
		methods: {
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
				companyAlarms(data).then(res => {
					if (res.status === '0') {
						if (res.result) {
							this.data = res.result.list
							const pagination = {
								...this.pagination
							}
							pagination.total = res.result.total
							this.pagination = pagination
						}else{
							this.pagination.total = 0
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
					RegionID: this.regionID,
					CompanyID: this.roleID === '3' ? this.cID : this.CompanyID,
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
					RegionID: this.regionID,
					CompanyID: this.roleID === '3' ? this.cID : this.CompanyID,
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
			customRow(record, index) {
				return {
					style: {
						backgroundColor: index % 2 ? '#fff' : '#f0f2f5'
					}
				}
			},
			img(text, record) {
				this.imgsrc = record.picPath
				this.imgVisble = true
			},
			download() {
				let data = {
					StartTime: this.StartTime,
					EndTime: this.EndTime,
					CompanyID: this.roleID === '3' ? this.cID : this.CompanyID,
				}
				companyAlarmsTables(data).then(res => {
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

<style>
	.img-modal .ant-modal-content {
		background-color: transparent;
		box-shadow: none;
	}

	.modal-img {
		max-height: 80vh;
		max-width: 80vw;
	}
</style>
