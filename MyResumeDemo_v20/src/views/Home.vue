<style lang="scss" scoped>
	.home {
		header {
			display: flex;
			height: 260px;
			margin: 0 5%;
			padding-top: 60px;

			.avatar-wrapper {
				align-items: center;
				border-radius: 10px;
				display: flex;
				justify-content: center;
				margin-right: 7%;
				overflow: hidden;
				width: 200px;
				min-width: 200px;

				img.avatar {
					max-height: 200px;
					max-width: 200px;
				}

				.default-avatar {
					background-color: #fff;
					border-radius: 50%;
					box-shadow: 0 5px 10px 0 #aaa;
					height: 90%;
					position: relative;
					width: 90%;

					.left-eye, .right-eye {
						border-radius: 50%;
						height: 40px;
						overflow: hidden;
						position: absolute;
						top: 50px;
						width: 80px;

						&::after {
							border: 6px solid;
							border-radius: 60px / 150px;
							content: '';
							display: block;
							height: 500px;
							width: calc(100% - 12px);
						}
					}

					.left-eye {
						left: 15px;
					}

					.right-eye {
						right: 15px;
					}

					.mouth {
						border-radius: 50%;
						bottom: 20px;
						height: 50px;
						left: 0;
						margin: 0 auto;
						overflow: hidden;
						position: absolute;
						right: 0;
						width: 130px;

						&::after {
							border: 6px solid;
							border-radius: 70px / 150px;
							bottom: 0;
							content: '';
							display: block;
							height: 500px;
							left: 0;
							position: absolute;
							width: calc(100% - 12px);
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
			height: 100px;
			line-height: 100px;
			margin-top: -30px;
			text-align: left;
			text-indent: 2em;
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
		<Block v-for="(block, index) in user.blocks" :key="index" :blockValue="block"></Block>
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
