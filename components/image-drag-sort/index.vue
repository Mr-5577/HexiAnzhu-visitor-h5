<template>
	<view class="image-drag-sort">
		<view class="inner">
			<movable-area class="movable-area">
				<view
					class="item"
					v-for="(item, index) in lists"
					:key="index"
					@click="imageTap(index)"
					@longpress="longtap"
					@touchend="touchend"
					@touchmove.stop="touchm">
					<image
						class="img"
						:src="item"
						mode="aspectFill"></image>
				</view>
				<view
					class="img-upload-btn item"
					@click="imageUpload"
					v-if="lists.length < picNum && !active">
					<view class="icon">
						<image class="img" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNDggNDgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4IDQ4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0NDQ0NDQzt9Cgkuc3Qxe2ZpbGw6bm9uZTt9Cjwvc3R5bGU+Cjx0aXRsZT5SZWN0YW5nbGUtcGF0aDwvdGl0bGU+CjxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgo8cGF0aCBpZD0iU2hhcGUiIGNsYXNzPSJzdDAiIGQ9Ik0yNCwzLjNDMTIuNSwzLjMsMy4yLDEyLjYsMy4yLDI0UzEyLjUsNDQuNywyNCw0NC43UzQ0LjgsMzUuNCw0NC44LDI0UzM1LjUsMy4zLDI0LDMuM0wyNCwzLjN6CgkgTTM0LjUsMjYuMmgtOC4zdjguM2MwLDEuMi0xLDIuMi0yLjIsMi4yYy0xLjIsMC0yLjItMS0yLjItMi4ydi04LjNoLTguM2MtMS4yLDAtMi4yLTEtMi4yLTIuMnMxLTIuMiwyLjItMi4yaDguM3YtOC4zCgljMC0xLjIsMS0yLjIsMi4yLTIuMmMxLjIsMCwyLjIsMSwyLjIsMi4ydjguM2g4LjNjMS4yLDAsMi4yLDEsMi4yLDIuMlMzNS43LDI2LjIsMzQuNSwyNi4yeiIvPgo8cmVjdCBpZD0iUmVjdGFuZ2xlLXBhdGgiIHk9IjAiIGNsYXNzPSJzdDEiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIvPgo8L3N2Zz4K"></image>
					</view>
				</view>
				<movable-view
					class="movable-view"
					:x="x"
					:y="y"
					direction="all"
					damping="5000"
					friction="1"
					v-show="active">
					<view
						class="item-move"
						:class="{'item-move-active': active}">
							<image
								class="img"
								:src="lists[beginIndex]"
								mode="aspectFill"></image>
						</view>
				</movable-view>
			</movable-area>
		</view>
	</view>
