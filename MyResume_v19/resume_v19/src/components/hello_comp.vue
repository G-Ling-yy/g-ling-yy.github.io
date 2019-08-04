<style lang="scss">
.hello-comp-container {
	height: 100%;
	position: relative;
	width: 100%;

	.pic-wrapper {
		animation: pic-change 2.5s linear 1 forwards;
		background: url(https://g-ling-yy.github.io/MyResume_v19/img/m_pic_1.png) center/ contain no-repeat;
		height: 100%;
		width: 100%;
	}

	@keyframes pic-change {
		0% {background-image: url(https://g-ling-yy.github.io/MyResume_v19/img/m_pic_1.png)}
		45% {background-image: url(https://g-ling-yy.github.io/MyResume_v19/img/m_pic_1.png)}
		50% {background-image: url(https://g-ling-yy.github.io/MyResume_v19/img/m_pic_2.png)}
		80% {background-image: url(https://g-ling-yy.github.io/MyResume_v19/img/m_pic_2.png)}
		95% {background-image: url(https://g-ling-yy.github.io/MyResume_v19/img/m_pic_3.png)}
		100% {background-image: url(https://g-ling-yy.github.io/MyResume_v19/img/m_pic_3.png)}
	}
}
</style>

<template>
	<div class="hello-comp-container">
		<div class="pic-wrapper" ref="picWrapper" v-show="isPicsLoaded">
		</div>
	</div>
</template>

<script>
import {mutation} from '@/assets/js/store.js'

export default {
	data() {
		return {
			picArray: [
				'https://g-ling-yy.github.io/MyResume_v19/img/m_pic_1.png',
				'https://g-ling-yy.github.io/MyResume_v19/img/m_pic_2.png',
				'https://g-ling-yy.github.io/MyResume_v19/img/m_pic_3.png'
			],
			picLeftCount: 3,
			isPicsLoaded: false
		}
	},

	watch: {
		picLeftCount(newV, oldV) {
			if (newV === 0) {
				this.isPicsLoaded = true
			}
		}
	},

	created() {
		this.picArray.forEach(url => {
			const myPic = new Image()
			myPic.src = url
			myPic.onload = () => this.picLeftCount--
		})
	},

	mounted() {
		this.$refs.picWrapper.addEventListener('animationend', () => mutation.setCanRunAnimation(true))
	}
}
</script>