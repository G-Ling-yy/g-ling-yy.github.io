<style lang="scss">
.pc-hello-comp-container {
	background: linear-gradient(to right, #fff, #f3d9dc, #fff);
	height: 100%;
	position: relative;
	width: 100%;
	min-width: 800px;

	.jia, .zai {
		border-bottom: .4rem solid #2c3e50;
		border-radius: .2rem;
		left: 50%;
		position: absolute;
		top: calc(50vh - 14rem);
		width: 15rem;

		div {
			animation: anim_look 2.5s 1 forwards;
			bottom: -.9rem;
			color: #000;
			font-size: 2rem;
			font-weight: bold;
			left: 0;
			position: absolute;
			text-shadow: 0 0 .2rem #000;
			transform: translateX(0);

			@keyframes anim_look {
				0% {left: 0;transform: translateX(0);}
				100% {left: 100%;transform: translateX(-100%);}
			}
		}
	}

	.jia {
		transform: translateX(-20rem);
	}

	.zai {
		transform: translateX(5rem);
	}

	.zhong {
		font-size: 5rem;
		font-weight: bold;
		left: 50%;
		position: absolute;
		top: 45%;
		transform: translate(-50%, -50%) scaleY(1.75);
		z-index: 1;
	}

	.mouth {
		height: 4rem;
		left: 50%;
		overflow: hidden;
		position: absolute;
		top: 60%;
		transform: translateX(-50%);
		width: 30rem;

		.lip {
			animation: anim_smile 2.5s 1 forwards;
			border-bottom: .5rem solid #ef6275;
			border-radius: 50%;
			bottom: 0;
			height: 0;
			left: -1rem;
			position: absolute;
			width: 32rem;

			@keyframes anim_smile {
				0% {height: 0;}
				100% {height: 10rem;}
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
		<div class="jia">
			<div>加</div>
		</div>
		<div class="zai">
			<div>载</div>
		</div>
		<div class="zhong">中</div>
		<div class="mouth">
			<div class="lip"></div>
		</div>
		<div class="process">
			<div></div>
		</div>
	</div>
</template>

<script>
import {mutation} from '@/assets/js/store.js'

export default {
	data() {
		return {

		}
	},

	mounted() {
		setTimeout(() => mutation.setCanRunAnimation(true), 2500)
	}
}
</script>