;var sqlData = [{"id":"7","srcinfoid":"101095978","title":"测试标题","des":"测试描述中心","url":"http://opinion.caixin.com/2017-05-30/101095978.html","imgurl":"/uploads/share_20170821163029.jpg","type":"2","device":"1","planform":"2","red":"0","topic":null,"channel":"1","media":"1","ditch":null,},]/*
	isApp return {
		1: 财新网ios1
		2: 财新网android
		3: wap
		4: 财新周刊ios
		5: 财新周刊android
	}
*/
var _ = {
	append: function(element, html) {
   	 	element.innerHTML += html;
    },
    isApp: function() {
    	if(_.isDevice() == 'iPhone' || _.isDevice() == 'iPad') {
    		if(_.getCookie('SA_USER_UNIT') == "1") {
    			return 1;
    		}
    		if(_.getCookie('SA_USER_UNIT') == "2") {
    			return 4;
    		}
    	}else if(_.isDevice() == 'Android') {
    		if(_.getCookie('SA_USER_UNIT') == "1") {
    			return 2
    		}
    		if(_.getCookie('SA_USER_UNIT') == "2") {
    			return 5;
    		}
    	}else {
    		return 3;
    	}
    },
    isDevice: function() {
    	if(_.getCookie('SA_USER_DEVICE_TYPE') == '1') {
    		return 'iPhone';
    	}
    	if(_.getCookie('SA_USER_DEVICE_TYPE') == '2') {
    		return 'Android';
    	}
    	if(_.getCookie('SA_USER_DEVICE_TYPE') == '3') {
    		return 'WAP';
    	}
    	if(_.getCookie('SA_USER_DEVICE_TYPE') == '4') {
    		return 'iPad';
    	}
    	if(_.getCookie('SA_USER_DEVICE_TYPE') == '5') {
    		return 'WEB';
    	}
    	if(_.getCookie('SA_USER_DEVICE_TYPE') == '6') {
    		return '微信';
    	}
    },
    getCookie: function(KEY) {
		var cookieArr = document.cookie.split(';');
		for (var i = 0; i < cookieArr.length; i++) {
			if(new RegExp('^ '+ KEY).test(cookieArr[i])) {
				return cookieArr[i].split('=')[1];
			}
		}
    },
    isNull: function(val) {
    	return val? val: '';
    }
};


var share = {
	init: function() {
		if(navigator.userAgent.match(/MicroMessenger/ig)){
	    	this.getWXConfig();
	    }
	    this.getResult();
	},
	getAppShare: function(opts) {
		var appShare = [
			'<div style="display:none" id="__cxnewsapp_sharetext">'+ _.isNull(opts.title) + '</div>',
			'<div style="display:none" id="__cxnewsapp_sharephotourl">'+ _.isNull(opts.imgurl) +'</div>',
			'<div style="display:none" id="__cxnewsapp_sharewxurl">'+ _.isNull(opts.url) +'</div>',
			'<div style="display:none" id="__cxnewsapp_sharewxthumburl">'+  _.isNull(opts.imgurl) +'</div>',
			'<div style="display:none" id="__cxnewsapp_sharewxtitle">'+ _.isNull(opts.des) + '</div>',
			'<div style="display:none" id="__cxnewsapp_sharewxtext">'+ _.isNull(opts.des) + '</div>'
		]
		if(_.isApp() != 3) {
			_.append(document.body, appShare.join(''))
		}
	},
	getWXConfig: function(){
			$.getJSON("https://api.caixin.com/wxsdk/wxconfig.php?url=" + encodeURIComponent(window.location.href) + "&callback=?",function(data){
		    wx.config({
		      debug: false,
		      appId: data.appId, 
		      timestamp: data.timestamp,
		      nonceStr: data.nonceStr,
		      signature: data.signature,
		      jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","startRecord","stopRecord","onVoiceRecordEnd","playVoice","pauseVoice","stopVoice","translateVoice","uploadVoice"]
		    });
	    });
	},
	shareResultObj: {
		imgurl:"http://file.caixin.com/file/weixin/cx_logo.jpg",
		title: document.getElementsByTagName('title')[0].innerHTML,
		des: '',
		url: window.location.href
	},
	getResult: function() {
		for (var i = 0; i < sqlData.length; i++) {
			if(entity) {
				if(entity.id && entity.id == sqlData[i].srcinfoid) {
						this.shareResultObj.imgurl = sqlData[i].imgurl;
						this.shareResultObj.title = sqlData[i].title;
						this.shareResultObj.des = sqlData[i].des;
						this.shareResultObj.url = sqlData[i].url;
                 break;
				}else {
					if(entity.category && entity.category.indexOf(sqlData[i].ditch) != '-1') {
						this.shareResultObj.imgurl = sqlData[i].imgurl;
						this.shareResultObj.title = sqlData[i].title;
						this.shareResultObj.des = sqlData[i].des;
						this.shareResultObj.url = sqlData[i].url;
                break;
					}else {
						if(entity.channel && entity.channel == sqlData[i].topic) {
							this.shareResultObj.imgurl = sqlData[i].imgurl;
							this.shareResultObj.title = sqlData[i].title;
							this.shareResultObj.des = sqlData[i].des;
							this.shareResultObj.url = sqlData[i].url;
                   break;
						}

					}
					
				}
			}
		}
		this.getAppShare(this.shareResultObj);
		this.defaultWx();
	},
	defaultWx: function() {
		console.log(share.shareResultObj)
		if(typeof(wx)!="undefined" && typeof(wx)!=null){
		    wx.ready(function(){
		      wx.onMenuShareTimeline({
		          title: share.shareResultObj.title, // 分享标题
		          link: share.shareResultObj.url, // 分享链接
		          imgUrl: share.shareResultObj.imgurl, // 分享图标
		          success: function () {
		          		 tongji();
		              // 用户确认分享后执行的回调函数
		               $(".share-pop-mask").show();
		          },
		          cancel: function () {
		              // 用户取消分享后执行的回调函数
		          }
		      });
		      wx.onMenuShareAppMessage({
		      	  title: share.shareResultObj.title, // 分享标题
		          link: share.shareResultObj.url, // 分享链接
		          imgUrl: share.shareResultObj.imgurl, // 分享图标
		          desc: share.shareResultObj.des, // 分享描述
		          type: '', // 分享类型,music、video或link，不填默认为link
		          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		          success: function () {
		 		          	tongji();
		              // 用户确认分享后执行的回调函数
		               $(".share-pop-mask").show();
		          },
		          cancel: function () {
		              // 用户取消分享后执行的回调函数
		          }
		      });
		      wx.onMenuShareQQ({
		          title: share.shareResultObj.title, // 分享标题
		          link: share.shareResultObj.url, // 分享链接
		          imgUrl: share.shareResultObj.imgurl, // 分享图标
		          desc: share.shareResultObj.des, // 分享描述
		          success: function () {
		          		tongji();
		             // 用户确认分享后执行的回调函数
		              $(".share-pop-mask").show();
		          },
		          cancel: function () {
		             // 用户取消分享后执行的回调函数
		          }
		      });
		      wx.onMenuShareWeibo({
		          title: share.shareResultObj.title, // 分享标题
		          link: share.shareResultObj.url, // 分享链接
		          imgUrl: share.shareResultObj.imgurl, // 分享图标
		          desc: share.shareResultObj.des, // 分享描述
		          success: function () {
		          	tongji();
		             // 用户确认分享后执行的回调函数
		              $(".share-pop-mask").show();
		          },
		          cancel: function () {
		              // 用户取消分享后执行的回调函数
		          }
		      });
		    });
		}
	}
}

share.init();