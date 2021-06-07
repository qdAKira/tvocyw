<template>
	<a-sub-menu :key="menuInfo.path" v-bind="$props" v-on="$listeners">
		<span slot="title">{{ menuInfo.meta.title }}</span>
		<template v-for="item in menuInfo.children">
			<a-menu-item v-if="!item.children || !item.children.length" :key="item.path">{{ item.meta.title }}</a-menu-item>
			<sub-menu v-else :key="item.path" :menu-info="item" />
		</template>
	</a-sub-menu>
	<!-- <a-sub-menu :key="menuInfo.path" v-bind="$props" v-on="$listeners">
		<span slot="title">{{ menuInfo.path }}</span>
		<template v-for="item in menuInfo.children">
			<a-menu-item v-if="!item.children" :key="item.path">{{ item.path }}</a-menu-item>
			<sub-menu v-else :key="item.path" :menu-info="item" />
		</template>
	</a-sub-menu> -->
</template>

<script>
	import {
		Menu
	} from 'ant-design-vue';

	export default ({
		name: 'SubMenu',
		props: {
			...Menu.SubMenu.props,
			menuInfo: {
				type: Object,
				default: () => ({}),
			},
		},
		data() {
			return {}
		},
		created() {
		},
		methods: {}
	})
</script>

<style>
</style>
