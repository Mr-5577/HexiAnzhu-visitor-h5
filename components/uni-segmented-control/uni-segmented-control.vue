<template>
	<view :class="{ text: styleType === 'text' }" :style="{ borderColor: styleType === 'text' ? '' : activeColor }"
		class="segmented-control">
		<view v-for="(item, index) in normalizedValues"
			:class="[{ text: styleType === 'text' }, { active: index === currentIndex }]" :key="index" :style="{
        color:
          index === currentIndex
            ? styleType === 'text'
              ? activeColor
              : '#fff'
            : styleType === 'text'
              ? '#000'
              : activeColor,
        backgroundColor: index === currentIndex && styleType === 'button' ? activeColor : ''
      }" class="segmented-control-item" @click="_onClick(index)">
			{{ item.text || item }}
			<!-- uni-badge 角标 -->
			<uni-badge v-if="showBadge(item)" :text="getBadgeText(item)" type="error" size="small" class="badge-num" />
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniSegmentedControl',
		props: {
			current: {
				type: Number,
				default: 0
			},
			values: {
				type: Array,
				default () {
					return []
				}
			},
			activeColor: {
				type: String,
				default: '#007aff'
			},
			styleType: {
				type: String,
				default: 'button'
			}
		},
		data() {
			return {
				currentIndex: 0
			}
		},
		watch: {
			current(val) {
				if (val !== this.currentIndex) {
					this.currentIndex = val
				}
			}
		},
		computed: {
			// 标准化 values，保持向后兼容
			normalizedValues() {
				return this.values.map(item => {
					if (typeof item === 'string') {
						return {
							text: item
						};
					}
					return item;
				});
			},
		},
		created() {
			this.currentIndex = this.current
		},
		methods: {
			_onClick(index) {
				if (this.currentIndex !== index) {
					this.currentIndex = index
					this.$emit('clickItem', index)
				}
			},
			// 判断是否显示角标
			showBadge(item) {
				if (!item || typeof item !== 'object') return false;

				const badge = item.badge;

				if (badge === 0 || badge === false || badge === '' || badge === null || badge === undefined) {
					return false;
				}
				// 数字：只显示正数
				if (typeof badge === 'number') {
					return badge > 0;
				}

				// 处理字符串类型：空字符串不显示
				if (typeof badge === 'string') {
					return badge !== '';
				}

				// 布尔值：只显示true
				if (typeof badge === 'boolean') {
					return badge === true;
				}

				return false;
			},

			// 获取角标文本
			getBadgeText(item) {
				const badge = item.badge;

				if (typeof badge === 'number') {
					return badge > 99 ? '99+' : badge.toString();
				} else if (typeof badge === 'string') {
					return badge;
				}
				return '';
			},
		}
	}
</script>

<style>
	@charset "UTF-8";

	.segmented-control {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
		font-size: 28upx;
		box-sizing: border-box;
		margin: 0 auto;
		overflow: hidden;
		border: 1px solid;
		border-radius: 10upx
	}

	.segmented-control.text {
		border: 0;
		border-radius: 0
	}

	.segmented-control-item {
		flex: 1;
		text-align: center;
		line-height: 80upx;
		box-sizing: border-box;
		border-left: 1px solid;
		position: relative;
	}

	.segmented-control-item.active {
		color: #fff
	}

	.segmented-control-item.text {
		border-left: 0;
		color: #000
	}

	.segmented-control-item.text.active {
		border-bottom-style: solid
	}

	.segmented-control-item:first-child {
		border-left-width: 0
	}

	.badge-num {
		position: absolute;
		top: -26upx;
		right: 0upx;
	}
</style>