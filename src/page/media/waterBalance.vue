<template>
	<div class="components-media-warp">
		<Amap></Amap>
		<a-icon v-show="fullShow" class="componets-media-full" :class="{location: islocaled}"
			:style="{fontSize: '35px',color: '#fff'}" :type="isFull ? 'fullscreen-exit' : 'fullscreen'"
			@click="full" />
	</div>
</template>

<script>
	import Amap from "@/components/media/map.vue"
	
	export default {
		components: {
			'Amap': Amap
		},
		data() {
			return {
				isFull: false,
				fullShow: true,
				islocaled: false,
			};
		},
		created() {
		},
		methods: {
			full() {
				this.isFull = !this.isFull
	
				if (this.isFull) {
				} else {
				}
			},
			fullLoacl(e) {
				this.fullShow = false
				this.isFull = e
				this.islocaled = e
				setTimeout(() => {
					this.fullShow = true
				}, 1000)
			}
		}
	};
</script>

<style scoped lang="less">
	.components-media-warp {
		position: relative;
		width: 100%;
		height: calc(100% - 117px);
		overflow: hidden;
	}
	
	.componets-media-full {
		position: absolute;
		bottom: 350px;
		right: 530px;
		z-index: 100;
		cursor: pointer;
	
		&.location {
			bottom: 50px;
			right: 50px;
		}
	}
</style>
