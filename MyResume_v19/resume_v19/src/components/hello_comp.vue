<style lang="scss">
.hello-comp-container {
	height: 100%;
	position: relative;
	width: 100%;

	.pic-wrapper {
		animation: pic-change 2.5s linear 1 forwards;
		background: url(../assets/img/m_pic_1.png) center/ contain no-repeat;
		height: 100%;
		width: 100%;
	}

	@keyframes pic-change {
		0% {background-image: url(../assets/img/m_pic_1.png)}
		45% {background-image: url(../assets/img/m_pic_1.png)}
		50% {background-image: url(../assets/img/m_pic_2.png)}
		80% {background-image: url(../assets/img/m_pic_2.png)}
		95% {background-image: url(../assets/img/m_pic_3.png)}
		100% {background-image: url(../assets/img/m_pic_3.png)}
	}
}
</style>

<template>
	<div class="hello-comp-container">
		<div class="pic-wrapper" ref="picWrapper">
		</div>
	</div>
</template>

<script>
import {mutation} from '@/assets/js/store.js'

export default {
	data() {
		return {
			// picArray: [
			// 	require('../assets/img/m_pic_1.png'),
			// 	require('../assets/img/m_pic_2.png'),
			// 	require('../assets/img/m_pic_3.png')
			// ],
			// curIndex: 0
		}
	},

	mounted() {
		this.$refs.picWrapper.addEventListener('animationend', () => mutation.setCanRunAnimation(true))
	}
}
</script>