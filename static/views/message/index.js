define(function (require, exports, module) {
    require("views/message/src/style.css");
    var sTpl = require("views/message/index.html");
    var message = require("components/message/message.js");//引入组件
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        components: {"msg": message},//实例化组件
        data: function () {
            return {
                messages: [],
                showNum:0,
                offset:10
            }
        },
        events: {
        },
        methods:{
            initData: function () {
                var _this = this;
                API_GET({
                    url: "wd_api/userCenter/getUserMessageList",//返回用户消息
                    data:{
                        offset:0,
                        max:10
                    },
                    success: function(response){
                        var msgList=[];
                        _this.showNum=response.data.length
                        for(var i=0;i<response.data.length;i++){
                            var trueMsg={}
                            var msg=response.data[i]
                            trueMsg.content=msg.content
                            trueMsg.bonus=msg.bonus
                            trueMsg.isRead=msg.isRead
                            trueMsg.dateCreated=msg.dateCreated
                            trueMsg.type=msg.type

                            if(msg.memberId){
                                trueMsg.id=msg.memberId
                                trueMsg.avatar=iPublic.imgUrl(msg.memberAvatar)
                                trueMsg.name=msg.memberName
                            }else if(msg.superId){
                                trueMsg.id=msg.superId
                                trueMsg.avatar=iPublic.imgUrl(msg.superAvatar)
                                trueMsg.name=msg.superName
                            }else if(msg.activityId){
                                trueMsg.id=msg.activityId
                                trueMsg.avatar="static/src/head-default.png"
                                trueMsg.name=msg.offlineActivityName
                            }else{
                                trueMsg.avatar="static/src/head-default.png"
                                trueMsg.name="百万理财师"
                            }
                            msgList.push(trueMsg)
                        }
                        _this.messages=msgList
                    }
                });
            },
            bindScroll:function(){
                var _this=this
                $(".message").bind('scroll', function(){
                    if ($(".message").scrollTop()+$(document).height()-39 >= $(".message_container").height()) {
                        if(_this.showNum==10){
                            _this.getMore()
                        }

                    }
                });
            },
            getMore:function(){
                var _this = this;
                API_GET({
                    url: "wd_api/userCenter/getUserMessageList",//返回用户消息
                    data:{
                        offset:_this.offset,
                        max:10
                    },
                    success: function(response){
                        var msgList=[];
                        _this.offset+=10;
                        _this.showNum=response.data.length
                        for(var i=0;i<response.data.length;i++){
                            var trueMsg={}
                            var msg=response.data[i]
                            trueMsg.content=msg.content
                            trueMsg.bonus=msg.bonus
                            trueMsg.isRead=msg.isRead
                            trueMsg.dateCreated=msg.dateCreated
                            trueMsg.type=msg.type

                            if(msg.memberId){
                                trueMsg.id=msg.memberId
                                trueMsg.avatar=iPublic.imgUrl(msg.memberAvatar)
                                trueMsg.name=msg.memberName
                            }else if(msg.superId){
                                trueMsg.id=msg.superId
                                trueMsg.avatar=iPublic.imgUrl(msg.superAvatar)
                                trueMsg.name=msg.superName
                            }else if(msg.activityId){
                                trueMsg.id=msg.activityId
                                trueMsg.avatar="static/src/head-default.png"
                                trueMsg.name=msg.offlineActivityName
                            }else{
                                trueMsg.avatar="static/src/head-default.png"
                                trueMsg.name="百万理财师"
                            }
                            msgList.push(trueMsg)
                        }
                        _this.messages=_this.messages.concat(msgList)
                    }
                });
            }
        },

        created: function () {
            this.$root.setTitle("消息")
            this.initData()
        },
        ready:function(){
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
            this.bindScroll()
        }
    });

    module.exports = index;
});

