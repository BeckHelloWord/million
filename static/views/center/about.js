/**
 * Created by hmc on 2016/7/7
 */
// 帮助中心

define(function (require, exports, module) {
    require("views/center/src/css.css");
    require("components/swiper/swiper.min.css");
    require("components/swiper/swiper.min.js");

    var sTpl = require("views/center/about.html");
    var iPublic = require("components/public.js");
    var API_GET = iPublic.API_GET;

    var index = Vue.extend({
		template: sTpl,
        components: {},
        data: function(){
            return []
        },
        events: {

        },
        methods:{

        },
        created:function(){
            this.$root.setTitle('关于我们');

            //设置返回键
            this.$root.$children[0].showgoback = true;
            this.$root.$children[1].showfooter = false;
        },
        ready: function(){
            setTimeout(function(){
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    slidesPerView: 1,
                    centeredSlides: true,
                    paginationClickable: true,
                    spaceBetween: 0,
                    loop: true,
                    preloadImages: true,
                    updateOnImagesReady: true,
                });
                $('.swiper-button-prev').on('click', function(){
                    swiper.slidePrev();
                });
                $('.swiper-button-next').on('click', function(){
                    swiper.slideNext();
                });
            },500)
        }
    });
    module.exports = index;
});

