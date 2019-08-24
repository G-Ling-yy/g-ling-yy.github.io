<style lang="scss">
.pc-content-comp-container {
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
	text-align: left;
	width: calc(100% + 17px);

	#container_print {
		font-family: KaiTi,serif;
		font-size: 1.1rem;
		display: flex;
		min-height: 101vh;
		position: relative;
		min-width: 44rem;

		.block {
			padding: 5%;
			width: 100%;

			&.self-assessment {
				height: 10rem;
				margin-bottom: 7rem;
			}

			.color_red {
				color: #ef6275;
			}

			.color_blue {
				color: #4D9BB2;
			}

			h1 {
				font-size: 1.7rem;
				margin: 0 0 1rem;

				i {
					margin-right: .8rem;
				}
			}

			p {
				text-indent: 2em;
			}
		}

		#aside_left {
			background-color: #eee;
			flex: .35;
			padding-bottom: 5rem;

			#pi_headwrapper {
				align-items: center;
				display: flex;
				height: 10rem;
				justify-content: center;
				margin-bottom: 7rem;
				width: 100%;

				#pi_head {
					background: url(https://g-ling-yy.github.io/MyResume_v19/img/pc_avatar.jpg) center/ contain no-repeat #f9fbf8;
					border-radius: 50%;
					box-shadow: 0 .1rem .2rem #666; 
					height: 7rem;
					width: 7rem;
				}
			}

			#pi_link {
				height: 5rem;
				overflow: hidden;
				position: absolute;
				top: 10rem;
				width: 100%;
				min-width: 44rem;
				z-index: 1;

				#pi_left {
					align-items: center;
					color: #fff;
					display: flex;
					float: left;
					height: 100%;
					left: -60%;
					justify-content: flex-end;
					position: relative;
					transition: 1.7s;
					width: 60%;

					&.changing {
						left: 0;
					}

					#pi_name {
						font-size: 2.5rem;
						left: 33%;
						position: absolute;
					}

					#pi_want {
						float: right;
						white-space: nowrap;
					}
				}

				#pi_right {
					align-items: center;
					display: flex;
					flex-flow: column;
					float: right;
					height: 100%;
					justify-content: space-around;
					position: relative;
					right: -30%;
					transition: 1.7s;
					width: 30%;

					&.changing {
						right: 0;
					}

					a {
						color: #4D9BB2;
					}
				}

				& #pi_left::after, & #pi_right::after {
					border-radius: 1rem;
					content: '';
					display: block;
					height: 100%;
					position: absolute;
					transform: skewX(20deg) translateX(1rem);
					width: 115%;
					z-index: -1;
				}
				& #pi_left::after {
					background: linear-gradient(to right, #ef6275, #4D9BB2);
					left: -2.7rem;
				}
				& #pi_right::after {
					background-color: #eee;
					left: -1rem;
				}
			}

			.block {
				padding-left: 10%;
			}

			#pi_info {
				max-height: 0;
				overflow: hidden;
				padding: 0 0 0 20%;
				transition: 1.7s;

				&.changing {
					max-height: 9999px;
					padding: 1rem 0 .5rem 20%;
				}
			}

			#pi_info li, #pi_skills li {
				margin: 0 0 .5rem 0;
			}

			#pi_skills, #pi_hobbies {
				list-style: none;
				padding: 1rem 0 .5rem 10%;
			}

			#pi_skills {
				li {
					align-items: center;
					display: flex;
					height: 1.5rem;

					p {
						color: #999;
						flex: .15 1 15%;
						text-indent: 0;
					}

					.process {
						background: #999;
						border-radius: 1rem;
						flex: .85;
						height: 40%;

						div {
							background: #ef6275;
							border-radius: 1rem;
							display: block;
							height: 100%;
							transition: 1.7s;
							width: 0;
						}
					}
				}
			}

			#pi_hobbies {
				display: flex;
				font-size: 3rem;

				li {
					flex: 1;
				}
			}
		}

		#aside_right {
			background-color: #fff;
			flex: .55;
			padding-bottom: 5rem;
			position: relative;

			&::after {
				border-left: 1px dotted #4D9BB2;
				content: '';
				height: calc(100% - 22rem);
				left: calc(5% + .5rem);
				position: absolute;
				top: 19rem;
				width: .5rem;
			}

			#pi_items a, #pi_education h4, #pi_experience h4 {
				color: #4D9BB2;
				display: inline-block;
				margin-bottom: 1rem;
				position: relative;
				text-indent: 2rem;
				text-decoration: none;

				&::before {
					background-color: #4D9BB2;
					border-radius: 50%;
					content: '';
					height: .8rem;
					left: .1rem;
					position: absolute;
					top: .2rem;
					width: .8rem;
				}
			}

			#pi_items_wrapper {
				overflow: hidden;
				max-height: calc(2.75vw + 32px);
				transition: 1.7s;

				#pi_items {
					p {
						margin-bottom: 1rem;
						padding-left: 2rem;
					}

					img {
						display: block;
						height: auto;
						margin-left: 2em;
						width: 15rem;
					}
				}
			}

			#pi_experience {
				a {
					color: #4D9BB2;
				}

				p {
					margin-bottom: 1rem;
					padding-left: 2rem;
				}
			}
		}
	}
}
</style>

