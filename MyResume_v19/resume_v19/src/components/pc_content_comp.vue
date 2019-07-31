<style lang="scss">
.pc-content-comp-container {
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
	text-align: left;
	width: calc(100% + 17px);

	#container_print {
		font-family: KaiTi,serif;
		display: flex;
		min-height: 101vh;
		position: relative;
		min-width: 44rem;

		.block {
			padding: 5%;
			width: 100%;

			&:first-child {
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
				font-size: 1.4rem;
				margin: 0 0 1rem;

				i {
					margin-right: .8rem;
				}
			}

			p {
				text-indent: 2rem;
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
					background-color: #fff;
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
					justify-content: flex-end;
					position: relative;
					width: 60%;

					#pi_name {
						font-size: 2rem;
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
					width: 30%;

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
				padding: 1rem 0 .5rem 20%;
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
							width: 50%;
						}
					}
				}
			}

			#pi_hobbies {
				display: flex;
				font-size: 2rem;

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

			#pi_items a, #pi_education h4 {
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

			#pi_items p {
				margin-bottom: 1rem;
				padding-left: 2rem;
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
					<div id="pi_left">
						<p id="pi_name">{{baseInfo.name}}</p>
						<p id="pi_want">求职意向: 前端开发</p>
					</div>
					<div id="pi_right">
						<a href="tel:18860913014" id="pi_phone">
							<i class="fa fa-mobile" aria-hidden="true"></i>
							{{baseInfo.phoneNumber}}
						</a>
						<a href="tencent://message/?uin=934830721" id="pi_QQ">
							<i class="fa fa-qq" aria-hidden="true"></i>
							934830721
						</a>
					</div>
				</div>
				<div class="block">
					<h1 class="color_red"><i class="fa fa-newspaper-o"></i> 基本信息</h1>
					<ul id="pi_info">
						<li>年 龄： 24 岁</li>
						<li>性 别： 男</li>
						<li>籍 贯： 江苏徐州</li>
						<li>学 历： 大专</li>
						<li>身 高： 173cm</li>
						<li>体 重： 64kg</li>
					</ul>
				</div>
				<div class="block">
					<h1 class="color_red"><i class="fa fa-paw"></i>个人技能</h1>
					<ul id="pi_skills">
						<li><p>HTML5</p><div class="process"><div></div></div></li>
						<li><p>CSS3</p><div class="process"><div></div></div></li>
						<li><p>JS</p><div class="process"><div></div></div></li>
						<li><p>SASS</p><div class="process"><div></div></div></li>
						<li><p>JQuery</p><div class="process"><div></div></div></li>
						<li><p>VUE</p><div class="process"><div></div></div></li>
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
				<div class="block">
					<h1 class="color_blue"><i class="fa fa-user" aria-hidden="true"></i>自我评价</h1>
					<p>本人性格开朗、稳重、有活力、待人热情、真诚。有较强的团队协作精神，较好的社交能力，善于处理各种人际关系。能尽快适应各种环境并融入其中。(100%还原设计稿，精确到像素级别~)</p>
				</div>
				<div id="pi_items" class="block">
					<h1 class="color_blue"><i class="fa fa-database"></i> 项目经历</h1>
					<a href="https://g-ling-yy.github.io/MyTask_29/" target="_blank">Github User Finder</a>
					<p>输入指定github用户ID，停止输入后自动查询用户信息并展示<br>debounce防止用户输入过程中多次无效查询操作</p>
					<a href="https://g-ling-yy.github.io/MyTask_25/" target="_blank">Ajax</a>
					<p>通过对数据的简单交互展示ajax的基本用法和操作</p>
					<a href="https://g-ling-yy.github.io/MyTask_22/" target="_blank">简易记事本</a>
					<p>可以做增删改除等操作<br>通过localStorage保存数据在本地</p>
					<a href="https://g-ling-yy.github.io/MyTask_19/" target="_blank">简易计算器</a>
					<p>可以做加减乘除等基本操作，纯原生JS</p>
					<a href="https://g-ling-yy.github.io/MyTask_8/" target="_blank">3D demos</a>
					<p>css3 动画特效和3D特效展示</p>
					<a href="https://g-ling-yy.github.io/Pikachu/" target="_blank">皮卡丘</a>
					<p>纯css绘卡通形象皮卡丘</p>
					<a href="https://g-ling-yy.github.io/MyTask_4/" target="_blank">知乎PC端登录页面（仿）</a>
					<p>模仿知乎PC端的登录页面内容</p>
					<a href="https://g-ling-yy.github.io/QQmusic/" target="_blank">QQ音乐（仿）</a>
					<p>模仿qq音乐网页内容，数据与QQ音乐同步更新（因为音乐链接是从网上找的所以当链接失效的时候我的QQ音乐就也不能正常播放音乐了）</p>
				</div>
				<div id="pi_education" class="block">
					<h1 class="color_blue"><i class="fa fa-book"></i> 教育背景</h1>
					<h4>2013 - 2016 软件技术</h4>
					<p>苏州市职业大学</p>
				</div>
			</aside>
		</main>
	</div>
</template>

<script>
import {userInfo} from '@/assets/js/store.js'

export default {
	data() {
		return {

		}
	},

	computed: {
		baseInfo() {
			return userInfo.baseInfo
		}
	},

	methods: {
		reload(e) {
			e.preventDefault()
			localStorage.setItem('hellowIsShowed', false)
			setTimeout(() => location.reload())
		}
	}
}
</script>