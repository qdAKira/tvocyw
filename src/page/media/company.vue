<template>
	<div class="components-media-warp">
		<waterType ref="mediafixed1"></waterType>
		<waterType2 ref="mediafixed2"></waterType2>
		<waterType3 ref="mediafixed3"></waterType3>
		<waterType4 ref="mediafixed4" @fullLoacl="fullLoacl($event)"></waterType4>
		<Amap></Amap>
		<a-icon v-show="fullShow" class="componets-media-full" :class="{location: islocaled}"
			:style="{fontSize: '35px',color: '#fff'}" :type="isFull ? 'fullscreen-exit' : 'fullscreen'"
			@click="full" />
	</div>
</template>

<script>
	import Amap from "@/components/media/companyMap.vue"
	import waterType from '@/components/media/company/waterType.vue'
	import waterType2 from '@/components/media/company/waterType2.vue'
	import waterType3 from '@/components/media/company/waterType3.vue'
	import waterType4 from '@/components/media/company/waterType4.vue'
	
	export default {
		components: {
			'Amap': Amap,
			'waterType': waterType,
			'waterType2': waterType2,
			'waterType3': waterType3,
			'waterType4': waterType4
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
					this.$refs.mediafixed1.myMoveIn()
					this.$refs.mediafixed2.myMoveIn()
					this.$refs.mediafixed3.myMoveIn()
					this.$refs.mediafixed4.myMoveIn()
				} else {
					this.$refs.mediafixed1.myMoveOut()
					this.$refs.mediafixed2.myMoveOut()
					this.$refs.mediafixed3.myMoveOut()
					this.$refs.mediafixed4.myMoveOut()
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
		bottom: 25px;
		right: 530px;
		z-index: 100;
		cursor: pointer;
	
		&.location {
			bottom: 50px;
			right: 50px;
		}
	}
</style>
