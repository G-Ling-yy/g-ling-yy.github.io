import Vue from 'vue'


export const store = Vue.observable({
	canRunAnimation: false
})

export const mutation = {
	setCanRunAnimation(boolV) {
		store.canRunAnimation = !!boolV
	}
}