<template>
	<div class="components-media-warp">
		<survey ref="mediafixed1"></survey>
		<inAndOut ref="mediafixed2"></inAndOut>
		<overNumber ref="mediafixed3"></overNumber>
		<drainageState ref="mediafixed4"></drainageState>
		<drainageNumber @fullLoacl="fullLoacl($event)" ref="mediafixed5"></drainageNumber>
		<equipment ref="mediafixed6"></equipment>
		<management ref="mediafixed7"></management>
		<Amap></Amap>
		<a-icon v-show="fullShow" class="componets-media-full" :class="{location: islocaled}"
			:style="{fontSize: '35px',color: '#fff'}" :type="isFull ? 'fullscreen-exit' : 'fullscreen'"
			@click="full" />
	</div>
</template>

<script>
	import Amap from "@/components/media/sewageMap.vue"
	import survey from '@/components/media/sewage/survey.vue'
	import inAndOut from '@/components/media/sewage/onflowAndOutflow.vue'
	import overNumber from '@/components/media/sewage/overNumber.vue'
	import drainageState from '@/components/media/sewage/drainageState.vue'
	import drainageNumber from '@/components/media/sewage/drainageNumber.vue'
	import equipment from '@/components/media/sewage/equipment.vue'
	import management from '@/components/media/sewage/management.vue'
	
	export default {
		components: {
			'Amap': Amap,
			'survey': survey,
			'inAndOut': inAndOut,
			'overNumber': overNumber,
			'drainageState': drainageState,
			'drainageNumber': drainageNumber,
			'equipment': equipment,
			'management': management
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
