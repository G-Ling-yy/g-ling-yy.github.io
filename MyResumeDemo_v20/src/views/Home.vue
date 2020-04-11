<style lang="scss" scoped>
	.home {
		header {
			display: flex;
			height: 13rem;
			margin: 0 5%;
			padding-top: 3rem;

			.avatar-wrapper {
				align-items: center;
				border-radius: .5rem;
				display: flex;
				justify-content: center;
				margin-right: 7%;
				overflow: hidden;
				width: 10rem;
				min-width: 10rem;

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

			.texts {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				text-align: left;

				h1 {
					font-size: 3.2rem;
					letter-spacing: .2em;
				}

				.profile {
					line-height: 1.5rem;
					max-width: 80%;
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

	@media screen and (max-width: 520px) {
		.home {
			header {
				margin: 0 3%;
				padding-top: 2rem;

				.avatar-wrapper {
					width: 8rem;
					min-width: 8rem;

					img.avatar {
						max-height: 8rem;
						max-width: 8rem;
					}

					.default-avatar {
						height: 7.2rem;
						width: 7.2rem;

						.left-eye, .right-eye {
							height: 1.6rem;
							top: 2rem;
							width: 3.2rem;
						}

						.left-eye {
							left: .6rem;
						}

						.right-eye {
							right: .6rem;
						}

						.mouth {
							bottom: .8rem;
							height: 2rem;
							width: 5.2rem;
						}
					}
				}
				.texts {
					justify-content: center;

					h1 {
						font-size: 2.6rem;
					}

					.profile {
						line-height: 1rem;
						max-width: 100%;
					}
				}
			}

			footer {
				font-size: .9rem;
				height: 3rem;
				margin: 0;
				line-height: 1.2rem;
			}
		}
	}
</style>

<template>
	<div class="home">
		<header>
			<div class="avatar-wrapper">
				<img v-if="user.avatar" :src="user.avatar" alt="" class="avatar">
				<div v-else class="default-avatar">
					<div class="left-eye"></div>
					<div class="right-eye"></div>
					<div class="mouth"></div>
				</div>
			</div>
			<div class="texts">
				<h1>{{isGetData ? user.name || '(user数据为空)' : 'loading···'}}</h1>
				<div class="profile">{{user.profileText}}</div>
			</div>
		</header>
		<main>
			<Block v-for="(block, index) in user.blocks" :key="index" :blockValue="block"></Block>
		</main>
		<footer v-show="isGetData && user.name">
			感谢您花时间阅读我的简历，期待能有机会和您共事。
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
