<template>
	<sub-menu @getHeight="tableHeight($event)">
		<template slot="left">
			<a-button type="primary">新建</a-button>
			<a-button type="primary">导入</a-button>
		</template>
		<template slot="right">
			<a-select show-search placeholder="用户名" option-filter-prop="children" style="width: 200px" :filter-option="filterOption"
			 @focus="handleFocus" @blur="handleBlur" @change="handleChange">
				<a-select-option value="jack">
					Jack
				</a-select-option>
				<a-select-option value="lucy">
					Lucy
				</a-select-option>
				<a-select-option value="tom">
					Tom
				</a-select-option>
			</a-select>
			<a-button type="primary">查询</a-button>
		</template>
		<template slot="table">
			<a-table style="height: 100%;" :columns="columns" :data-source="data" :loading="loading" :scroll="{ x: scrollx,y: scrolly }"
			 :rowKey="record => record.id" size="middle" :pagination="pagination" @change="pageChange">
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
						title: '用户名',
						dataIndex: 'userName',
						align: 'center'
					}, {
						title: '角色名称',
						dataIndex: 'roleName',
						align: 'center'
					}
				],
				data: [{
					roleName: '1',
					userName: '1',
					id: 0
				}, {
					roleName: '1',
					userName: '1',
					id: 1
				}, {
					roleName: '1',
					userName: '1',
					id: 2
				}]
			};
		},
		created() {
		},
		mounted() {},
		methods: {
			handleChange(value) {
			},
			handleBlur() {
			},
			handleFocus() {
			},
			filterOption(input, option) {
				return (
					option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
				);
			},
		}
	})
</script>

<style scoped>
</style>