<template>
	<div class="pc-content-comp-container">
		<main id="container_print">
			<aside id="aside_left">
				<div id="pi_headwrapper">
					<a id="pi_head" href="javascript:;" @click="reload"></a>
				</div>
				<div id="pi_link">
					<div id="pi_left" :class="[ isShowSkillBar && 'changing']">
						<p id="pi_name">{{baseInfo.name}}</p>
						<p id="pi_want">求职意向: 前端开发</p>
					</div>
					<div id="pi_right" :class="[ isShowSkillBar && 'changing']">
						<a :href="`tel:${baseInfo.phoneNumber}`" id="pi_phone">
							<i class="fa fa-mobile" aria-hidden="true"></i>
							{{baseInfo.phoneNumber}}
						</a>
						<a :href="`tencent://message/?uin=${baseInfo.QQ}`" id="pi_QQ">
							<i class="fa fa-qq" aria-hidden="true"></i>
							{{baseInfo.QQ}}
						</a>
					</div>
				</div>
				<div class="block">
					<h1 class="color_red"><i class="fa fa-newspaper-o"></i> 基本信息</h1>
					<ul id="pi_info" :class="[ isShowSkillBar && 'changing']">
						<li v-for="(item, index) in baseInfo.infoArray" :key="index">{{item}}</li>
					</ul>
				</div>
				<div class="block">
					<h1 class="color_red"><i class="fa fa-paw"></i>个人技能</h1>
					<ul id="pi_skills">
						<li v-for="(skill, index) in skillInfoArray" :key="index">
							<p>{{skill.name}}</p>
							<div class="process">
								<div :style="{width: `${isShowSkillBar ? skill.percent : 0}%`}"></div>
							</div>
						</li>
					</ul>
				</div>
				<div class="block">
					<h1 class="color_red"><i class="fa fa-heart" aria-hidden="true"></i> 个人爱好</h1>
					<ul id="pi_hobbies">
						<li><i class="fa fa-music" aria-hidden="true"></i></li>
						<li><i class="fa fa-gamepad" aria-hidden="true"></i></li>
						<li><i class="fa fa-automobile"></i></li>
					</ul>
				</div>
			</aside>
			<aside id="aside_right">
				<div class="block self-assessment">
					<h1 class="color_blue"><i class="fa fa-user" aria-hidden="true"></i>自我评价</h1>
					<p>{{selfAssessment}}</p>
				</div>
				<div id="pi_items_wrapper" :style="{'max-height': `${isShowSkillBar ? '9999px' : 'calc(2.75vw + 32px)'}`}">
					<div id="pi_items" class="block">
						<h1 class="color_blue"><i class="fa fa-database"></i> 项目经历</h1>
						<div v-for="(project, index) in projectArray" :key="index">
							<a :href="project.link" target="_blank">{{project.name}}</a>
							<p v-html="project.intro"></p>
							<img v-if="project.image" v-for="img in project.image" :src="img" alt="">
						</div>
					</div>
				</div>
				<div id="pi_experience" class="block">
					<h1 class="color_blue"><i class="fa fa-briefcase"></i>工作经历</h1>
					<h4><a href="https://www.weizoom.com/" target="_blank">微众传媒有限公司</a></h4>
					<p>2017.3.15 - 2018.6.30 间在该公司任职前端, 主要工作内容为微信小程序及H5页面</p>
					<h4><a href="https://www.vxiaocheng.com/" target="_blank">小诚文化传媒有限公司</a></h4>
					<p>2018.9.5 - 2019.7.23 间在该公司任职前端, 主要工作内容为微信小程序, Vue的移动端及PC端</p>
				</div>
				<div id="pi_education" class="block">
					<h1 class="color_blue"><i class="fa fa-book"></i>教育背景</h1>
					<h4>2013 - 2016 软件技术</h4>
					<p>苏州市职业大学</p>
				</div>
			</aside>
		</main>
	</div>
</template>

<script>
import {userInfo, store} from '@/assets/js/store.js'

export default {
	data() {
		return {
			isShowSkillBar: false
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
				setTimeout(() => this.isShowSkillBar = true, 2000)
			}
		}
	},

	methods: {
		reload(e) {
			e.preventDefault()
			localStorage.setItem('hellowIsShowed', false)
			setTimeout(() => location.reload())
		}
	},

	mounted() {
		if (this.isShowed) {
			setTimeout(() => this.isShowSkillBar = true, 300)
		}
	}
}
</script>