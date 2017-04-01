/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/product/src/css.css");
    var sTpl = require("views/product/detail.html");
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
                isBxProduct: false,
                likeFlag:false,
                levelCode: true,
                persion: {},
                isJoin: true,
                superId: null
            }
        },
        methods:{
            getDetail:function(){// 获取详细信息 登录
                var that = this, data = {productId: that.id},
                    url = "wd_api/product/getProductDetailsOn";   // 未登录获取产品详情

                if(iPublic.isLogin()){  // 登录之后
                    data.memberId = that.persion.memberId;
                    url = "wd_api/product/getProductDetails"; // 登录之后获取产品详情

                    if(that.persion.levelCode){
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

                        if(list.fileList){
                            for(var i = 0, len = list.fileList.length; i < len; i ++){
                                list.fileList[i].fileUrl = iPublic.publicArr.IMG_SERVER + list.fileList[i].fileUrl;
                            }
                        }

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

                        that.detail = list;
                        that.isBxProduct = list.isBxProduct;
                        that.getSuperId();
                    }
                });
            },
            tabCheck: function(ind){
                $(".detail-cont .hd span").eq(ind).addClass("on").siblings().removeClass("on");
                $(".detail-cont .bd").eq(ind).show().siblings(".bd").hide();
            },
            clickLike: function(e){  // 关注
                if(iPublic.isLogin()){
                    var obj = e.currentTarget;

                    if(obj.className.indexOf("active") > -1){
                        var that = this;

                        API_GET({
                            url:'wd_api/member/memberDeleteAttention',  // 取消关注
                            data:{attentionId:that.detail.attentionId},
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
                            data:{bonus: this.id, typeCode:"product"},
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
                    this.$route.router.go("/login/index?redirect=/product/detail/" + this.id);
                }

            },
            goAppointment: function(){ // 预约
                if(iPublic.isLogin()){
                    this.$route.router.go({ name: 'product-appointment', params: { id: this.id }});
                }else{
                    this.$route.router.go("/login/index?redirect=/product/detail/" + this.id);
                }

            },
            showShareMask: function(e){ // 显示分享遮罩层
                var ua = navigator.userAgent.toLowerCase();
                
                if (ua.indexOf('micromessenger/') != -1) {
                    //微信内运行
                    $(".shareMask").show();
                    
                    e.preventDefault();
                }
            },
            hideShareMask: function(){ // 隐藏分享遮罩层
                $(".shareMask").hide();
            },
            addMicroStation: function(){ // 理财师添加产品到微站
                var that = this,
                    data = {
                        productId: that.id,
                        memberId: that.persion.memberId
                    };

                API_GET({
                    url:'wd_api/product/addProductRecommend',
                    data: data,
                    success: function (result) {
                        if(result.isSuccess){
                            $.toast("添加成功");
                        }else{
                            $.toast(result.message);
                        }
                    }
                });
            },
            getRecommendCode: function(){
                var url = "wd_api/member/getInviteLinkOn",
                    data = {
                        recommendId: null
                    };

                if(iPublic.isLogin()){
                    url = "wd_api/member/getInviteLink";
                    data = {};
                }

                API_GET({
                    url: url,
                    data: data,
                    success: function (result) {
                        var link = result.data.inviteLink;

                        if(link){
                            link = link + "?redirect=https://m.bxjr.com/lc/invest/list.html";
                        }else{
                            link = "https://m.bxjr.com/lc/invest/list.html";
                        }


                        location.href = link;
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

                url = url.split("?")[0] + "?recommendCode=" + this.superId + "&source=product";
                //数据加载完加载分享内容
                var shareData={
                    title: "[百万理财师]" + this.detail.productName,
                    desc: "预期利率 " + this.detail.annualRevenue + " 起投金额 " + this.detail.investmentAmount + " 投资期限" + this.detail.productTerm,
                    link: url,
                    imgUrl: "http://100cfp.oss-cn-hangzhou.aliyuncs.com/upload/image/6b8bc32b-b1d9-43c6-9744-8b85f46999be.png"
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
            if(iPublic.isLogin()){  // 登录之后
                var persion = JSON.parse(sessionStorage.getItem("persion"));

                this.persion = persion;
            }

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

