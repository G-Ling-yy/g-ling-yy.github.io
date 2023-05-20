<style lang="scss" scoped>
	.home {
		header {
			display: flex;
			height: 13rem;
			padding: 3rem 5% 0;
			position: relative;

			.texts {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding-top: 1.8rem;
				text-align: left;

				h1 {
					font-size: 2.4rem;
					letter-spacing: .2em;
				}

				.profile {
					display: flex;
					flex-direction: column;
					height: 40%;
					justify-content: space-between;

					p {
						white-space: nowrap;

						span {
							border-right: 2px solid #ccc ;
							padding: 0 .4rem;
							&:first-child {
								padding-left: 0;
							}
							&:last-child {
								border-right: none;
							}
						}
					}
				}
			}

			.avatar-wrapper {
				align-items: center;
				border-radius: .5rem;
				display: flex;
				height: 10rem;
				justify-content: center;
				overflow: hidden;
				position: absolute;
				right: 5%;
				transform: scale(.7) translateX(25%);
				width: 10rem;

				img.avatar {
					max-height: 10rem;
					max-width: 10rem;
				}

				.default-avatar {
					background-color: #fff;
					border-radius: 50%;
					box-shadow: 0 .25rem .5rem 0 #aaa;
					height: 90%;
					position: relative;
					width: 90%;

					.left-eye, .right-eye {
						border-radius: 50%;
						height: 2rem;
						overflow: hidden;
						position: absolute;
						top: 2.5rem;
						width: 4rem;

						&::after {
							border: .3rem solid;
							border-radius: 3rem / 7.5rem;
							content: '';
							display: block;
							height: 25rem;
							width: calc(100% - .6rem);
						}
					}

					.left-eye {
						left: .75rem;
					}

					.right-eye {
						right: .75rem;
					}

					.mouth {
						border-radius: 50%;
						bottom: 1rem;
						height: 2.5rem;
						left: 0;
						margin: 0 auto;
						overflow: hidden;
						position: absolute;
						right: 0;
						width: 6.5rem;

						&::after {
							border: .3rem solid;
							border-radius: 3.5rem / 7.5rem;
							bottom: 0;
							content: '';
							display: block;
							height: 25rem;
							left: 0;
							position: absolute;
							width: calc(100% - .6rem);
						}
					}
				}
			}
		}

		footer {
			height: 5rem;
			line-height: 5rem;
			margin-top: -1.5rem;
			text-align: left;
			text-indent: 2em;
		}
	}
</style>

<template>
	<div class="home">
		<header>
			<!-- 个人简介 -->
			<div class="texts">
				<h1>{{isGetData ? user.name || '(user数据为空)' : 'loading···'}}</h1>
				<div class="profile">
					<p>
						<span>男</span>
						<span>94.11</span>
						<span>6年</span>
						<span>Web前端</span>
					</p>
					<p>
						<span>18860913014</span>
						<span>934830721@qq.com</span>
					</p>
				</div>
			</div>

			<!-- 个人头像 -->
			<div class="avatar-wrapper">
				<img v-if="user.avatar" :src="user.avatar" alt="" class="avatar">
				<div v-else class="default-avatar">
					<div class="left-eye"></div>
					<div class="right-eye"></div>
					<div class="mouth"></div>
				</div>
			</div>
		</header>

		<main>
			<Block v-for="(block, index) in user.blocks" :key="index" :blockValue="block"></Block>
		</main>

		<footer v-show="isGetData && user.name">
			感谢您花时间阅读我的简历，期待能有机会与优秀的您共事。
		</footer>
	</div>
</template>

<script>
// @ is an alias to /src
import Block from '@/components/block.vue'

export default {
	name: 'Home',
	data: () => {
		return {
			isGetData: false,
			user: {}
		}
	},

	components: {
		Block
	},

	created() {
		fetch('./userData.json').then(res => res.json()).then(res => {
			this.isGetData = true
			// console.log('res', res)
			// 展示demo
			// this.user = res.demo
			// 展示user
			this.user = res.user
		})
	}
}
</script>
