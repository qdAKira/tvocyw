<template>
	<div class="components-media-warp">
		<mediaFixed1 ref="mediafixed1"></mediaFixed1>
		<mediaFixed2 ref="mediafixed2"></mediaFixed2>
		<mediaFixed3 ref="mediafixed3"></mediaFixed3>
		<mediaFixed4 ref="mediafixed4"></mediaFixed4>
		<mediaFixed5 ref="mediafixed5"></mediaFixed5>
		<mediaFixed6 @fullLoacl="fullLoacl($event)" ref="mediafixed6"></mediaFixed6>
		<mediaFixed7 ref="mediafixed7"></mediaFixed7>
		<Amap></Amap>
		<a-icon v-show="fullShow" class="componets-media-full" :class="{location: islocaled}"
			:style="{fontSize: '35px',color: '#fff'}" :type="isFull ? 'fullscreen-exit' : 'fullscreen'"
			@click="full" />
	</div>
</template>

<script>
	import mediaFixed1 from "@/components/media/park/waterStatistics.vue"
	import mediaFixed2 from "@/components/media/park/sewageRanking.vue"
	import mediaFixed3 from "@/components/media/park/sewageStatistics.vue"
	import mediaFixed4 from "@/components/media/park/waterProportion.vue"
	import mediaFixed5 from "@/components/media/park/balanceRelations.vue"
	import mediaFixed6 from "@/components/media/park/waterQuality.vue"
	import mediaFixed7 from "@/components/media/park/deviceStatus.vue"
	import Amap from "@/components/media/map.vue"
	
	export default {
		components: {
			'mediaFixed1': mediaFixed1,
			'mediaFixed2': mediaFixed2,
			'mediaFixed3': mediaFixed3,
			'mediaFixed4': mediaFixed4,
			'mediaFixed5': mediaFixed5,
			'mediaFixed6': mediaFixed6,
			'mediaFixed7': mediaFixed7,
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
					this.$refs.mediafixed1.myMoveIn()
					this.$refs.mediafixed2.myMoveIn()
					this.$refs.mediafixed3.myMoveIn()
					this.$refs.mediafixed4.myMoveIn()
					this.$refs.mediafixed5.myMoveIn()
					this.$refs.mediafixed6.myMoveIn()
					this.$refs.mediafixed7.myMoveIn()
				} else {
					this.$refs.mediafixed1.myMoveOut()
					this.$refs.mediafixed2.myMoveOut()
					this.$refs.mediafixed3.myMoveOut()
					this.$refs.mediafixed4.myMoveOut()
					this.$refs.mediafixed5.myMoveOut()
					this.$refs.mediafixed6.myMoveOut()
					this.$refs.mediafixed7.myMoveOut()
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
