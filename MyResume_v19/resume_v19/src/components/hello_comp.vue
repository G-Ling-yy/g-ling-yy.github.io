<style lang="scss">
.hello-comp-container {
	height: 100%;background: #ff0;
	width: 100%;
}
</style>

<template>
	<div class="hello-comp-container">
		我是移动端的hello
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