<template>
	<a-config-provider :locale="locale">
		<div id="app">
			<router-view />
		</div>
	</a-config-provider>
</template>

<script>
	import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';

	export default {
		name: 'app',
		data() {
			return {
				locale: zhCN,
			};
		},
		created() {
			if (localStorage.getItem('regoins')) {
				global.regoins = JSON.parse(localStorage.getItem('regoins'))
			}
			if (localStorage.getItem('addDegoins')) {
				global.addDegoins = JSON.parse(localStorage.getItem('addDegoins'))
			}
			if (localStorage.getItem('regionID')) {
				global.regionID = localStorage.getItem('regionID')
			}
			if (localStorage.getItem('roleID')) {
				global.roleID = localStorage.getItem('roleID')
			}
			if (localStorage.getItem('userID')) {
				global.userID = localStorage.getItem('userID')
			}
			if (localStorage.getItem('companyID')) {
				global.companyID = localStorage.getItem('companyID')
			}
			if (localStorage.getItem('chineseUserName')) {
				global.chineseUserName = localStorage.getItem('chineseUserName')
			}
			if (localStorage.getItem('Router')) {
				global.Router = localStorage.getItem('Router')
			}
			this.$message.config({
				top: '400px',
				duration: 2,
				maxCount: 3,
			});
		},
		mounted() {}
	}
</script>

<style>
	#app {
		height: 100%;
	}
	
	.ant-advanced-search-form .ant-form-item {
		display: flex;
	}
	
	.charts-warp{
		height: 600px;
		padding-top: 40px;
	}
	
	.chart-map{
		height: 100%;
	}
	
	.media-warp{
		z-index: 90;
	}

/* 	.ant-table-tbody>tr:nth-child(odd)>td {
		background-color: #fff;
	} */

	/* .ant-table-tbody .ant-table-row:nth-child(odd){
		background-color: #f0f2f5;
	} */
	
	

	/* .ant-table-fixed-left table,
	.ant-table-fixed-right table {
		background-color: transparent;
	} */

/* 	.ant-table-wrapper,
	.ant-spin-nested-loading,
	.ant-spin-container,
	.ant-table-content,
	.ant-table-scroll {
		height: 100%;
	}

	.ant-table {
		height: calc(100% - 41px);
	}

	.ant-table-body {
		height: 100% !important;
		max-height: none !important;
	}

	.ant-table-fixed-header .ant-table-body {
		height: calc(100% - 44.6px) !important;
	}

	.ant-table-fixed-left {
		height: calc(100% - 22px);
	}

	.ant-table-body-outer {
		height: calc(100% - 44.8px);
	}

	.ant-table-body-inner {
		height: 100%;
		max-height: none !important;
	}

	.ant-table-empty .ant-table-body {
		height: auto !important;
	}

	.ant-table-body-inner {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	.ant-table-body-inner::-webkit-scrollbar {
		display: none;
	} */
</style>