</template>
<script>
	let wrapW = 0, // 拖拽范围的总宽度
		wrapH = 0, // 拖拽范围的总高度
		wrapW2 = 0, // 可拖拽区域宽度
		wrapH2 = 0, // 可拖拽区域高度
		wrapTop = 0, // 拖拽范围的上边界坐标
		wrapLeft = 0, // 拖拽范围的左边界坐标
		wrapDragTop = 0, // 可拖拽范围的上边界坐标
		wrapDragLeft = 0, // 可拖拽范围的左边界坐标
		itemW = 0, // 拖拽元素的宽
		itemH = 0, // 拖拽元素的高
		itemXNun = 0 // 拖拽元素的列数
	export default {
		name: 'image-drag-sort',
		data() {
			return {
				lists: this.list,
				active: false, // 是否拖拽状态
				flag: false, // 是否可拖拽
				x: 0,
				y: 0,
				beginIndex: null // 当前拖拽元素的索引
			}
		},
		props: {
			list: {
				type: Array,
				default: function () {
					return []
				}
			},
			picNum:{
				type:Number,
				default: 9
			}
		},
		mounted () {
			let l = this.lists.length
			if (l) { // 有图片时初始化
				this.init()
			}
		},
		methods: {
			init () { // 初始化数据
				// 设置拖拽区域信息
				let wrap = uni.createSelectorQuery().in(this).select('.inner')
				wrap.boundingClientRect(data => {
					// console.log(data)
					wrapW = data.width // 设置拖拽范围的总宽度
					wrapH = data.height // 设置拖拽范围的总高度
					wrapTop = data.top // 设置拖拽范围的上边界坐标
					wrapLeft = data.left // 设置拖拽范围的左边界坐标
					this.setNodeWH()
				}).exec()
			},
			setNodeWH () { // 设置拖拽元素的宽高
				// 获取拽拖元素的信息
				let item = uni.createSelectorQuery().in(this).select('.item')
				item.boundingClientRect(data => {
					// console.log(data)
					itemW = data.width // 拖拽元素的宽度
					itemH = data.height // 拖拽元素的高度
					this.setDragData()
				}).exec()
			},
			setDragData () { // 设置拖拽区域及元素配置
				wrapDragTop = wrapTop + itemH / 2 // 设置拖拽范围上边距
				wrapDragLeft = wrapLeft + itemW / 2 // 设置可拖拽范围左边距
				wrapW2 = wrapW - itemW // 设置可拖拽区域宽度
				wrapH2 = wrapH - itemH // 设置可拖拽区域高度
				itemXNun = Math.round(wrapW / itemW) - 1 // 设置拖拽元素的列数
			},
			longtap (e) { // 长按
				const left = e.currentTarget.offsetLeft,
					top = e.currentTarget.offsetTop
				this.beginIndex = this.computationIndex({left: left, top: top}) // 获取所在位置索引
				this.x = left
				this.y = top
				this.active = true
				this.flag = true
			},
			computationIndex (e) { // 计算元素索引
				const left = e.left,
					top = e.top
				let index = 0, // 计算拖拽元素所在的索引位置
					x = Math.round(left / itemW), // 计算拖拽元素所在的横向索引位置
					y = Math.round(top / itemH), // 计算拖拽元素所在的纵向索引位置
					num = itemXNun * y
				if (x && !y) { // 第一行
					index = x
				}
				if (y) { // 第一行以下
					index = x + y + num
				}
				return index
			},
			touchm (e) { // 拖拽过程
				if (this.flag) {
					let x = e.touches[0].pageX - wrapDragLeft,
						y = e.touches[0].pageY - wrapDragTop
					if (x < 0) {
						x = 0
					}
					if (x > wrapW2) {
						x = wrapW2
					}
					if (y < 0) {
						y = 0
					}
					if (y > wrapH2) {
						y = wrapH2
					}
					this.x = x
					this.y = y
				}
			},
			touchend (e) { // 拖拽结束
				this.active = false
				const left = e.currentTarget.offsetLeft,
					top = e.currentTarget.offsetTop
				if (!this.flag || this.x === left && this.y === top) {
					return
				}
				const	x = this.x, // 计算拖拽横向距离
					y = this.y, // 计算拖拽纵向距离
					itemNum = this.lists.length - 1 // 拖拽元素的总数量
				let endIndex = this.computationIndex({left: x, top: y}) // 获取所在位置索引
				if (endIndex > itemNum) {
					endIndex = itemNum
				}
				// 交换位置
				const beginIndex = this.beginIndex // 当前拖拽元素索引
				let data = this.lists,
					tem = data[beginIndex]
				data[beginIndex] = data[endIndex]
				data[endIndex] = tem
				this.flag = false
			},
			imageTap (i) { // 图片点击事件
				uni.showActionSheet({
					itemList: ['全屏预览大图', '删除（不可撤销）'],
					success: res => {
						if (res.tapIndex) { // 删除
							this.imageDel(i)
						} else { // 预览
							this.previewImage(i)
						}
					}
				})
			},
			previewImage (i) { // 预览图片
				uni.previewImage({
					current: this.lists[i],
          urls: this.lists
        })
			},
			imageDel (i) { // 删除图片事件
				this.lists.splice(i, 1);
				this.$emit('imageUpload',this.lists);
			},
			imageUpload () {
				let itemList = ['图片（从手机相册选择）', '图片（拍摄）']
				uni.showActionSheet({
					itemList: itemList,
					success: res => {
						this.chooseImage(res.tapIndex);
					}
				})
			},
			chooseImage (index) { // 选择图片
				const count = this.picNum - this.lists.length,
					sourceType = index > 0 ? 'camera' : 'album'
				uni.chooseImage({
					count: count,
					sizeType: ['original', 'compressed'],
					sourceType: [sourceType],
					success: res => {
						uni.showLoading({
							title: '上传中'
						})
						this.upload(res.tempFilePaths)
					}
				})
			},
			upload (e) { // 可多图上传，不需要的可改成单一上传
				uni.hideLoading()
				let data = this.lists
				for (let i = 0, l = e.length; i < l; i++) {
					data.push(e[i])
				}
				this.lists = data;
				this.$emit('imageUpload',this.lists);
				// 可写上传图片方法或者将本地图片路径传给父组件
			}
		},
		watch: {
			lists () { // 监听数组变化
				let l = this.lists.length
				if (l) { // 有图片或图片数量改变时重新初始化
					this.init()
				}
			}
		}
	}
</script>

<style scoped>
	.img {
		width: 100%;
		height: 100%;
	}

	.image-drag-sort {
		width: 100%;
		padding: 30upx;
		box-sizing: border-box;
	}

	.movable-area {
		width: 100%;
		height: auto;
		display: flex;
		flex-flow: wrap;
	}
	
	.item {
		flex: 0 0 31%;
		height: calc(31vw * .7);
		overflow: hidden;
		border-radius: 12upx;
	}
	
	.item:not(:nth-child(3n + 3)) {
		margin-right: 3.4%;
	}
	
	.item:nth-child(n + 4) {
		margin-top: 3.4%;
	}
	
	.img-upload-btn {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #F5F5F5;
	}
	
	.img-upload-btn .icon {
		width: 48upx;
		height: 48upx;
	}
	
	.img-upload-btn .text {
		font-size: 28upx;
		color: #CCCCCC;
		margin-top: 10upx;
	}
	
	.movable-view {
		width: 31%;
		height: calc(31vw * .7);
	}

	.item-move {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 12upx;
	}
	
	.item-move-active {
		box-shadow: 0 0 30px #000;
	}
	
	.prompt {
		font-size: 28upx;
		line-height: 40upx;
		color: #999;
		margin-top: 28upx;
	}
</style>
