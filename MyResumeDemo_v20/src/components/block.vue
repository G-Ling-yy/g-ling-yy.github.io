<style lang="scss" scoped>
	.block-comp {
		background-color: #fff;
		border-top: 3.6rem solid #ececec;
		border-bottom: 3.6rem solid #ececec;
		padding: 2.5rem 0;
		position: relative;

		.title {
			background-color: #4a4f5a;
			border-radius: .5rem;
			color: #fff;
			font-size: 2rem;
			font-weight: bold;
			height: 3.6rem;
			left: 5%;
			line-height: 3.6rem;
			overflow: hidden;
			padding: 0 2.5rem;
			position: absolute;
			top: -1.8rem;
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
					height: 2.5rem;
					line-height: 2.5rem;
					padding-left: 1.5rem;
					position: relative;
					width: 100%;

					&::before {
						background-color: #333;
						border-radius: 50%;
						content: '';
						height: .5rem;
						left: 0;
						position: absolute;
						top: 1rem;
						width: .5rem;
					}

					.tip {
						display: inline;
						font-size: .8rem;
					}
				}

				.value {
					color: #666;
					font-size: 1rem;
					height: 2.5rem;
					line-height: 1.5rem;
					padding-left: 1.5rem;
				}

				ul {
					color: #666;
					list-style: none;
					padding-left: 1.5rem;

					li {
						position: relative;
						text-indent: .8em;

						&::before {
							background-color: #666;
							border-radius: 50%;
							content: '';
							height: .35rem;
							left: 0;
							position: absolute;
							top: .45rem;
							width: .35rem;
						}
					}
				}
			}

			&.oneColumn {
				.option {
					margin-bottom: 1.65rem;
					width: 100%;

					.value {
						color: #333;
						font-size: 1.1rem;
					}

					ul {
						li {
							margin-bottom: .35rem;
						}
					}
				}
			}
		}

		&:last-child .content .option:last-child .value{
			user-select: auto;
		}
	}

	@media screen and (max-width: 520px) {
		.block-comp {
			border-bottom: 1.2rem solid #ececec;
			padding: 2.5rem 0 1rem;

			.title {
				font-size: 1.8rem;
			}

			.content {
				.option {
					.key {
						max-width: 6em;
					}
				}

				&.oneColumn {
					.option {
						.key {
							height: auto;
							max-width: 100%;
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