/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/center/src/css.css");
    var sTpl = require("views/center/index.html");
    var iPublic = require("components/public.js");
    var CenterMenu = require("components/center/centerMenu.js");//引入组件
    var Cover = require("components/center/cover.js");//引入组件
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {"centerMenu":CenterMenu,"cover":Cover},//实例化组件
        data:function() {
            return {
                menuList:[],
                msgNum:0,
                nickname:"",
                levelCode:"",
                superBackground:"",
                persion: {},
                applyStatus: false
            }
        },
        methods:{
            notOpen:function(){
                this.$broadcast("showCover")
            },
            toMsg:function(){
                this.$route.router.go('/center/message')
            },
            toAbout:function(){
                this.$route.router.go('/center/about')
            },
            //toSubscribe:function(){
            //    this.$route.router.go({ name: 'subscribe', params: { "superId": 123,"abc":222}})
            //    //this.$route.router.go('/subscribe')
            //},
            toAttention:function(){
                this.$route.router.go('/center/attention')
            },
            toWeiZhan:function(){
                this.$route.router.go({ name: 'detail', params: { id: this.persion.memberId }});
                //this.$broadcast("showCover","暂未开放","微信端暂未开放，请到App查看")
            },
            toCustomer: function(){
                this.$route.router.go('/center/customer')
            },
            callPhone:function(){
                $("#callPhone").trigger('click');
            },
            toReset:function(){
                this.$route.router.go('/login/update')
            },
            goAuth: function(){
                if(this.applyStatus){
                    return false;
                }

                this.$route.router.go('/center/auth');
            },
            logout: function(){
                iPublic.Auth.remove();

                this.$route.router.go('/financialPlanner');
            },
            initData:function(){
                var _this=this;

                API_GET({
                    url: "wd_api/member/getMemberBasic",//个人中心用户基本信息接口
                    success: function(result){
                        if(result.isSuccess){
                            if(result){
                                _this.nickname=result.data.nickname
                            }else{
                                _this.nickname=result.data.memberName
                            }

                            if(result.data.applyStatus){
                                _this.applyStatus = true;
                            }

                            if(result.data.levelCode){
                                _this.persion.levelCode = result.data.levelCode;
                            }

                            _this.superBackground=iPublic.publicArr.IMG_SERVER + result.data.superBackground;

                            if(_this.persion.levelCode){
                                _this.menuList=[
                                    [
                                        {name:"news",desc:"消息","new":this.msgNum,"icon":"icon_message","func":_this.toMsg}
                                    ],
                                    [
                                        {name:"news",desc:"微站","icon":"icon_wei","func": _this.toWeiZhan}
                                    ],
                                    [
                                        //{name:"news",desc:"预约","icon":"icon_subscribe","func":_this.toWeiZhan},
                                        //{name:"news",desc:"粉丝","icon":"icon_like","func":_this.toWeiZhan},
                                        {name:"news",desc:"客户","icon":"icon_kehu","func":_this.toCustomer}
                                    ],
                                    [
                                        {name:"news",desc:"关于我们","icon":"icon_about","func":_this.toAbout},
                                        {name:"news",desc:"修改密码","icon":"icon_reset","func":_this.toReset},
                                    ]
                                ]
                            }else {
                                _this.menuList=[
                                    [
                                        {name:"news",desc:"消息","new":this.msgNum,"icon":"icon_message","func":_this.toMsg}
                                    ],
                                    [
                                        //{name:"news",desc:"预约","icon":"icon_subscribe","func":_this.toSubscribe},
                                        {name:"news",desc:"关注","icon":"icon_like","func":_this.toAttention}
                                    ],
                                    [
                                        //{name:"news",desc:"理财师认证","applyStatus": result.data.applyStatus,"icon":"icon_check","func":_this.goAuth}
                                        {name:"news",desc:"理财师认证","icon":"icon_check","func":_this.notOpen}
                                    ],
                                    [
                                        {name:"news",desc:"关于我们","icon":"icon_about","func":_this.toAbout},
                                        {name:"news",desc:"修改密码","icon":"icon_reset","func":_this.toReset},
                                    ]
                                ]
                            }
                        }else{
                            $.toast(result.message)
                        }

                    }
                });
                API_GET({
                    url: "wd_api/userCenter/getUserMessageCount",//返回用户消息件数
                    data:{
                        isRead:false
                    },
                    success: function(result){
                        _this.msgNum=result.noticeCount
                    }
                });
            }
        },

        created:function(){
            this.$root.setTitle('我');
            this.$root.$children[0].showgoback = false;
            this.$root.$children[1].showfooter = true;
        },
        ready:function(){
            var form = sessionStorage.getItem("fromCenter");

            if(iPublic.isLogin()){
                this.persion = JSON.parse(sessionStorage.getItem("persion"));
                this.initData();

                sessionStorage.removeItem("fromCenter");
            }else{
                this.$route.router.go('/login/index?redirect=center');

                if(form){
                    this.$route.router.go('/financialPlanner');

                    sessionStorage.removeItem("fromCenter");
                }else{
                    sessionStorage.setItem("fromCenter", true);
                }
            }
        }
    });
    module.exports = index;
});

