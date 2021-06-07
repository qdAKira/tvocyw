<template>
	<div class="components-media-warp">
		<survey ref="mediafixed1"></survey>
		<drainageState ref="mediafixed2"></drainageState>
		<overNumber ref="mediafixed3"></overNumber>
		<management ref="mediafixed4"></management>
		<deviceStatus ref="mediafixed5"></deviceStatus>
		<overState @fullLoacl="fullLoacl($event)" ref="mediafixed6"></overState>
		<equipment ref="mediafixed7"></equipment>
		<Amap></Amap>
		<a-icon v-show="fullShow" class="componets-media-full" :class="{location: islocaled}"
			:style="{fontSize: '35px',color: '#fff'}" :type="isFull ? 'fullscreen-exit' : 'fullscreen'" @click="full" />
	</div>
</template>

<script>
	import Amap from "@/components/media/rainMap.vue"
	import survey from '@/components/media/rain/survey.vue'
	import drainageState from '@/components/media/rain/drainageState.vue'
	import overNumber from '@/components/media/rain/overNumber.vue'
	import management from '@/components/media/rain/management.vue'
	import deviceStatus from '@/components/media/rain/deviceStatus.vue'
	import overState from '@/components/media/rain/overState.vue'
	import equipment from '@/components/media/rain/equipment.vue'

	export default {
		components: {
			'Amap': Amap,
			'survey': survey,
			'drainageState': drainageState,
			'overNumber': overNumber,
			'management': management,
			'deviceStatus': deviceStatus,
			'overState': overState,
			'equipment': equipment
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
