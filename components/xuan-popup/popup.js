// <!-- 
//  *属性 isdistance 每个弹窗之间是否有间距
//  *数组形式传值
//  *type,类型 success warn info err（string）
//  *content,内容（string）
//  *timeout,消失时间（Number）
//  *isClick,是否点击消失（Boolean）
//  -->
export default{
	setPopup:function(type,content,timeout,isClick){
		if(!isClick)
			isClick=false;
		let list={
			type:type,
			content:content,
			animator:'fade_Down',
			isClick:isClick,
			timeout:timeout
		}
		return list;
	}
}