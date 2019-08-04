<style lang="scss">
.pc-hello-comp-container {
	background-color: #f9fbf8;
	height: 100%;
	position: relative;
	width: 100%;
	min-width: 800px;

	.face-wrapper {
		background: url(../assets/img/pc_pic.jpg) 0 0/100% 100% no-repeat;
		height: 42rem;
		left: 50%;
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 55.3726rem;

		.left-eye, .right-eye {
			background-color: #151714;
			border-radius: 50%;
			height: 1.2rem;
			position: absolute;
			width: 1.2rem;
		}

		.left-eye {
			animation: anim_left_eye 2.5s 1 forwards;
		}

		.right-eye {
			animation: anim_right_eye 2.5s 1 forwards;
		}

		@keyframes anim_left_eye {
			0% {
				left: 26%;
				top: 34.5%;
			}
			100% {
				left: 42%;
				top: 33.3%;
			}
		}

		@keyframes anim_right_eye {
			0% {
				right: 41%;
				top: 31%;
			}
			100% {
				right: 27%;
				top: 31.8%;
			}
		}
	}

	.process {
		border-radius: .5rem;
		bottom: 4rem;
		height: 1rem;
		left: 5%;
		overflow: hidden;
		position: absolute;
		width: 90%;

		div {
			animation: anim_fill 2.5s 1 forwards;
			background: linear-gradient(to bottom, #4D9BB2, #2c3e50);
			border-radius: .5rem;
			height: 100%;
			width: 0;

			@keyframes anim_fill {
				0% {width: 0;}
				100% {width: 100%;}
			}
		}
	}
}
</style>

<template>
	<div class="pc-hello-comp-container">
		<div class="face-wrapper" v-show="imgLoaded">
			<div class="left-eye"></div>
			<div class="right-eye"></div>
		</div>
		<div class="process" v-show="imgLoaded">
			<div ref="processBar"></div>
		</div>
	</div>
</template>

<script>
import {mutation} from '@/assets/js/store.js'

export default {
	data() {
		return {
			imgLoaded: false
		}
	},

	created() {
		const myPic = new Image()
		window.myPic = myPic
		myPic.src = '../assets/img/pc_pic.jpg'
		myPic.onload = () => this.imgLoaded = true
	},

	mounted() {
		this.$refs.processBar.addEventListener('animationend', () => mutation.setCanRunAnimation(true))
	}
}
</script>