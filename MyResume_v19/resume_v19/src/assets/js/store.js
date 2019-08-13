import Vue from 'vue'

export const userInfo = Vue.observable({
	baseInfo: {
		name: '高大全',
		phoneNumber: 18860913014,
		QQ: 934830721,
		infoArray: [
			'年 龄： 25 岁',
			'性 别： 男',
			'籍 贯： 江苏徐州',
			'学 历： 大专',
			'工作经验: 2 年'
		]
	},

	skillInfoArray: [
		{
			name: 'H5',
			percent: 50
		},
		{
			name: 'CSS3',
			percent: 60
		},
		{
			name: 'JS',
			percent: 60
		},
		{
			name: 'SASS',
			percent: 40
		},
		{
			name: 'VUE',
			percent: 50
		},
		{
			name: 'WEPY',
			percent: 70
		}
	],

	selfAssessment: '本人性格开朗、稳重、有活力、待人热情、真诚。有较强的团队协作精神，较好的社交能力，善于处理各种人际关系。能尽快适应各种环境并融入其中。(100%还原设计稿，精确到像素)',

	projectArray: [
		{
			name: 'Github User Finder',
			intro: '输入指定github用户ID，停止输入后自动查询用户信息并展示<br/>debounce防止用户输入过程中多次无效查询操作',
			link: 'https://g-ling-yy.github.io/MyTask_29/'
		},
		{
			name: 'NotePad',
			intro: '简易记事本, 可以做增删改除等操作<br>通过localStorage保存数据在本地',
			link: 'https://g-ling-yy.github.io/MyTask_22/'
		},
		{
			name: 'Exact Time',
			intro: '移动端的一个H5小游戏, 时间刚刚好, 喝酒聚会助兴小游戏',
			link: 'https://g-ling-yy.github.io/h5_exacttime/dist/'
		},
		{
			name: '3D Demo',
			intro: 'CSS3 3D动效展示',
			link: 'https://g-ling-yy.github.io/MyTask_12/'
		},
		{
			name: 'CSS3 皮卡丘',
			intro: '纯css绘卡通形象皮卡丘',
			link: 'https://g-ling-yy.github.io/Pikachu/'
		},
		{
			name: 'Angry Uncle',
			intro: '移动端的一个H5小游戏, 愤怒的大叔, 喝酒聚会助兴小游戏',
			link: 'https://g-ling-yy.github.io/h5_angryuncle/dist/'
		},
		{
			name: '知乎PC端登录页面(仿)',
			intro: '模仿知乎PC端登录页面UI练手的',
			link: 'https://g-ling-yy.github.io/MyTask_4/'
		},
		{
			name: 'QQ音乐(仿)',
			intro: '模仿qq音乐网页内容，数据与QQ音乐同步更新（因为音乐链接是从网上找的所以当链接失效的时候我的QQ音乐就也不能正常播放音乐了）',
			link: 'https://g-ling-yy.github.io/QQmusic/'
		},
		{
			name: '星秀泡泡, 星秀魔方等微信小程序(无link连接)',
			intro: '因为微信小程序只能允许内部打开页面可以跳转小程序所以这里无法给出link页面链接',
			link: 'javascript:;',
			image: ['https://g-ling-yy.github.io/MyResume_v19/img/qrcode_paopao.jpg']
		}
	]
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

		const seconds = isPC ? 1700 : 3000
		setTimeout(() => this.setIsShowedTrue(), seconds)
	}
}