<style lang="scss">
.hello-comp-container {
	height: 100%;
	position: relative;
	width: 100%;

	.left-eye, .right-eye {
		background-color: #000;
		border-radius: 3vw;
		height: 1vw;
		position: absolute;
		top: 30vh;
		width: 39vw;
	}

	.left-eye {
		left: 2.5vw;

		&.on-animation {
			animation: left-eye-anim 2.5s linear 1 forwards;
		}
	}

	.right-eye {
		right: 2.5vw;

		&.on-animation {
			animation: right-eye-anim 2.5s linear 1 forwards;
		}
	}

	@keyframes left-eye-anim {
		0% {
			background-color: #000;
			transform: perspective(56vw) rotateY(-50deg);
			transform-origin: 30% 0%;
		}

		20% {
			background-color: #fff;
			box-shadow: 0 0 10px 0 #000;
			height: 14vw;
			transform: perspective(56vw) rotateY(-50deg);
			transform-origin: 30% 0%;
		}

		25% {
			background-color: #eee;
			box-shadow: none;
		}

		30% {
			background-color: #aaa;
		}

		40% {
			background-color: #fff;
		}

		60% {
			background-color: #ff0;
		}

		90% {
			background-color: #ff0;
			box-shadow: 0 0 50px 0 #ff0;
		}

		100% {
			background-color: #d8b362;
			box-shadow: 0 0 10px 0 #d8b362;
			height: 14vw;
			transform: perspective(56vw) rotateY(-50deg);
			transform-origin: 30% 0%;
		}
	}

	@keyframes right-eye-anim {
		0% {
			background-color: #000;
			transform: perspective(56vw) rotateY(50deg);
			transform-origin: 70% 0%;
		}

		20% {
			background-color: #fff;
			box-shadow: 0 0 10px 0 #000;
			height: 14vw;
		}

		25% {
			background-color: #eee;
			box-shadow: none;
		}

		30% {
			background-color: #aaa;
		}

		40% {
			background-color: #fff;
		}

		60% {
			background-color: #ff0;
		}

		90% {
			background-color: #ff0;
			box-shadow: 0 0 50px 0 #ff0;
		}

		100% {
			background-color: #d8b362;
			box-shadow: 0 0 10px 0 #d8b362;
			height: 14vw;
			transform: perspective(56vw) rotateY(50deg);
			transform-origin: 70% 0%;
		}
	}
}
</style>

<template>
	<div class="hello-comp-container">
		<div :class="['left-eye', isCanAnimate && 'on-animation']"></div>
		<div :class="['right-eye', isCanAnimate && 'on-animation']" ref="rightEye"></div>
	</div>
</template>

<script>
import {mutation} from '@/assets/js/store.js'

export default {
	data() {
		return {
			isCanAnimate: false
		}
	},

	mounted() {
		this.isCanAnimate = true
		this.$refs.rightEye.addEventListener('animationend', () => mutation.setCanRunAnimation(true))
	}
}
</script>