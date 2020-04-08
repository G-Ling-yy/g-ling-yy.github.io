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
	background-color: #ececec;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100vh;
	overflow-x: hidden;
	overflow-y: scroll;
	min-width: 1080px;
	&::-webkit-scrollbar {
		display: none;
	}
}
</style>
