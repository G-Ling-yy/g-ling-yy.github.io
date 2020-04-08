<style lang="scss" scoped>
	.block-comp {
		background-color: #fff;
		border-top: 72px solid #ececec;
		border-bottom: 72px solid #ececec;
		padding: 50px 0;
		position: relative;

		.title {
			background-color: #4a4f5a;
			border-radius: 10px;
			color: #fff;
			font-size: 2rem;
			font-weight: bold;
			height: 72px;
			left: 5%;
			line-height: 72px;
			overflow: hidden;
			padding: 0 50px;
			position: absolute;
			top: -36px;
			max-width: 70%;
		}

		.content {
			display: flex;
			flex-wrap: wrap;
			padding: 0 10%;

			.option {
				text-align: left;
				width: 50%;

				.key {
					color: #333;
					font-size: 1.4rem;
					height: 50px;
					line-height: 50px;
					padding-left: 30px;
					position: relative;
					width: 100%;

					&::before {
						background-color: #333;
						border-radius: 50%;
						content: '';
						height: 10px;
						left: 0;
						position: absolute;
						top: 20px;
						width: 10px;
					}

					.tip {
						display: inline;
						font-size: .8rem;
					}
				}

				.value {
					color: #666;
					font-size: 1rem;
					height: 50px;
					line-height: 30px;
					padding-left: 30px;
				}

				ul {
					color: #666;
					list-style: none;
					padding-left: 30px;

					li {
						position: relative;
						text-indent: .8em;

						&::before {
							background-color: #666;
							border-radius: 50%;
							content: '';
							height: 7px;
							left: 0;
							position: absolute;
							top: 9px;
							width: 7px;
						}
					}
				}
			}

			&.oneColumn {
				.option {
					margin-bottom: 33px;
					width: 100%;

					.value {
						color: #333;
						font-size: 1.1rem;
					}

					ul {
						li {
							margin-bottom: 7px;
						}
					}
				}
			}
		}
	}
</style>

<template>
	<div class="block-comp">
		<div class="title">{{blockValue.title || 'title'}}</div>
		<div class="content" :class="[blockValue.columns == 1 && 'oneColumn']">
			<div class="option" v-for="(option, index) in blockValue.options" :key="index">
				<div class="key">
					{{option.key || 'option.key'}}
					<p class="tip" v-if="option.tip">({{option.tip}})</p>
				</div>
				<div class="value">{{option.value || 'option.value'}}</div>
				<ul v-if="option.details && option.details.length">
					<li v-for="(detail, index) in option.details" :key="index">{{detail}}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	
	export default {
		props: {
			blockValue: {
				type: Object,
				default: () => ({})
			}
		}
	}
</script>