/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/center/src/css.css");
    require("lib/iscroll-zoom.js");
    var sTpl = require("views/center/auth.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        // 列表
        components: {},//实例化组件
        data:function() {
            return {
                content: {},
                uploadImg: null,
                wRatio: 1,
                persion: {},
                authImagesType: true,
                authImagesOne: "",
                authImagesTwo: ""
            }
        },
        methods:{
            setElementStyle: function(){
                var input = $(".imgUpload .img-item").eq(0).find("input"),
                    imgCont = $(".auth-transform .img-cont"),
                    w = input.width(),
                    h = input.height(),
                    allW = document.body.clientWidth,
                    allH = document.body.clientHeight - 40,
                    targetH = allW / (w / h),
                    maskH = (allH - targetH) / 2;

                imgCont.find(".mask").css({height: maskH});
                imgCont.find(".cont").css({height: targetH, top: maskH});
                this.content.width = allW;
                this.content.height = targetH;
            },
            imgUpload: function(){
                var that = this,
                    input = $(".imgUpload .img-item input");

                input.on("change", function(){
                    var _this = $(this),
                        fr = new FileReader(),
                        img = new Image();

                    that.uploadImg = _this.parent().next();

                    fr.readAsDataURL(this.files[0]);

                    fr.onload = function(e) {
                        img.src = e.target.result;

                        if(_this.attr("id") == "authImagesOne"){
                            that.authImagesType = true;
                        }else{
                            that.authImagesType = false;
                        }

                        img.onload = function() {
                            var ratio = 1;

                            if (img.width > img.height) {
                                ratio = that.content.width / img.width;
                            } else {
                                ratio = that.content.height / img.height;
                            }

                            $(".auth-transform").show();
                            $(".img-cont .cont").html(img);

                            var scroll = new IScroll($(".img-cont .cont")[0], {
                                zoom : true,
                                scrollX : true,
                                scrollY : true,
                                mouseWheel : true,
                                bounce : false,
                                wheelAction : 'zoom'
                            });

                            that.content.img = img;
                            that.content.scroll = scroll;
                            that.content.ratio = ratio;
                        }
                    }
                });
            },
            imageData: function(obj){
                obj.scroll.enabled = false;

                var canvas = document.createElement('canvas'),
                    _w = obj.width,
                    _h = obj.height;

                canvas.width = _w;
                canvas.height = _h;

                var ctx = canvas.getContext('2d');

                var w = _w / obj.scroll.scale / obj.ratio;
                var h = _h / obj.scroll.scale / obj.ratio;
                var x = Math.abs(obj.scroll.x) / obj.scroll.scale / obj.ratio;
                var y = Math.abs(obj.scroll.y) / obj.scroll.scale / obj.ratio;

                ctx.drawImage(obj.img, x, y, w, h, 0, 0, _w, _h);

                return canvas.toDataURL();
            },
            closeTransform: function(){
                $(".auth-transform").hide();
            },
            getImgUrl: function(){
                $(this.uploadImg).show();
                $(this.uploadImg).find("img")[0].src = this.imageData(this.content);
                this.getFormImgUrl();
                $(".auth-transform").hide();
            },
            getFormImgUrl: function(){
                var that = this,
                    data = {
                        imageBase64: that.imageData(that.content)
                    };

                API_GET({
                    url: "wd_api/file/uploadByteArrayImage",
                    data: data,
                    success: function(result){
                        if(result.isSuccess){
                            if(that.authImagesType){
                                that.authImagesOne = result.data.fileAddress;
                            }else{
                                that.authImagesTwo = result.data.fileAddress;
                            }
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
            },
            close: function(e){
                var obj = $(e.currentTarget);

                obj.parent().hide();
                obj.parents(".img-item").find("input").select();
                obj.parents(".img-item").find("input").val("").click();

                //清理缓存
                document.execCommand("delete");
            },
            validatForm: function(){
                var bol = true;

                $(".js-verify").each(function(){
                    var $this = $(this),
                        val = $this.val(),
                        txt = $this.parents("li").find(".label").text();

                    if(!val){
                        bol = false;

                        $.modal({
                            title: "提示",
                            text: "请输入" + txt,
                            buttons: [{
                                text: "知道了"

                            }],
                            extraClass: "errTips"
                        });

                        return false;
                    }
                });

                if(!bol){
                    return false;
                }

                if(!$("#authImagesOne").val() || !$("#authImagesTwo").val()){
                    $.modal({
                        title: "提示",
                        text: "请上传两张图片",
                        buttons: [{
                            text: "知道了"

                        }],
                        extraClass: "errTips"
                    });

                    return false;
                }

                return true;
            },
            apply: function(){
                if(!this.validatForm()){
                    return false;
                }

                var that = this,
                    data = {
                        memberId: that.persion.memberId
                    },
                    cityArr = $("#city").val().split(" ");

                data.realName = $("#realName").val();
                data.sex = $("#sex").val();
                data.oneWord = $("#oneWord").val();
                data.company = $("#company").val();
                data.selfIntroduction = $("#selfIntroduction").val();
                data.authImagesOne = that.authImagesOne;
                data.authImagesTwo = that.authImagesTwo;

                if(cityArr[2]){
                    data.address = cityArr[2];
                    data.city = cityArr[1];
                    data.province = cityArr[0];
                }else{
                    data.address = cityArr[1];
                    data.city = cityArr[0];
                    data.province = cityArr[0];
                }

                API_GET({
                    url: "wd_api/member/changeSuperApply",
                    data: data,
                    success: function(result){
                        if(result.isSuccess){
                            $.modal({
                                title: "提示",
                                text: "审核需要1-2个工作日，请耐心等待",
                                buttons: [{
                                    text: "知道了"

                                }],
                                onClick:function(){
                                    history.go(-1);
                                },
                                extraClass: "sucTips"
                            });
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
            }
        },
        created:function(){
            this.$root.setTitle('理财师认证');
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
        },
        ready:function(){
            this.persion = JSON.parse(sessionStorage.getItem("persion"));

            $.init();

            $("#sex").picker({ // 选择性别
                toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择您的性别</h1>\
  </header>',
                cols: [
                    {
                        textAlign: 'center',
                        values: ['男', '女']
                    }
                ]
            });

            $("#city").cityPicker({
                toolbarTemplate: '<header class="bar bar-nav">\
    <button class="button button-link pull-right close-picker">确定</button>\
    <h1 class="title">请选择您的所在城市</h1>\
    </header>'
            });

            var width = $(".imgUpload .img-item").eq(0).width();

            $(".imgUpload .img-item").css({height: width / 2});

            this.setElementStyle();
            this.imgUpload();
        }
    });
    module.exports = index;
});

