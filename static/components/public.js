/**
 * Created by T'ingHsi on 2016/6/23.
 */
define(function (require,exports,module) {
    require("components/md5.js");
	var wx=require("//res.wx.qq.com/open/js/jweixin-1.0.0.js");
	var publicArr = {
		'SERVER_ADDRESS' : 'http://m.100cfp.com/',  // 服务器地址
		'IMG_SERVER':"http://100cfp.oss-cn-hangzhou.aliyuncs.com/",  // 图片服务器，test为测试服务器地址
		'rejump' : 'customers',
		'debug' : false
	};
	
	exports.publicArr = publicArr;

	var Auth = {
		get: function () {
			var result = {};
			try{
				//result = JSON.parse(localStorage['persion']);
				result = sessionStorage['persion'] && JSON.parse(sessionStorage['persion']);
			}catch(r){}
			if("object" === typeof result){
				return result['accessToken'];
			}
			return 0;
		},
		set: function (_user) {
			try{
				//localStorage['persion'] = JSON.stringify(_user);
				//DOTO! 使用此方法需要解决切换用户后第一次访问的问题(立即token覆盖问题)
				sessionStorage['persion'] = JSON.stringify(_user);
			}catch(r){ }
		},
		remove: function () {
			try{
				//localStorage.removeItem('persion');
				sessionStorage.removeItem('persion');
			}catch(r){ }
		}
	};
	exports.Auth = Auth;
	
	
	var pagedata = {
		busy : false, //ajax请求中
		max : 10
	}
	exports.pagedata = pagedata;
	
	/*
		//客户详情
		customer : {
			info : {isSuccess:false, message:'加载中...',data:{realName:'',mobile:'',availableMoney:'',waitingReceiptAllMoney:''}},
			list : {isSuccess:false, message:'加载中...',data:[]}
		}
	*/
	
	var API_GET = function(config){
		var data = config['data'] || {};
		config['success'] = config['success'] || function(){};
		var cache = {url: config['url'].replace(/\//g, ''),data:JSON.stringify(data).replace(/(\:)|(\")|(\,)|(\{)|(\})/g,'')};
		//if(typeof publicArr[cache['url']] == 'undefined'){ publicArr[cache['url']] = {}; }
		//if(typeof publicArr[cache['url']][cache['data']] != 'undefined'){
		//	config['success'](JSON.parse(publicArr[cache['url']][cache['data']]));
		//	return;
		//}
		config['fail'] = function(response){
			//console.log(response);
			if(/重新登录/.test(response.message)){
				Auth.remove();
			}
		};

		config['error'] = config['error'] || function(xhr, type){
			if(publicArr.debug){
				//alert('访问接口时发生意外错误：\r\n接口地址: ' + config.url + '\r\n请将此错误截图，反馈给工作人员谢谢！');
				//解决本地nginx静态文件无法POST问题
				$.get(publicArr['SERVER_ADDRESS'] + config['url'],function(response){ config['success'](response); },'json');
			}
		};

		var _config = {
			'API_KEY' : Auth.get(), //不可为null
			'SECRET' : 'UYGGYG876T6759HUHI975T7GGKJO9786456EDC08'
		};
		
		var param = function(obj) {
			//console.log(_config);
			var newobj = { 'api_key' : _config['API_KEY'], 'ct' : 1, 'bt' : 2 },
				tmparr = ['api_key', 'ct', 'bt'],
				query = [], name, value, subName, querytext;

			for(name in obj) {
				tmparr.push(name);
				newobj[name] = obj[name]; //复制一个新的obj,为了不影响原有formData数据
			}
			tmparr.sort();

			for(var i = 0, len = tmparr.length; i < len; i++) {
				name = tmparr[i];
				value = newobj[name];
				if(value instanceof Array) {
					value = value.join(',');
				}else if(value instanceof Object) { //解决 select BUG
					for(subName in value) {
						value = value[subName];
						break;
					}
				}
				if(value !== undefined && value !== null){
					query.push(name + '=' + value);
					//query.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
				}
			}
			querytext = _config['SECRET'] + query.join('').split('=').join('');
			return query.join('&') + '&sign=' + MD5(querytext).toUpperCase();
		};
		
		$.ajax({
			type: 'POST',
			url: publicArr['SERVER_ADDRESS'] + config['url'],
			data: (String(data) == '[object Object]' ? param(data) : data),
			dataType: 'json',
			success: function(response){
				if(response.data == null){ response.data = []; }
				//publicArr[cache['url']][cache['data']] = JSON.stringify(response);
				config['success'](response);
				/*
				if(publicArr.debug && _config.API_KEY == 0 && publicArr.path=='customers'){
					var str=prompt('是否需要改改？','');
					if(str){ setToken(str); }
				}
				*/
				if(response.isSuccess == false){
					if(response.status=='301'){
						$.alert(response.message)
						location.href="/#!/login/index"
					}

					config['fail'](response);
				//	alert('访问接口时发生意外错误：\r\n接口地址: ' + config.url + '\r\n错误信息：' + response.message);
				}
			},
			error: config['error']
		});

	};
	exports.API_GET = API_GET;
	
	var getlist = function (arr) {
			var VueExports = arr || publicArr.me;
			var postData = pagedata[publicArr.path];
			API_GET({
				url : postData.url,
				data : {offset:postData.offset, max:pagedata.max},
				success : function(result){
					/*
					if(publicArr.debug && top_nav.shownav == false){
						alert(JSON.stringify(result));
					}
					*/
					if(pagedata[publicArr.path].data == result.data){ return; } //重复请求
					//postData.totalCount = result.totalCount || 1000; //同步总记录数
					
					//隐藏继续加载按钮
					//总数量 > 已经加载的数量
					//if(result.totalCount > pagedata[publicArr.path]['offset']){
					//当前取到的数量 小于 要取的数量
					if(result.data.length < pagedata.max){
						pagedata[publicArr.path]['stillMore'] = false;
					}else{
						pagedata[publicArr.path]['stillMore'] = true;
					}
					
					
					if(result.data.length == 0){ //如果没有记录
						result.data = []; //解决数据为null，遍历失败的问题
						pagedata[publicArr.path]['stillMore'] = false; //无数据，去除加载更多按钮
					}else{
						//设置下次请求的 开始值
						pagedata[publicArr.path]['offset'] += result.data.length;
					}
					
					//var newData = pagedata[publicArr.path].data.concat(result.data);
					pagedata[publicArr.path].data = result.data;
					
					var newData = VueExports.list.data.concat(result.data);
					result.data = newData;
					
					VueExports.list = result;
					
					
					

					//解除ajax请求锁
					pagedata.busy = false;
					
				}
			});

		};
	//pagedata['loadMore'] = function(arr) {
	var loadMore = function(arr) {
		var VueExports = arr || publicArr.me;
		//pagedata.arr = arr;
		//下拉刷新记载更多
		var postData = pagedata[publicArr.path];
		var totalCount = postData['totalCount'], //总记录数
			offset = postData['offset']; //起始记录数

		//已经获得总数量 && 将要开始取的数量 == 总数量  Mark: 应该用 == 为了容错所以用 <=
		if(totalCount !== false && totalCount <= offset){
			pagedata[publicArr.path]['stillMore'] = false;
			return;
		}
		
		//尚未发起过请求(未取得总数量) || 将要开始取的数量 < 总数量
		if(totalCount === false || offset < totalCount){
			//防止重复触发ajax请求
			if(pagedata.busy){ return false; }
			//开启ajax请求锁
			pagedata.busy = true;
			//开始请求
			getlist(VueExports);
		}
		
	}
	exports.loadMore =  loadMore;

	var isLogin=function(){
		var index2 = Vue.extend({})
		var persion=sessionStorage.getItem("persion")
		if(persion){
			return true
		}else{
			return false
		}
	}
	exports.isLogin =  isLogin;
	//图片url处理
	var imgUrl=function(url){
		if(url){
			return publicArr.IMG_SERVER+url
		}else{
			return "static/src/default_portrait.png"
		}

	}
	exports.imgUrl =  imgUrl;

	// 图片url处理 - 评论默认头像
	var commentImgUrl = function(url){
		if(url){
			return publicArr.IMG_SERVER+url
		}else{
			return "static/src/comment-head.png"
		}

	}
	exports.commentImgUrl =  commentImgUrl;

	//分享默认
	var shareDefault=function(){
		var wechatShare=new WeChatShare();
		var shareData ={
			shareConfig:{
				title: "百万理财师",
				desc: "百万理财师",
				link: location.href,
				imgUrl: "http://m.100cfp.com/static/src/head-default.png"
			},
			menuList:{
				menuList: [
					'menuItem:readMode', // 阅读模式
					'menuItem:share:timeline', // 分享到朋友圈
					'menuItem:copyUrl', // 复制链接
					'menuItem:share:appMessage'
				]
			},
			callback:function(){

			}
		}
		wechatShare.init(shareData);
	}
	exports.shareDefault =  shareDefault;

	//分享理财师
	var share=function(shareConfig){
		var wechatShare=new WeChatShare();
		var shareData ={
			shareConfig:shareConfig,
			menuList:{
				menuList: [
					'menuItem:readMode', // 阅读模式
					'menuItem:share:timeline', // 分享到朋友圈
					'menuItem:copyUrl', // 复制链接
					'menuItem:share:appMessage',
                    'menuItem:openWithSafari'
				]
			},
			callback:function(){
			}
		}
		wechatShare.init(shareData);
	}
	exports.share =  share;

	$(window).on('scroll',function() {
		var raw = $("a.page_button[when-visibled]")
		if(raw.length == 1){ //加载按钮有且只有一个时执行
			raw.each(function(){
				if(pagedata[publicArr.path]['stillMore'] == false){ return; }
				var me = $(this);
				var meTop = me.offset().top,
					scrollTop = $("body").scrollTop(),
					windowHeight = $(window).height();
				
				//alert((scrollTop + windowHeight * 1.5) + ' loadNextPage ' + meTop + ' = ' + (scrollTop + windowHeight * 1.5 >= meTop));
				//窗口卷出距离 + 窗口高度 * 1.5 >= 元素距离顶部的距离
				if ((scrollTop + windowHeight * 1.8 >= meTop)) {
					pagedata[publicArr.path]['stillMore'] = false;
					eval(this.getAttribute("when-visibled")+"()");
					//[this.getAttribute("when-visibled")](pagedata.arr);
				}
				
			});
		}
	});
	
	if(publicArr.debug && !/.com/.test(location.host) && Auth.get() == 0){
		setTimeout(function(){
			var str1=prompt('请输入用户名','');
			var str2=prompt('请输入密码','');
			if(str1 && str2){
				API_GET({
					url : 'wd_api/userCenter/loginOn',
					data : { username : str1, password : str2 },
					success : function(result){
						if (result.isSuccess) {
							Auth.set(result.data);
							//page.setType('customers');
						}else{
							alert(result.message);
						}
					}
				});
			}
		},0);
	}
	if(publicArr.debug){ window.onerror = function(){ alert(JSON.stringify(arguments)); }; }
	
	window.setToken = function(accessToken){
		Auth.set({"accessToken": accessToken});
		/*
		if(publicArr.path === '/view/:id'){
			publicArr.me.getCustomer(publicArr.me.$route.params.id);
		}else{
			loadMore(publicArr.me);
		}
		*/
	}


	window.baoxiangAppCallback=function(response){
		WeChatShare.callback(response);
	}

	Object.extend = function(destination, source) {
		for (var property in source) {
			destination[property] = source[property];
		}
		return destination;
	}

	function WeChatShare() {}
	WeChatShare.prototype.init = function(shareData) {

		Object.extend(WeChatShare.shareData, shareData.shareConfig || {});
		var ua = navigator.userAgent.toLowerCase();
		WeChatShare.callback=typeof shareData.callback=="function"?shareData.callback:function(){}
		if(navigator.standalone == true){
			WeChatShare.appShare()
		}else if(ua.indexOf('baoxiang') != -1){
			WeChatShare.appShare()
		}else if(ua.indexOf('micromessenger/') != -1){
			//微信内运行
			loadjs('//res.wx.qq.com/open/js/jweixin-1.0.0.js',this.share,shareData)
			//alert(shareData.shareConfig.title+"22"+shareData.shareConfig.desc+"  "+shareData.shareConfig.imgUrl)
			//this.share(shareData)
		}
	}
	var loadjs=function(src,func,shareData)
	{
		if(typeof func != 'function')
		{
			console.log('param 2 is not a function!!') ;
			return false ;
		}
		//判断这个js文件存在直接执行回调
		var scripts = document.getElementsByTagName('script') ;
		for(i in scripts)
			if(scripts[i].src == src)
				return func(shareData) ;

		var script = document.createElement('script') ;
		script.type ='text/javascript' ;
		script.src = src ;
		var head = document.getElementsByTagName('head').item(0);
		head.appendChild(script);
		script.onload = function(){
			func(shareData);
		}
	}
	WeChatShare.appShare=function(){
		window.location="baoxiangShare://share?title="+WeChatShare.shareData.title+"&desc="+WeChatShare.shareData.desc+"&link="+WeChatShare.shareData.link+"&imgUrl="+WeChatShare.shareData.imgUrl
	}

	WeChatShare.prototype.share=function(shareData){
		API_GET({
			url: "wd_api/wechat/getShareSignOn",
			data: {url: location.origin+"/"},
			success: function (data) {
				// 微信分享事件监听
				//alert("appId：" + data.data.appId + " timestamp：" + data.data.timestamp + " nonceStr：" + data.data.nonceStr + " signature：" +  data.data.signature)
				wx.config({
					debug: false,
					appId: data.data.appId, // 公众号的唯一标识
					timestamp: data.data.timestamp, // 生成签名的时间戳
					nonceStr: data.data.nonceStr, // 生成签名的随机串
					signature: data.data.signature, // 签名
					jsApiList: [
						'checkJsApi',
						'onMenuShareTimeline',
						'onMenuShareAppMessage',
						'onMenuShareQQ',
						'onMenuShareWeibo',
						'showMenuItems',
						'hideOptionMenu'
					]
				});

				wx.ready(function () {
					//全部屏蔽掉
					//alert(shareData.shareConfig.title+"  "+shareData.shareConfig.desc+"  "+shareData.shareConfig.imgUrl);

					if(shareData.menuList){
						wx.hideOptionMenu()
						wx.showMenuItems(shareData.menuList);
					}else{
						wx.hideOptionMenu()
					}
					//WeChatShare.shareData.success= function () {
					//	//App.showToast("分享成功!")
					//	WeChatShare.callback();
					//}
					//wx.checkJsApi({
					//	jsApiList: [
					//		'onMenuShareTimeline',
					//		'onMenuShareAppMessage',
					//		'onMenuShareQQ',
					//		'onMenuShareWeibo'
					//	]
					//});
					//分享到朋友圈
					wx.onMenuShareTimeline(shareData.shareConfig);
					//分享到微信好友
					wx.onMenuShareAppMessage(shareData.shareConfig);
					wx.onMenuShareQQ(shareData.shareConfig);
				});
			}
		});

	}


//默认分享内容
	var share_desc = '百万理财师';

	try{
		share_desc = document.querySelector('meta[name="description"]').getAttribute('content');  // by Hsi 20160903 0:22
	}catch(r){
		//退级使用
		var meta = document.getElementsByTagName('meta');
		for(i in meta){
			if(typeof meta[i].name!="undefined"&&meta[i].name.toLowerCase()=="description"){
				share_desc = meta[i].content;
			}
		}
	}


	WeChatShare.shareData = {//默认值
		title: document.title?document.title:"百万理财师",
		desc: share_desc,
		link: location.href,
		imgUrl: "http://m.bawsun.com/topic/201601/newYear/images/logo.jpg"
	};

});
