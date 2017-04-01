define(function (require, exports, module) {
    require("views/comment/src/style.css")
    var sTpl = require("views/comment/index.html")
    var iPublic = require("components/public.js")
    var API_GET = iPublic.API_GET

    var index = Vue.extend({
		template: sTpl,
        data: function () {
		    return {
		        maxheight: (window.screen.availHeight - 100)
            }
        },
        methods:{
            doSub:function(){

                var _this=this
                var content=$("#commenttextarea").val()
                if(content==""||typeof content=="undefined"){
                    $.alert("请输入您的评论")
                    return
                }
                var sendData={
                    content:content,
                    typeCode:"super",
                    bonus :JSON.parse(sessionStorage.getItem("comment")).superId,
                    subscribeId:JSON.parse(sessionStorage.getItem("comment")).subscribeId,

                }
                API_GET({
                    url: "wd_api/discuss/memberDiscuss",//用户评论
                    data:sendData,
                    success: function(data){
                        if(data.isSuccess){
                            $.toast("评论成功")
                            _this.$route.router.go('/center/subscribe')
                        }else{
                            $.alert(data.message)
                        }

                    }
                });
            }
        },
        created: function () {
            this.$root.setTitle(" 评论")

        },
        ready:function(){
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
        }
    })
    module.exports = index
});

var change  = function(ele){
    ele.style.height = ele.scrollHeight + 'px'
}

/* @keydown.enter = change(this) */
