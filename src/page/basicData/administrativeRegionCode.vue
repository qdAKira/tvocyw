<template>
	<sub-menu @getHeight="tableHeight($event)">
<!-- 		<template slot="left">
			<a-button type="primary">新建</a-button>
			<a-button type="primary">导入</a-button>
		</template> -->
		<template slot="table">
			<<a-tab></a-tab>le :columns="columns" :data-source="data" :rowKey="record => record.id" size="middle">
				<span slot="number" slot-scope="text, record, index">
					{{index + 1 }}
				</span>
			</a-table>
		</template>
	</sub-menu>
</template>

<script>
	import SubModule from '@/components/subModule.vue'

	import {
		getRegionName,
		getTokenApi
	} from '@/request/api'

	export default ({
		components: {
			'sub-menu': SubModule
		},
		data() {
			return {
				replaceFields: {
					children: 'childNameList',
					title: 'regionName',
					key: 'id',
					value: 'regionName'
				},
				columns: [{
						title: '序号',
						dataIndex: 'number',
						scopedSlots: {
							customRender: 'number'
						},
						align: 'center'
					}, {
						title: '代码',
						dataIndex: 'code',
						align: 'center'
					}, {
						title: '行政区名称',
						dataIndex: 'name',
						align: 'center'
					}
				],
				data: [{
					code: '1',
					name: '1',
					id: 0
				}, {
					code: '1',
					name: '1',
					id: 1
				}, {
					code: '1',
					name: '1',
					id: 2
				}]
			};
		},
		created() {
		},
		mounted() {},
		methods: {
		}
	})
</script>

<style scoped>
</style>
