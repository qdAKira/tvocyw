<template>
	<div style="height: 100%;">
		<div class="components-head" ref="head">
			<a-space style="margin-right: 16px;margin-bottom: 16px;">
				<slot name="left"></slot>
			</a-space>
			<a-space style="margin-bottom: 16px;">
				<slot name="right"></slot>
			</a-space>
		</div>
		<div class="components-table" ref="table" :style="{height: 'calc(100% - ' + headHegiht + 'px)'}">
			<slot name="table"></slot>
		</div>
		<slot name="fixed"></slot>
	</div>
</template>

<script>
	import elementResizeDetectorMaker from "element-resize-detector"

	export default ({
		name: 'SubModule',
		data() {
			return {
				headHegiht: 48,
			};
		},
		mounted() {
			this.watchSize();
		},
		methods: {
			watchSize() {
				const _this = this;
				let erd = elementResizeDetectorMaker();
				erd.listenTo(this.$refs.head, (element) => {
					let width = element.offsetWidth;
					let height = element.offsetHeight;
					_this.$nextTick(() => {
						this.headHegiht = height

						erd.listenTo(this.$refs.table, (element) => {
							let width = element.offsetWidth;
							let height = element.offsetHeight;
							_this.$nextTick(() => {
								this.$emit('getHeight', height)
							});
						});
					});
				});
			},
		}
	})
</script>

<style>
	.components-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* flex-wrap: wrap; */
	}
</style>
