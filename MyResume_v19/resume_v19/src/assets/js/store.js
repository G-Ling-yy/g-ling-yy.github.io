import Vue from 'vue'

export const userInfo = Vue.observable({
	baseInfo: {
		name: '高大全',
		phoneNumber: 18860913014
	}
})

const isShowed = JSON.parse(localStorage.getItem('hellowIsShowed')) || false

export const store = Vue.observable({
	isShowed: isShowed,
	canRunAnimation: false
})

export const mutation = {
	setIsShowedTrue() {
		store.isShowed = true
		localStorage.setItem('hellowIsShowed', true)
	},

	setCanRunAnimation(boolV) {
		store.canRunAnimation = !!boolV

		const seconds = isPC ? 1600 : 3000
		setTimeout(() => this.setIsShowedTrue(), seconds)
	}
}