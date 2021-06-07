<template>
	<div class="components-media-warp">
		<survey ref="mediafixed1"></survey>
		<operation ref="mediafixed2"></operation>
		<waterQuality ref="mediafixed3"></waterQuality>
		<tracing @fullLoacl="fullLoacl($event)" ref="mediafixed4"></tracing>
		<Amap></Amap>
		<a-icon v-show="fullShow" class="componets-media-full" :class="{location: islocaled}"
			:style="{fontSize: '35px',color: '#fff'}" :type="isFull ? 'fullscreen-exit' : 'fullscreen'" @click="full" />
	</div>
</template>

<script>
	import Amap from "@/components/media/surfaceMap.vue"
	import survey from '@/components/media/surfaceWater/survey.vue'
	import operation from '@/components/media/surfaceWater/operation.vue'
	import waterQuality from '@/components/media/surfaceWater/waterQuality.vue'
	import tracing from '@/components/media/surfaceWater/tracing.vue'

	export default {
		components: {
			'Amap': Amap,
			'survey': survey,
			'operation': operation,
			'waterQuality': waterQuality,
			'tracing': tracing
		},
		data() {
			return {
				isFull: false,
				fullShow: true,
				islocaled: false,
			};
		},
		created() {},
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
		bottom: 345px;
		right: 530px;
		z-index: 100;
		cursor: pointer;

		&.location {
			bottom: 50px;
			right: 50px;
		}
	}
</style>
