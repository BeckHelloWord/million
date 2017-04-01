/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/center/src/css.css");
    var sTpl = require("views/center/subscribe.html");
    var iPublic = require("components/public.js");
    var NotOpen = require("components/center/notOpen.js");//引入组件
    var SubList = require("components/center/subList.js");//引入组件
    var Cover = require("components/center/cover.js");//引入组件
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
        template: sTpl,
        // 列表
        components: {"notOpen":NotOpen,"subList":SubList},//实例化组件
        data:function() {
            return {
                subList:[],
                offset:10,
                showNum:0,
                selectId:""
            }
        },
        events: {//祖册组件事件

        },
        methods:{
            initData:function(){
                var _this=this

                API_GET({
                    url: "wd_api/member/getSuperSubScribeOrder",//获取我预约的理财师
                    data:{
                        offset:0,
                        max:10
                    },
                    success: function(response){
                        _this.subList=response.data
                        _this.showNum=response.data.length
                    }
                });
            },
            bindScroll:function(){
                var _this=this
                $(".subscribe").bind('scroll', function(){
                    if ($(".subscribe").scrollTop()+$(document).height()-90 >= $(".table_con").height()) {
                       if(_this.showNum>=10){
                           _this.getMore()
                       }
                    }
                });
            },
            getMore:function(){
                var _this=this
                API_GET({
                    url: "wd_api/member/getSuperSubScribeOrder",//获取我预约的理财师
                    data:{
                        offset:_this.offset,
                        max:10
                    },
                    success: function(response){
                        _this.offset+=10;
                        _this.subList=_this.subList.concat(response.data)
                        _this.showNum=response.data.length
                    }
                });
            },
            changeTab:function(e){
                var className=e.currentTarget.className
                var clickTab=e.currentTarget.dataset.tab;
                var selectedTab=$(".selected")[0].dataset.tab;
                var changeTab=clickTab-selectedTab
                if(changeTab==0){
                    return
                }
                $(".table_con").addClass("hidden");
                $("#tabList"+clickTab).removeClass("hidden");
                //self.changeTabData(clickTab);

                var news_select = window.document.getElementById("subscribe_select");
                var length = self.$("#subscribe_select").css("-webkit-transform");
                var winWidth=window.innerWidth*0.5
                winWidth=winWidth.toFixed(0);
                winWidth=parseInt(winWidth);
                length = length.substring(11, length.length - 3);
                length = parseInt(length);
                var changeLength=(winWidth*changeTab+length);
                news_select.style.webkitTransform = "translateX("+changeLength+"px)";
                news_select.style.MozTransform = "translateX("+changeLength+"px)";
                news_select.style.msTransform ="translateX("+changeLength+"px)";
                news_select.style.OTransform ="translateX("+changeLength+"px)";
                news_select.style.transform = "translateX("+changeLength+"px)";
                $(".selected").removeClass("selected");
                $("."+className).addClass("selected")
            }
        },
        created:function(){
            $(".news_tabs>div").on("click",this.changeTab)
            this.$root.setTitle('预约');
            this.initData()
        },
        ready:function(){
            this.bindScroll()
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;

        }

    });
    module.exports = index;
});

