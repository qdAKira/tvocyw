<template>
	<div class="components-media-warp">
		<Amap></Amap>
		<survey ref="mediafixed1"></survey>
		<operation ref="mediafixed2"></operation>
		<abnormal ref="mediafixed3"></abnormal>
		<overStandard @fullLoacl="fullLoacl($event)" ref="mediafixed4"></overStandard>
		<a-icon v-show="fullShow" class="componets-media-full" :class="{location: islocaled}"
			:style="{fontSize: '35px',color: '#fff'}" :type="isFull ? 'fullscreen-exit' : 'fullscreen'" @click="full" />
	</div>
</template>

<script>
	import Amap from "@/components/media/videoMap.vue"
	import survey from "@/components/media/video/survey.vue"
	import operation from "@/components/media/video/operation.vue"
	import abnormal from "@/components/media/video/abnormal.vue"
	import overStandard from "@/components/media/video/overStandard.vue"

	export default {
		components: {
			'Amap': Amap,
			'survey': survey,
			'operation': operation,
			'abnormal': abnormal,
			'overStandard': overStandard
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
		bottom: 25px;
		right: 530px;
		z-index: 100;
		cursor: pointer;

		&.location {
			bottom: 25px;
			right: 50px;
		}
	}
</style>
