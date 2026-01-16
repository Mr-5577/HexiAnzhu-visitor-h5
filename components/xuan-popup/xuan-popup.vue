<!-- 
 *属性 isdistance 每个弹窗之间是否有间距
 *数组形式传值
 *type,类型 success warn info err（string）
 *content,内容（string）
 *timeout,消失时间（Number）
 *isClick,是否点击消失（Boolean）
 -->
<template>
	<view class="popup_list">
		<view v-for="(items,index) of popup_list" :id="items.uuid" :key="items.uuid" >
			<view class="mpopup" :style="{ background: items.color ,top:index*distance+50+'px'}" :class="[items.animator,items.typeClass]" @click="remove_popup(index)">
				<view class="pic"><image class="icon" mode="aspectFit" :src="items.icon"></image></view>
				<text class="text" :style="{ color: items.colortext }">{{ items.content }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				popup_list:[],//弹窗数组
				distance:65//每个弹窗之间间距
			}
		},
		props:{
			//是否有间距
			isdistance:{
				type:Boolean,
				default:true
			}
		},
		methods:{
			init:function(list){
				if (list.type == 'success') {
					list.icon = './xuan-popup/success.png';
					list.typeClass='mpopup-success';
					return list;
				}
				if (list.type == 'warn') {
					list.icon = './xuan-popup/warn.png';
					list.typeClass='mpopup-warn';
					return list;
				}
				if (list.type == 'info') {
					list.icon = './xuan-popup/info.png';
					list.typeClass='mpopup-info';
					return list;
				}
				if (list.type == 'err') {
					list.icon = './static/xuan-popup/err.png';
					list.typeClass='mpopup-err';
					return list;
				}
			},
			open:function(list){
				if(!this.isdistance){this.distance=0}
				let uuid=this.guid();
				//初始化
				let new_list=this.init(list);	
				new_list.uuid=uuid;
				//添加进数组
				this.popup_list.push(new_list);
				if(typeof(new_list.isClick)!='boolean'){new_list.isClick=false;}
				//可消失
				if(!new_list.isClick){
					this.close(uuid,new_list.timeout);
				}
				
			},
			close:function(uuid,timeout){
				//退出动画之后，短暂延迟后移除本元素
				this.fade_out_animator(uuid,timeout).then(res=>{
					setTimeout(()=>{
						for(let i=0;i<this.popup_list.length;i++){
							if(this.popup_list[i].uuid==res){
								//移除本元素
								this.popup_list.splice(i,1);
								this.$forceUpdate()
							}
						}
					},250)
				});
			},
			fade_out_animator:function(uuid,timeout){
				//timeout秒后退出
				if(!timeout||typeof(timeout)!='number'){timeout=3000;}
				return new Promise(res=>{
					setTimeout(()=>{
						for(let i=0;i<this.popup_list.length;i++){
							if(this.popup_list[i].uuid==uuid){
								//添加退出动画
								this.popup_list[i].animator='fade_Top';
								res(uuid);
							}
						}
					},timeout)
				})
			},
			//可点击关闭的弹出框
			remove_popup:function(target){
				console.log(target)
				if(this.popup_list[target].isClick){
					this.popup_list[target].animator='fade_Top';
					setTimeout(()=>{
						this.popup_list.splice(target,1);
						this.$forceUpdate();
					},250)
				}
			},
			//生成uuid
			guid:function() {
			    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			        return v.toString(16);
			    });
			}
		}
	}
</script>

<style lang="scss">
	.mpopup{
		display: flex;
		flex-direction: row;
		text-align: center;
		justify-content: center;
		align-items: center;
		min-height: 45px;
		width: 300px;
		transition :all .5s;
		position: fixed;
		left: 0;
		right: 0;
		margin: 0 auto;
		border-radius: 5px;	
		.pic{
			display: flex;
			text-align: center;
			justify-content: center;
			width: 15px;
			height: 15px;
			margin: auto 20px auto 0;
			.icon{
				width: 100%;
				height: auto;
			}
		}
		.text{
			margin: auto 20px auto 0;
			width: 65%;
			font-size: 16px;
		}
	}
	.mpopup-success{
		background: #f0f9eb;
		border: 1px solid #e1f3d8;
		color: #67c23a;
	}
	.mpopup-err{
		background: #fef0f0;
		border: 1px solid #fde2e2;
		color: #f56c6c;
	}
	.mpopup-warn{
		background: #fdf6ec;
		border: 1px solid #faecd8;
		color: #e6a23c;
	}
	.mpopup-info{
		background: #edf2fc;
		border: 1px solid #ebeef5;
		color: #909399;
	}
	.fade_Down{
		animation: fadeInDown 0.6s both;
	}
	.fade_Top{
		animation: fadeInTop 0.5s forwards;
	}
	/*从上到下*/
	@keyframes fadeInDown
	{
	    from {
	        opacity: 0;
	        -webkit-transform: translate(0,-100px); 
	        transform: stranslate(0,-100px); 
	    }
	    to {
	        opacity:1;
	        -webkit-transform: translate(0,10px);
	        transform: stranslate(0,10px);
	    }
	}
	/*从下到上*/
	@keyframes fadeInTop
	{
	    from {
	        opacity:1;
	        -webkit-transform: translate(0,10px); 
	        transform: stranslate(0,10px);
	    }
	    to {
	
			opacity: 0;
			-webkit-transform: translate(0,-100px);
			transform: stranslate(0,-100px);
	    }
	}
</style>
