<template>
	<view class="visitor-register-page">
		<!-- 顶部来访类型展示 -->
		<view class="visitor-type-card">
			<view class="type-label">来访类型：</view>
			<view class="type-value">{{ visitorType === 'delivery' ? '外卖人员' : '普通访客' }}</view>
		</view>

		<!-- 到访信息展示 -->
		<view class="register-info" v-if="hasHistory">
			<view class="visit-date">
				<text class="date-text">到访日期</text>
				<text class="date-text">{{ currentTime }}</text>
			</view>
			<view class="visit-user">
				<text class="user-text">访客姓名：{{ form.visitorName }}</text>
				<text class="user-text">访客电话：{{ form.phone }}</text>
			</view>
		</view>

		<!-- 到访信息表单 -->
		<scroll-view class="form-container" scroll-y v-else>
			<!-- 访客信息 -->
			<view class="form-section">
				<!-- 访客姓名 -->
				<view class="form-item">
					<view class="item-label">
						<text class="required">*</text>访客姓名：
					</view>
					<input class="item-input" v-model="form.visitorName" placeholder="请输入来访人姓名" maxlength="20" />
				</view>

				<!-- 身份证 -->
				<view class="form-item">
					<view class="item-label">
						<text class="required">*</text>访客身份证：
					</view>
					<input class="item-input" v-model="form.idCard" placeholder="请输入来访人身份证" maxlength="18"
						@blur="validateIdCard" />
					<view v-if="idCardError" class="error-text">{{ idCardError }}</view>
				</view>

				<!-- 手机号 -->
				<view class="form-item">
					<view class="item-label">
						<text class="required">*</text>访客手机号：
					</view>
					<input class="item-input" v-model="form.phone" placeholder="请输入来访人手机号" type="number" maxlength="11"
						@blur="validatePhone" />
					<view v-if="phoneError" class="error-text">{{ phoneError }}</view>
				</view>
			</view>

			<!-- 业主信息 -->
			<view class="form-section">
				<!-- 业主小区 -->
				<view class="form-item">
					<view class="item-label">
						<text class="required">*</text>业主小区：
					</view>
					<picker class="item-picker" @change="onCommunityChange" :range="communityList" range-key="name"
						:value="communityIndex">
						<view class="picker-content">
							{{ form.communityName || '请选择小区' }}
						</view>
					</picker>
				</view>

				<!-- 业主房号，普通来访必填，外卖来访不显示 -->
				<view class="form-item" v-if="visitorType === 'normal'">
					<view class="item-label">
						<text class="required">*</text>业主房号：
					</view>
					<picker class="item-picker" @change="onRoomChange" :range="roomList" range-key="name"
						:value="roomIndex" :disabled="!form.communityId">
						<view class="picker-content" :class="{ disabled: !form.communityId }">
							{{ form.roomNumber || '请选择房号' }}
						</view>
					</picker>
				</view>

				<!-- 业主手机，普通来访必填，外卖来访不显示 -->
				<view class="form-item" v-if="visitorType === 'normal'">
					<view class="item-label">
						<text class="required">*</text>业主手机：
					</view>
					<input class="item-input" v-model="form.ownerPhone" placeholder="请填写业主手机号" type="number"
						maxlength="11" @blur="validateOwnerPhone" />
					<view v-if="ownerPhoneError" class="error-text">{{ ownerPhoneError }}</view>
				</view>
			</view>

			<!-- 提交按钮 -->
			<view class="submit-btn-container">
				<button class="submit-btn" :class="{ disabled: !canSubmit }" @click="handleSubmit"
					:disabled="!canSubmit">
					提交登记
				</button>
			</view>
		</scroll-view>


		<!-- 加载中提示 -->
		<view v-if="loading" class="loading-mask">
			<view class="loading-content">
				<image src="/static/images/load.gif" mode="aspectFit"></image>
				<text class="loading-text">加载中...</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 来访类型：delivery-外卖访客，normal-普通访客
				visitorType: 'normal',

				// 表单数据
				form: {
					visitorName: '', // 访客姓名
					idCard: '', // 访客身份证
					phone: '', // 访客手机
					communityId: '', // 小区ID
					communityName: '', // 小区名称
					roomId: '', // 业主房号ID
					roomNumber: '', // 业主房号名称
					ownerPhone: '' // 业主手机
				},

				// 错误信息
				idCardError: '',
				phoneError: '',
				ownerPhoneError: '',

				// 小区列表
				communityList: [{
						id: 1,
						name: '小区A'
					},
					{
						id: 2,
						name: '小区B'
					},
					{
						id: 3,
						name: '小区C'
					}
				],
				// 当前选中小区的索引
				communityIndex: -1,
				// 房间列表
				roomList: [],
				// 当前选中房间的索引
				roomIndex: -1,

				// 控制状态
				loading: false,
				// 是否有历史记录
				hasHistory: false,
				currentTime: '',
				// 小区ID
				villageId: ''
			};
		},

		computed: {
			// 是否可以提交
			canSubmit() {
				const {
					visitorName,
					idCard,
					phone
				} = this.form;
				const baseValid = visitorName && idCard && phone && !this.idCardError && !this.phoneError;

				if (this.visitorType === 'normal') {
					return baseValid &&
						this.form.communityId &&
						this.form.roomId &&
						this.form.ownerPhone &&
						!this.ownerPhoneError;
				}

				return baseValid;
			},
			hasHistoryData() {
				return !!uni.getStorageSync('visitorHistory');
			},
		},

		onLoad(options) {
			console.log('来访登记页面：', options)
			this.hasHistory = false;
			this.setCurrTime();
			/**
			 * 普通来访二维码：不传或 type=normal
			 * 外卖来访二维码：type=delivery
			 * 在 app.vue 中根据扫码参数用 reLaunch 跳转到此页面
			 * 携带参数如 ?type=delivery
			 */
			// 1. 解析扫码参数，判断来访类型
			this.parseScanParams(options);

			// 2. 检查是否有历史记录
			const hasValidHistory = this.checkHistory();

			// 3. 没有历史记录，获取openId登录。然后加载小区列表在页面手动录入
			if (!hasValidHistory) {
				this.getOpenId();
				// this.loadCommunityList();
			}
		},
		// 页面卸载时（返回或跳转）触发
		onUnload() {
			// 这里需要保证用户扫码进入访客页面，不能去其他页面
			// 只要返回 true 就能阻止页面卸载/跳转
			return true;
		},
		methods: {
			// 解析扫码参数
			parseScanParams(options) {
				// 根据二维码类型设置：外卖码传递type=delivery，普通码不传或type=normal
				this.visitorType = options.type || "normal";

				// 获取小区ID
				if (options.villageId) {
					this.villageId = options.villageId;
				}

				// 场景值解析（小程序码专用）
				if (options.scene) {
					const sceneParams = this.parseSceneParams(options.scene);
					if (sceneParams.type) {
						this.visitorType = sceneParams.type;
					}
					if (sceneParams.villageId) {
						this.villageId = sceneParams.villageId;
					}
				}
				console.log("来访类型:", this.visitorType);
			},
			// 解析场景值参数
			parseSceneParams(scene) {
				const params = {};
				try {
					// scene 格式可能是:villageId=123&type=delivery
					const decodedScene = decodeURIComponent(scene);
					const pairs = decodedScene.split("&");

					pairs.forEach((pair) => {
						const [key, value] = pair.split("=");
						if (key && value !== undefined) {
							params[key] = value;
						}
					});
				} catch (e) {
					console.error("解析场景值失败:", e);
				}
				return params;
			},

			// 获取openId
			async getOpenId() {
				const codeRes = await uni.login();
				const _this = this;
				_this.$api.getUserOpenid({
					code: codeRes[1].code
				}, res => {
					console.log('来访openId', res)
					if (res.code === 1) {
						// 请求小区列表数据
						_this.loadCommunityList()
					}
				})
			},

			// 检查历史记录
			checkHistory() {
				// 从本地存储获取访客历史记录
				const history = uni.getStorageSync('visitorHistory');
				// 无历史记录或记录无效
				if (!history || !history.idCard) {
					return false;
				}

				// 有历史记录，自动填充访客信息
				this.form.visitorName = history.visitorName || '';
				this.form.idCard = history.idCard || '';
				this.form.phone = history.phone || '';
				this.setCurrTime();
				this.hasHistory = true;

				return true;
			},

			// 设置当前时间
			setCurrTime() {
				const now = new Date();
				// 补零函数
				const pad = (num) => num.toString().padStart(2, '0');
				const year = now.getFullYear();
				const month = pad(now.getMonth() + 1);
				const day = pad(now.getDate());
				const hours = pad(now.getHours());
				const minutes = pad(now.getMinutes());
				const seconds = pad(now.getSeconds());
				this.currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
			},

			// 加载小区列表
			async loadCommunityList() {
				this.loading = true;
				try {
					// 调用API获取小区列表
					// const res = await this.$api.getCommunityList();
					// if (res.code === 1) {
					// 	this.communityList = res.data || [];
					// 	// 根据小区ID在列表中找到对应的索引并回显数据
					// 	const index = this.communityList.findIndex(item => item.id === this.villageId)
					// 	if (index !== -1) {
					// 		this.communityIndex = index
					// 		const community = this.communityList[index]
					// 		this.form.communityId = community.id
					// 		this.form.communityName = community.name
					// 	}
					// }
				} catch (error) {
					console.error('加载小区列表失败:', error);
					uni.showToast({
						title: '加载小区列表失败',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},

			// 小区选择变化
			onCommunityChange(e) {
				const index = e.detail.value; // 获取选中的索引
				const community = this.communityList[index];
				if (community) {
					this.communityIndex = index
					this.form.communityId = community.id;
					this.form.communityName = community.name;
					// 清除房间数据
					this.form.roomId = '';
					this.form.roomNumber = '';
					this.roomList = [];
					// 加载该小区的房号列表
					this.loadRoomList(community.id);
				}
			},

			// 加载房号列表
			async loadRoomList(communityId) {
				try {
					// 这里根据小区ID获取房号列表
					// const res = await this.$api.getRoomList({
					// 	communityId
					// });
					// if (res.code === 1) {
					// 	this.roomList = res.data || [];
					// }
				} catch (error) {
					console.error('加载房号列表失败:', error);
				}
			},

			// 房号选择变化
			onRoomChange(e) {
				const index = e.detail.value; // 获取选中的索引
				const room = this.roomList[index];
				if (room) {
					this.roomIndex = index;
					this.form.roomId = room.id;
					this.form.roomNumber = room.roomNumber;
				}
			},
			// 身份证验证
			validateIdCard() {
				const idCard = this.form.idCard.trim();
				if (!idCard) {
					this.idCardError = '请输入身份证号码';
					return;
				}
				// 简单格式验证
				const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if (!reg.test(idCard)) {
					this.idCardError = '身份证格式不正确';
					return;
				}
				this.idCardError = '';
			},

			// 手机号验证
			validatePhone() {
				const phone = this.form.phone.trim();
				if (!phone) {
					this.phoneError = '请输入手机号码';
					return;
				}
				const reg = /^1[3-9]\d{9}$/;
				if (!reg.test(phone)) {
					this.phoneError = '手机号格式不正确';
					return;
				}
				this.phoneError = '';
			},

			// 业主手机验证
			validateOwnerPhone() {
				const phone = this.form.ownerPhone.trim();
				if (!phone) {
					this.ownerPhoneError = '请输入业主手机号';
					return;
				}
				const reg = /^1[3-9]\d{9}$/;
				if (!reg.test(phone)) {
					this.ownerPhoneError = '手机号格式不正确';
					return;
				}
				this.ownerPhoneError = '';
			},

			// 提交登记
			async handleSubmit() {
				// uni.setStorageSync('visitorHistory', {
				// 	visitorName: '张三',
				// 	idCard: '510321634',
				// 	phone: '16589465465',
				// 	communityId: 1001,
				// 	communityName: 'cdshi',
				// 	lastVisitTime: Date.now()
				// });
				// this.hasHistory = true;
				// this.setCurrTime();
				if (!this.canSubmit) return;

				this.loading = true;
				try {
					// 构建提交数据
					const submitData = {
						visitorType: this.visitorType,
						...this.form,
						timestamp: Date.now()
					};

					// 调用提交API
					const res = await this.$api.submitVisitorRegister(submitData);

					if (res.code === 1) {
						uni.showToast({
							title: '登记成功',
							icon: 'success'
						});
						// 保存访客信息到本地历史记录
						this.saveVisitorHistory();
					} else {
						uni.showToast({
							title: res.msg || '提交失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('提交失败:', error);
					uni.showToast({
						title: '网络异常，请重试',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},

			// 保存访客历史记录
			saveVisitorHistory() {
				const history = {
					visitorName: this.form.visitorName,
					idCard: this.form.idCard,
					phone: this.form.phone,
					communityId: this.form.communityId,
					communityName: this.form.communityName,
					lastVisitTime: Date.now()
				};
				uni.setStorageSync('visitorHistory', history);
				this.setCurrTime();
				this.hasHistory = true;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.visitor-register-page {
		min-height: 100vh;
		background-color: #f5f5f5;
	}

	.visitor-type-card {
		background-color: #fff;
		color: #333;
		padding: 30upx 60upx;
		display: flex;
		box-sizing: border-box;

		.type-label {
			font-size: 28upx;
		}

		.type-value {
			font-size: 30upx;
		}
	}

	.form-container {
		// height: calc(100vh - 120upx);
		padding: 20upx 30upx 40upx;
		box-sizing: border-box;
	}

	.form-section {
		background: white;
		border-radius: 16upx;
		margin-bottom: 30upx;
		overflow: hidden;
	}

	.form-item {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		padding: 20upx 30upx;
		border-bottom: 1upx solid #f0f0f0;
		box-sizing: border-box;

		&:last-child {
			border-bottom: none;
		}

		.item-label {
			font-size: 28upx;
			color: #333;
			display: flex;
			align-items: center;

			.required {
				color: #FF3B30;
				margin-right: 8upx;
			}
		}

		.item-input {
			font-size: 28upx;
			height: 55upx;
			line-height: 55upx;
			background: #fafafa;
			flex: 1;
		}

		.item-picker {
			.picker-content {
				font-size: 29upx;
				color: #999;
			}
		}

		.error-text {
			color: #FF3B30;
			font-size: 22upx;
			margin-top: 10upx;
		}
	}

	.submit-btn-container {
		padding: 40upx 0;

		.submit-btn {
			color: #fff;
			background: linear-gradient(to bottom, #f99372, #ffbe84);
			font-size: 32upx;
			height: 90upx;
			line-height: 90upx;
			border-radius: 45upx;
			font-weight: 500;

			&.disabled {
				background: #CCCCCC;
				color: #999;
			}
		}
	}

	.register-info {
		padding: 20upx 30upx;
		box-sizing: border-box;

		.visit-date {
			width: 100%;
			height: 220upx;
			background-color: #fff;
			border-radius: 20upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 40upx;

			.date-text {
				font-size: 44upx;
				font-weight: bold;
				color: #333;
			}
		}

		.visit-user {
			padding: 30upx 30upx;
			box-sizing: border-box;
			background-color: #fff;
			display: flex;
			flex-direction: column;

			.user-text {
				font-size: 28upx;
				color: #333;
				height: 56upx;
				line-height: 56upx;
			}
		}
	}

	.loading-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;

		.loading-content {
			background: white;
			padding: 40upx 60upx;
			border-radius: 16upx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.loading-text {
				margin-top: 20upx;
				font-size: 28upx;
				color: #666;
			}
		}
	}
</style>