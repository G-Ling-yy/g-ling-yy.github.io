<style lang="scss" scoped>
	.block-comp {
		background-color: #fff;
		margin: 4rem 0;
		padding: 2.5rem 0 0;
		position: relative;

		.title {
			background-color: #4a4f5a;
			border-radius: 3rem;
			border-bottom-left-radius: 0;
			color: #fff;
			font-size: 1.5rem;
			font-weight: bold;
			height: 3rem;
			left: 5%;
			line-height: 3rem;
			overflow: hidden;
			padding: 0 2.5rem;
			position: absolute;
			top: -1.8rem;
			transform: rotate(-6deg);
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
					font-size: 1rem;
					line-height: 1.5rem;
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
						top: .45rem;
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
					margin-bottom: 1rem;
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

		.paperclip {
			$color: #000;
			$innerColor: #0005;

			background: linear-gradient(to right, $innerColor, $innerColor) 0 22px/ 30px 3px no-repeat;
			height: 60px;
			left: 0;
			overflow: hidden;
			position: absolute;
			top: -30px;
			width: 100px;
			&::before, .inner {
				content: '';
				display: block;
				height: .5rem;
				left: 0;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
			}
			&::before {
				border: 3px solid $color;
				border-radius: 20px;
				height: 30px;
				left: -30px;
				width: 110px;
				z-index: 99;
			}
			.inner {
				height: 20px;
				left: 30px;
				overflow: hidden;
				top: 50%;
				transform: translateY(-50%);
				width: 70px;
				z-index: 99;
					&::before {
					border: 3px solid $innerColor;
					border-radius: 20px;
					content: '';
					display: block;
					height: 10px;
					left: -30px;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					width: 60px;
					z-index: 99;
				}
			}
		}

		&:last-child .content .option:last-child .value{
			user-select: auto;
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
				<div v-if="option.value !== 'null'" class="value">{{option.value || 'option.value'}}</div>
				<ul v-if="option.details && option.details.length">
					<li v-for="(detail, index) in option.details" :key="index">{{detail}}</li>
				</ul>
			</div>
		</div>
		<div class="paperclip">
			<div class="inner"/>
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