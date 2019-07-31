<style lang="scss" scoped>
.home {
	height: 100%;
	position: relative;
	transform-style: preserve-3d;
	width: 100%;

	&.pre-show {
		transform: rotateY(180deg);

		&.running {
			animation: running 3s linear 1 forwards;
		}

		&.PCrunning {
			animation: PCrunning 1.6s linear 1 forwards;
		}

		@keyframes running {
			0% {transform: translateZ(0) rotateY(180deg);}
			30% {transform: translateZ(-100px) rotateY(180deg);}
			70% {transform: translateZ(-100px) rotateY(0);}
			100% {transform: translateZ(0) rotateY(0);}
		}

		@keyframes PCrunning {
			0% {transform: translateZ(0) rotateX(0) rotateY(180deg);}
			30% {transform: translateZ(-1500px) rotateX(0) rotateY(180deg);}
			40% {transform: translateZ(-1500px) rotateX(120deg) rotateY(120deg);}
			60% {transform: translateZ(-1500px) rotateX(240deg) rotateY(60deg);}
			70% {transform: translateZ(-1500px) rotateX(360deg) rotateY(0);}
			100% {transform: translateZ(0) rotateX(360deg) rotateY(0);}
		}
	}

	.hellow, .content {
		background-color: #fff;
		backface-visibility: hidden;
		height: 100%;
		left: 0;
		overflow: hidden;
		position: absolute;
		top: 0;
		width: 100%;
	}

	.hellow {
		transform: rotateY(-180deg);
	}

	.content {
		z-index: 1;
	}
}
</style>

<template>
	<div :class="['home', !isShowed && 'pre-show', isRunning && 'running', isPCRunning && 'PCrunning']">
		<div class="hellow">
			<component :is="hellowComponent"></component>
		</div>
		<div class="content">
			<component :is="contentComponent"></component>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import {store, mutation} from '@/assets/js/store.js'
import HelloComp from '@/components/hello_comp.vue'
import PCHelloComp from '@/components/pc_hello_comp.vue'
import ContentComp from '@/components/content_comp.vue'
import PCContentComp from '@/components/pc_content_comp.vue'

export default {
	name: 'home',

	data() {
		return {
			isRunning: false,
			isPCRunning: false
		}
	},

	components: {
		HelloComp,
		PCHelloComp
	},

	computed: {
		isShowed() {
			return store.isShowed
		},

		hellowComponent() {
			let hc = ''
			isPC ? hc = PCHelloComp : hc = HelloComp
			return hc
		},

		contentComponent() {
			let cc = ''
			isPC ? cc = PCContentComp : cc = ContentComp
			return cc
		},

		canRunAnimation: {
			get() {
				return store.canRunAnimation
			},

			set(boolV) {
				mutation.setCanRunAnimation(boolV)
			}
		}
	},

	watch: {
		canRunAnimation(newV, oldV) {
			if (newV) {
				isPC ? this.isPCRunning = true : this.isRunning = true
			}
		}
	}
}
</script>
