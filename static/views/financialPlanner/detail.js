/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/financialPlanner/src/css.css");
    var sTpl = require("views/financialPlanner/detail.html");
    var iPublic = require("components/public.js");
    var ProductList = require("components/product/productList.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {
            "productList": ProductList
        },
        data:function(){
            return {
                detail: [],
                comment: [],
                showAboutMore: false,
                showComment: false,
                showCommentMore: false,
                aboutMaxHeight: 0,
                subscribeStatus:true,
                likeFlag:false,
                levelCode: true,
                product: [],
                showProduct: false,
                showProductMore: false,
                superId: null,
                persion: {}
            }
        },
        methods:{
            getId: function(){  // 获取id
               var id = this.$route.params.id;

                return id;
            },
            getDetail:function(id){// 获取详细信息 登录
                var that = this,
                    persion = JSON.parse(sessionStorage.getItem("persion"));

                if(persion.levelCode){
                    that.levelCode = false;
                }

                API_GET({
                    url:'wd_api/microstation/getMicroStationDetailBasic',
                    data:{superId: id},
                    success: function (result) {
                        that.detail = result.data;

                        if(!that.detail.superBackground){
                            that.detail.superBackground = "static/src/detail-banner-default.png";
                        }else{
                            that.detail.superBackground = iPublic.publicArr.IMG_SERVER + that.detail.superBackground;
                        }

                        setTimeout(function(){ that.aboutHe();that.getSuperId(); }, 0)
                    }
                });
            },
            getPeopleDetail: function(id){  // 获取详细信息 未登录
                var that = this;

                API_GET({
                    url:'wd_api/microstation/getMicroStationBasicOn',
                    data:{superId: id},
                    success: function (result) {
                        that.detail = result.data;

                        if(!that.detail.superBackground){
                            that.detail.superBackground = "static/src/detail-banner-default.png";
                        }else{
                            that.detail.superBackground = iPublic.publicArr.IMG_SERVER + that.detail.superBackground;
                        }

                        setTimeout(function(){ that.aboutHe();that.getSuperId(); }, 0)
                    }
                });
            },
            getProductList: function(){
                var that = this;

                API_GET({
                    url:'wd_api/microstation/getMicroStationListOn',
                    data:{superId: that.getId()},
                    success: function (result) {
                        that.product = result.data;

                        if(that.product.length > 0){
                            that.showProduct = true;
                        }
                        if(that.product.length > 3){
                            that.showProductMore = true;
                            that.product.length = 3;
                        }
                    }
                });
            },
            getComment: function(id){  // 获取评论信息
                var that = this;

                API_GET({
                    url:'wd_api/microstation/getMicroStationDiscussOn',
                    data:{superId: id},
                    success: function (result) {

                        var len = result.data.length;

                        if(len > 0){
                            that.showComment = true;
                        }

                        if(len > 2){
                            that.showCommentMore = true;
                        }

                        that.comment = result.data.slice(0, 2);

                        for(var i = 0, len = that.comment.length; i < len; i++){
                            that.comment[i].avatar = iPublic.commentImgUrl(that.comment.avatar);
                        }
                    }
                });
            },
            allComment: function(){  // 进入评论
                var id = this.getId();

                this.$route.router.go({ name: 'comment', params: { id: id }});
            },
            allProduct: function(){  // 进入这个理财师的产品列表
                var id = this.getId();

                this.$route.router.go({ name: 'super-product', params: { id: id }});
            },
            aboutHe: function(){  // 关于我们内容高度，是否显示查看更多
                var obj = $(".people-info .cont"), h = obj.height(), sh = 24 * 4;

                if(h > sh){
                    obj.css({height: sh});
                    this.showAboutMore = true;
                    this.aboutMaxHeight = h;
                }
            },
            showAboutInfo: function(e){ // 关于我们显示隐藏
                var obj = $(e.currentTarget),
                    h = this.aboutMaxHeight;

                if(obj.hasClass("active")){
                    obj.text("展开更多简介 >>").removeClass("active").siblings(".cont").css({height: "96px"});
                }else{
                    obj.text("收起简介 >>").addClass("active").siblings(".cont").css({height: h});
                }
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

                url = url.split("?")[0] + "?recommendCode=" + this.superId + "&source=super";

                //数据加载完加载分享内容
                var shareData={
                    title: "[百万理财师]" + this.detail.superName,
                    desc: "百万理财师:"+this.detail.oneWord,
                    link: url,
                    imgUrl: iPublic.publicArr.IMG_SERVER + this.detail.avatar
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
            },
            showCancel:function(e){
                $(e.currentTarget).css("left", -60);
            },
            closeCancel:function(e){
                $(e.currentTarget).css("left", 0);
            },
            productCancel: function(e){
                var that = this,
                    obj = $(e.currentTarget),
                    id = obj.attr("data-id"),
                    data = {
                        memberId: that.persion.memberId,
                        productId: id
                    };

                API_GET({
                    url: "wd_api/microstation/deleteMicroStationProduct", // 删除喜欢的东西
                    data: data,
                    success: function(result){
                        if(result.isSuccess){
                            $.toast("删除成功");

                            that.getProductList();
                        }else{
                            $.toast(result.message);
                        }
                    }
                });

                event.stopPropagation();
            }
        },
        created:function(){
            var that = this;

            //设置返回键
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
            this.$root.bodyColor='gray noOver';

            //设置title
            this.$root.setTitle('微站');
        },
        ready:function(){
            var id = this.getId();

            this.persion = JSON.parse(sessionStorage.getItem("persion"));

            if( iPublic.isLogin()){
                this.getDetail(id);
                //this.checkSubscribe()
            }else{
                this.getPeopleDetail(id);
            }
            this.getComment(id);
            this.getProductList();

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

