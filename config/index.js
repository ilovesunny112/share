// 分享类型
	var list = {
		shareType : {
			1: '文章分享',
			2: '一线分享',
			3: '专题分享',
			4: '一线列表分享',
			5: '杂志分享',
			6: '外链分享',
			7: '作者个人页分享'
		},
		device : {
			1: '财新网APP(IOS/Android)',
			2: '财新网WAP',
			3: '财新周刊APP(IOS/Android)'
		},
		sharePlatform : {
			1: '微信朋友圈',
			2: '微信好友',
			3: 'QQ',
			4: '微博',
			5: '邮件',
			6: '其他'
		},
		shareMedia : {
			1: '周刊',
			2: '财经'
		},
		shareChannle : {
			1: '一线',
			2: '师姐说'
		},
		isShareRed : {
			0: '否',
			1: "是"
		}
	}

	if(typeof global == 'undefined') {
		for(var key in list) {
			window[key] = list[key]
		}
	}else {
		for(var key in list) {
			global[key] = list[key]
		}
		global.version = '1.0.0';
	}
	
// 接入端
// 分享平台
// 所属频道
// 所属栏目
// 媒体来源
// 渠道来源
// 是否红包分享


/*//埋点数据
var entry = {shareType:0,device:0,sharePlatform:0,isShareRed:0}

//服务的生成
var arr = [
	{
		shareType: 0,
		device: 0,
		sharePlatform: 0,
		isShareRed: 0

	}
]

//js调用
function share(entry, fn) {
	var dataTemp = {};
	for(var i = 0,len = arr.length; i < len; i++) {
		dataTemp = arr[i];
		if(entry.shareType == dataTemp.shareType) {
			fn(dataTemp)
		}
	}
}*/

















