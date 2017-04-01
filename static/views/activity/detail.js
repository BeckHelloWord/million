/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/activity/src/css.css");
    var sTpl = require("views/activity/detail.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {

        },
        data:function(){
            return {
                id: this.$route.params.id,
                detail: [],
                comment: [],
                subscribeStatus: true,
                likeFlag:false,
                levelCode: true,
                persion: {},
                isJoin: true,
                superId: null
            }
        },
        methods:{
            getDetail:function(){// 获取详细信息 登录
                var that = this, data = {offlineActivityId: that.id},
                    url = "wd_api/offlineActivity/getOfflineActivityDetailsOn",   // 未登录获取活动详情
                    persion = JSON.parse(sessionStorage.getItem("persion"));

                that.persion = persion;

                if(iPublic.isLogin()){  // 登录之后
                    data.memberId = persion.memberId;
                    url = "wd_api/offlineActivity/getOfflineActivityDetails"; // 登录之后获取活动详情

                    if(persion.levelCode){
                        that.levelCode = false;
                    }else{
                        that.levelCode = true;
                    }
                }

                API_GET({
                    url: url,
                    data: data,
                    success: function (result) {
                        var list = result.data;

                        if(+list.isLike){
                            that.likeFlag = true;
                        }else{
                            that.likeFlag = false;
                        }

                        if(+list.isJoin){
                            that.isJoin = false;
                        }else{
                            that.isJoin = true;
                        }

                        if(list.activityStatus == "registration"){
                            list.btnName = "报名中";
                            that.subscribeStatus = true;
                        }else if(list.activityStatus == "registrationend"){
                            list.btnName = "进行中";
                            that.subscribeStatus = false;
                        }else if(list.activityStatus == "end"){
                            list.btnName = "已结束";
                            that.subscribeStatus = false;
                        }

                        if(list.activityImages){
                            list.activityImages = iPublic.publicArr.IMG_SERVER + list.activityImages;
                        }else{
                            list.activityImages = "static/src/detail-banner-default.png";
                        }

                        that.detail = list;
                        that.getSuperId();
                    }
                });
            },
            clickLike: function(e){  // 关注
                if(iPublic.isLogin()){
                    var obj = e.currentTarget;

                    if(obj.className.indexOf("active") > -1){
                        var that = this;

                        API_GET({
                            url:'wd_api/member/memberDeleteAttention',  // 取消关注
                            data:{attentionId: that.detail.attentionId},
                            success: function (result) {
                                if(result.isSuccess){
                                    $.modal({
                                        title: "已取消喜欢",
                                        text: result.message,
                                        buttons: [{
                                            text: "知道了"
                                        }],
                                        extraClass: "errTips"
                                    });

                                    that.detail.attentionCount -= 1;
                                    $(obj).removeClass("active");
                                }else{
                                    $.modal({
                                        title: "提示",
                                        text: result.message,
                                        buttons: [{
                                            text: "知道了"
                                        }],
                                        extraClass: "errTips"
                                    });
                                }
                            }
                        });
                    }else{
                        var that = this;

                        API_GET({
                            url:'wd_api/member/memberAttention',  // 关注
                            data:{bonus: that.id, typeCode:"offlineActivity"},
                            success: function (result) {
                                if(result.isSuccess){
                                    $.modal({
                                        title: "喜欢成功",
                                        text: result.message,
                                        buttons: [{
                                            text: "知道了",
                                            onClick: function(){
                                                that.getDetail();
                                            }
                                        }],
                                        extraClass: "errTips"
                                    });

                                    that.detail.attentionCount += 1;
                                    $(obj).addClass("active");
                                }else{
                                    $.modal({
                                        title: "提示",
                                        text: result.message,
                                        buttons: [{
                                            text: "知道了",
                                            onClick: function(){
                                                that.getDetail();
                                            }
                                        }],
                                        extraClass: "errTips"
                                    });
                                }
                            }
                        });
                    }
                }else{
                    this.$route.router.go("/login/index?redirect=/activity/detail/" + this.id);
                }

            },
            goAppointment: function(){ // 预约
                if(iPublic.isLogin()){
                    $(".layer-dialog").show();
                }else{
                    this.$route.router.go("/login/index?redirect=/activity/detail/" + this.id);
                }

            },
            cancelAppointment: function(){  // 取消预约
                $(".layer-dialog").hide();
            },
            sureAppointment: function(){  // 提交预约
                var that = this, reason = $(".reason").val();

                if(reason == ""){
                    $(".reason-msg").text("请输入邀请人姓名!").show();

                    setTimeout(function(){ $(".reason-msg").text("").hide(); }, 2000)
                }

                var data = {
                    memberId: that.persion.memberId,
                    offlineActivityId: that.id,
                    reason: reason
                };

                API_GET({
                    url:'wd_api/offlineActivity/offlineActivityApply',  // 提交预约接口
                    data: data,
                    success: function (result) {
                        $(".layer-dialog").hide();

                        if(result.message){
                            $.modal({
                                title: "提示",
                                text: result.message,
                                buttons: [],
                                extraClass: "errTips"
                            });
                        }else{
                            $.modal({
                                title: "提示",
                                text: "报名成功，记得准时参加哦",
                                buttons: [],
                                extraClass: "errTips"
                            });

                            that.isJoin = false;
                        }

                        setTimeout(function(){
                            $.closeModal();
                        }, 2000)
                    }
                });
            },
            getSuperId: function(){
                var that = this, data = {
                    memberId: that.superId
                };

                if(iPublic.isLogin()){
                    data.memberId = that.persion.memberId;
                }

                API_GET({
                    url: "wd_api/member/memberShareLinkOn",
                    data: data,
                    success: function(result){
                        that.superId = result.data.recommendId;
                        that.share();
                    }
                });
            },
            share: function(){
                var url = location.href;

                url = url.split("?")[0] + "?recommendCode=" + this.superId + "&source=offlineActivity";

                //数据加载完加载分享内容
                var shareData={
                    title: "[百万理财师]" + this.detail.activityName,
                    desc: "活动地址：" + this.detail.activityAddress + " 已报名人数：" + this.detail.subscribeCount,
                    link: url,
                    imgUrl: this.detail.activityImages
                };

                iPublic.share(shareData)
            },
            getQueryString: function(name){
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = null;

                if(window.location.href.split("?").length > 1){
                    r = window.location.href.split("?")[1].match(reg);
                }

                if(r != null){
                    return  unescape(r[2]);
                }else{
                    return null;
                }
            }
        },
        created:function(){
            var that = this;

            //设置返回键
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
            this.$root.bodyColor='gray noOver';

            //设置title
            this.$root.setTitle('详情');
        },
        ready:function(){
            this.getDetail();

            var recommendCode = this.getQueryString("recommendCode"),
                source = this.getQueryString("source");

            if(recommendCode){
                sessionStorage.setItem("recommendCode", recommendCode);
            }
            if(source){
                sessionStorage.setItem("source", source);
            }

        },
        route: {
            //微信分享  当有from参数时 微信分享报签名错误，而直接访问路径时分享没问题  因为只有一个分享页面 然后把分享页面做一次重定向
            activate: function (transition) {
                if(location.search.indexOf("singlemessage")>-1){
                    window.location=location.origin+"/"+location.hash
                }else{
                    transition.next()
                }
            }
        }
    });
    module.exports = index;
});

