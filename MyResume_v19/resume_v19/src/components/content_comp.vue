<style lang="scss">
.content-comp-container {
	background-color: #d8b362;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
	padding: 30px;
	width: 100%;

	&::-webkit-scrollbar {
		display: none;
	}

	.paper {
		background-color: #eff;
		box-shadow: 0 0 10px #666;
		font-family: KaiTi, serif;
		font-size: 1.4rem;
		opacity: 0;
		padding: 90px 15px 40px;
		position: relative;
		text-align: left;
		transition: .7s;

		&.show, &.show::before, &.show::after {
			opacity: 1;
		}

		&.show {
			div.line {
				h2 {
					transform: translateX(0);
				}

				p {
					transform: translateX(0);
				}
			}
		}

		&::before, &::after {
			background: rgba(255, 255, 255, 0.6);
			border: 1px solid rgba(200, 200, 200, 0.8);
			box-shadow: 0 0 2px rgba(200, 200, 200, 0.8);
			content: '';
			height: 29px;
			opacity: 0;
			position: absolute;
			top: 40px;
			transition: .7s;
			width: 10rem;
		}

		&::before {
			right: -35px;
			top: 15px;
			transform: rotate(45deg);
			transition: .7s 1s;
		}

		&::after {
			left: -50px;
			transform: rotate(-30deg);
			transition: .7s .5s;
		}

		div.line {
			border-bottom: 2px solid #999;
			height: 50px;
			line-height: 40px;
			padding: 5px 0;

			&.special {
				height: auto;
				margin-top: -2px;
				padding: 0;

				p {
					line-height: 50px;
					position: relative;

					hr {
						background-color: #999;
						border: none;
						height: 2px;
						left: 0;
						position: absolute;
						width: 100%;
					}
				}
			}

			h2 {
				transition: 1.2s 1.2s;
				transform: translateX(-100vw);
			}

			p {
				color: #2a118b;
				height: 100%;
				overflow: hidden;
				position: relative;
				text-indent: 2em;
				transform: translateX(100vw);

				a {
					color: #2a118b;
					text-decoration: underline;
				}

				span {
					color: #0f0;
					position: absolute;
					right: 0;
				}
			}

			@for $i from 1 through 100 {
				&:nth-child(#{$i}) {
					p {
						transition: 1.2s (1s + .3s * $i);
					}
				}
			}
		}
	}
}
</style>

<template>
	<div class="content-comp-container">
		<div :class="['paper', isShowBar && 'show']">
			<div class="block">
				<div class="line">
					<h2>基本信息:</h2>
				</div>
				<div class="line">
					<p>姓名: {{baseInfo.name}}</p>
				</div>
				<div class="line">
					<p>求职意向: 前端开发</p>
				</div>
				<div class="line" v-for="item in baseInfo.infoArray">
					<p>{{item}}</p>
				</div>
				<div class="line">
					<p>QQ: <a :href="`mqqwpa://im/chat?uin=${baseInfo.QQ}`">{{baseInfo.QQ}}</a></p>
				</div>
				<div class="line">
					<p>TEL: <a :href="`tel:${baseInfo.phoneNumber}`">{{baseInfo.phoneNumber}}</a></p>
				</div>
				<div class="line"></div>
			</div>
			<div class="block">
				<div class="line">
					<h2>个人技能:</h2>
				</div>
				<div class="line" v-for="skill in skillInfoArray">
					<p>{{skill.name}} <span>{{'■'.repeat(skill.percent / 10)}}</span></p>
				</div>
				<div class="line"></div>
			</div>
			<div class="block">
				<div class="line">
					<h2>工作经历:</h2>
				</div>
				<div class="line special">
					<p>起始时间: 2016.11.15 - 2018.6.30</p>
				</div>
				<div class="line special">
					<p>公司: 微众传媒有限公司</p>
				</div>
				<div class="line special">
					<p>职位: 前端</p>
				</div>
				<div class="line special">
					<p>工作内容: 微信小程序及浏览器H5页面</p>
				</div>
				<div class="line special">
					<p>起始时间: 18.9.5 - 19.7.23</p>
				</div>
				<div class="line special">
					<p>公司: 小诚文化传媒有限公司</p>
				</div>
				<div class="line special">
					<p>职位: 前端</p>
				</div>
				<div class="line special">
					<p>工作内容: 微信小程序, Vue移动端及PC端等</p>
				</div>
				<div class="line"></div>
			</div>
			<div class="block">
				<div class="line">
					<h2>项目经历:</h2>
				</div>
				<div class="line" v-for="project in projectArray.slice(0, -1)">
					<p><a href="javascript:;" :data-url="project.link" target="_blank" @click="openBlank">{{project.name}}</a></p>
				</div>
				<div class="line special">
					<p>{{projectArray.slice(-1)[0].name.concat(projectArray.slice(-1)[0].intro)}}</p>
					<div style="border-top: 2px solid #999;" v-for="img in projectArray.slice(-1)[0].image">
						<img style="display: block;height: auto;margin: 0 auto;width: 60vw;" :src="img" alt="">
					</div>
				</div>
				<div class="line"></div>
			</div>
			<div class="block">
				<div class="line">
					<h2>自我评价:</h2>
				</div>
				<div class="line special">
					<p>{{selfAssessment}}</p>
				</div>
				<div class="line"></div>
			</div>
			<div class="line" style="text-align: center;">额···就这样吧~<span @touchstart="reload">(⊙﹏⊙)</span></div>
		</div>
	</div>
</template>

<script>
import {userInfo, store} from '@/assets/js/store.js'

export default {
	data() {
		return {
			isShowBar: false
		}
	},

	computed: {
		baseInfo() {
			return userInfo.baseInfo
		},

		skillInfoArray() {
			return userInfo.skillInfoArray
		},

		selfAssessment() {
			return userInfo.selfAssessment
		},

		projectArray() {
			return userInfo.projectArray
		},

		isShowed() {
			return store.isShowed
		},

		canRunAnimation() {
			return store.canRunAnimation
		}
	},

	watch: {
		canRunAnimation(newV, oldV) {
			if (newV && !this.isShowed) {
				setTimeout(() => this.isShowBar = true, 3300)
			}
		}
	},

	methods: {
		openBlank(e) {
			if (e.target.dataset.url === 'javascript:;') return;
			window.open(e.target.dataset.url, '_blank')
		},

		addLineForSpecialLine() {
			Array.from(document.querySelectorAll('div.line.special p')).forEach($p => {
				const number = $p.clientHeight / 50

				for(let i = 1; i < number; i++) {
					const hr = document.createElement("Hr")
					hr.style.top = i * 48 + 'px'
					$p.appendChild(hr)
				}
			})
		},

		reload( ) {
			localStorage.setItem('hellowIsShowed', false)
			setTimeout(() => location.reload())
		}
	},

	mounted() {
		if (this.isShowed) {
			setTimeout(() => this.isShowBar = true, 300)
		}
		this.addLineForSpecialLine()
	}
}
</script>