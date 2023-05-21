<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import HelloWorld from './components/HelloWorld.vue';

// @Component({
// 	components: {
// 		HelloWorld,
// 	},
// })
export default class App extends Vue {}
</script>

<style lang="scss">
	#app {
		background-color: var(--themeColor);
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		min-height: 300vh;
		// overflow-x: hidden;
		// overflow-y: scroll;
		user-select: none;
		width: 100%;
		&::-webkit-scrollbar {
			display: none;
		}
	}

	// @media screen and (max-width: 520px) {
	// 	#app {
	// 		min-width: 100vw;
	// 	}
	// }
</style>
