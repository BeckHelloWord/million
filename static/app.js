/**
 * Created by T'ingHsi on 2016/6/23.
 */
define(function (require, exports, module) {
    require("src/public.css"); //css
    //require("components/public.js");
    var iPublic = require("components/public.js");
    //var publicArr = module.publicArr; //公共函数

    //var Auth = module.Auth;

    //var API_GET = module.API_GET;


    // 路由器需要一个根组件。
    var App = Vue.extend({
        data: function () {
            return {
                Name: '',
                bodyClass: '',
                bodyColor: '',
            };
        },
        methods: {
            setTitle: function () {
                this.Name = arguments[0];
                this.$children[0].Name = arguments[0];
                document.title = arguments[0];
                titletxt = arguments[0];

                //解决ios无法获取title问题
                setTimeout(function () {
                    var body = document.getElementsByTagName('body')[0];
                    document.title = titletxt;
                    var iframe = document.createElement("iframe");
                    iframe.style.display = "none";
                    iframe.setAttribute("src", "static/src/logo.png");
                    var d = function () {
                        setTimeout(function () {
                            iframe.removeEventListener('load', d);
                            document.body.removeChild(iframe);
                        }, 0);
                    };
                    iframe.addEventListener('load', d);
                    document.body.appendChild(iframe);
                }, 0);
            },
            setScroll: function () {
                $(window).scrollTop(arguments[0]);
            },
            isEmojiCharacter: function (substring) {
                /*emoji判断*/
                for (var i = 0; i < substring.length; i++) {
                    var hs = substring.charCodeAt(i);
                    if (0xd800 <= hs && hs <= 0xdbff) {
                        if (substring.length > 1) {
                            var ls = substring.charCodeAt(i + 1);
                            var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                            if (0x1d000 <= uc && uc <= 0x1f77f) {
                                return true;
                            }
                        }
                    } else if (substring.length > 1) {
                        var ls = substring.charCodeAt(i + 1);
                        if (ls == 0x20e3) {
                            return true;
                        }
                    } else {
                        if (0x2100 <= hs && hs <= 0x27ff) {
                            return true;
                        } else if (0x2B05 <= hs && hs <= 0x2b07) {
                            return true;
                        } else if (0x2934 <= hs && hs <= 0x2935) {
                            return true;
                        } else if (0x3297 <= hs && hs <= 0x3299) {
                            return true;
                        } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                            || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                            || hs == 0x2b50) {
                            return true;
                        }
                    }
                }
            }
        },
        created: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (navigator.standalone == true) {
                //IOS桌面版本运行
                this.bodyClass = 'standalone';
            } else if (ua.indexOf('triwinbank') != -1) {
                //宝象APP内运行
                this.bodyClass = 'noNav';
            } else if (ua.indexOf('micromessenger/') != -1) {
                //微信内运行
                this.bodyClass = 'noNav';
            } else if (ua.indexOf('weibo_') != -1) {
                //微博内运行
                this.bodyClass = 'noNav';
            } else if (ua.indexOf('qq/') != -1) {
                this.bodyClass = 'noNav';
            } else {
                this.bodyClass = 'hasNav';
            }
        },
        components: {
            'navigation': {
                template: '<header class="top_nav">\
					<a v-if="showgoback" class="back v-hide" v-on:click="goback()">&lt;</a>\
					<div>{{Name}}</div>\
					<a class="reload" onclick="location.reload()"></a>\
				</header>',
                data: function () {
                    return {
                        showgoback: false,
                        shownav: true,
                        Name: this.$root.$data.Name
                    };
                },
                methods: {
                    goback: function () {
                        try {
                            history.back();
                        } catch (r) {
                            history.go(-1);
                        }
                    }
                }
            },
            'footer-nav': {
                template: '<footer v-if="showfooter" class="footer">\
					<a class="a1" v-link="{path: \'/financialPlanner\'}">首页</a>\
					<a class="a2" v-link="{path: \'/product\'}">产品</a>\
					<a class="a3" v-link="{path: \'/appoint\'}">预约</a>\
					<a class="a4" v-link="{path: \'/center\'}">我</a>\
				</footer>',
                data: function () {
                    return {
                        showfooter: false
                    };
                },
                methods: {
                    toCenter: function (e) {
                        if (iPublic.isLogin()) {

                        } else {
                            this.$route.router.go('/login/index')
                            e.stopPropagation()
                        }
                    }
                }
            }
        }
    });


    // 创建一个路由器实例
    var router = new VueRouter();

    // 定义路由规则
    router.map({
        '/financialPlanner': {
            component: function (resolve) {
                require.async(['views/financialPlanner/title.js'], resolve);
            },
            subRoutes: {
                '/': {
                    component: function (resolve) {
                        require.async(['views/financialPlanner/index.js'], resolve);
                    }
                },
                '/index': {
                    component: function (resolve) {
                        require.async(['views/financialPlanner/index.js'], resolve);
                    }
                },
                '/list/': {
					name: "list",
					component: function (resolve) {
                        require.async(['views/financialPlanner/list.js'], resolve);
                    }
                },
                '/detail/:id': {
                    name: "detail",
                    component: function (resolve) {
                        require.async(['views/financialPlanner/detail.js'], resolve);
                    }
                },
                '/comment/:id': {
                    name: "comment",
                    component: function (resolve) {
                        require.async(['views/financialPlanner/comment.js'], resolve);
                    }
                },
                '/appointment/:id': {
                    name: "appointment",
                    component: function (resolve) {
                        require.async(['views/financialPlanner/appointment.js'], resolve);
                    }
                },
                '/superProduct/:id': {
                    name: "super-product",
                    component: function (resolve) {
                        require.async(['views/financialPlanner/superProduct.js'], resolve);
                    }
                }
            }
        },
        '/product': {
            component: function (resolve) {
                require.async(['views/product/title.js'], resolve);
            },
            subRoutes: {
                '/': {
                    name: "product",
                    component: function (resolve) {
                        require.async(['views/product/list.js'], resolve);
                    }
                },
                '/index': {
                    component: function (resolve) {
                        require.async(['views/product/list.js'], resolve);
                    }
                },
                '/list': {
                    component: function (resolve) {
                        require.async(['views/product/list.js'], resolve);
                    }
                },
                '/detail/:id': {
                    name: "product-detail",
                    component: function (resolve) {
                        require.async(['views/product/detail.js'], resolve);
                    }
                },
                '/appointment/:id': {
                    name: "product-appointment",
                    component: function (resolve) {
                        require.async(['views/product/appointment.js'], resolve);
                    }
                },
                '/choice/:id': {
                    name: "product-choice",
                    component: function (resolve) {
                        require.async(['views/product/choice.js'], resolve);
                    }
                }
            }
        },
        '/appoint': {
            component: function (resolve) {
                require.async(['views/appoint/title.js'], resolve);
            },
            subRoutes: {
                '/': {
                    component: function (resolve) {
                        require.async(['views/appoint/list.js'], resolve);
                    }
                },
                '/index': {
                    component: function (resolve) {
                        require.async(['views/appoint/list.js'], resolve);
                    }
                },
                '/list': {
                    name: "appoint",
                    component: function (resolve) {
                        require.async(['views/appoint/list.js'], resolve);
                    }
                }
            }
        },
        '/activity': {
            component: function (resolve) {
                require.async(['views/activity/title.js'], resolve);
            },
            subRoutes: {
                '/': {
                    name: "activity",
                    component: function (resolve) {
                        require.async(['views/activity/list.js'], resolve);
                    }
                },
                '/index': {
                    component: function (resolve) {
                        require.async(['views/activity/list.js'], resolve);
                    }
                },
                '/list': {
                    component: function (resolve) {
                        require.async(['views/activity/list.js'], resolve);
                    }
                },
                '/detail/:id': {
                    name: "activity-detail",
                    component: function (resolve) {
                        require.async(['views/activity/detail.js'], resolve);
                    }
                }
            }
        },
        '/news': {
            component: function (resolve) {
                require.async(['views/news/title.js'], resolve);
            },
            subRoutes: {
                '/': {
                    name: "news",
                    component: function (resolve) {
                        require.async(['views/news/list.js'], resolve);
                    }
                },
                '/index': {
                    component: function (resolve) {
                        require.async(['views/news/list.js'], resolve);
                    }
                },
                '/list': {
                    component: function (resolve) {
                        require.async(['views/news/list.js'], resolve);
                    }
                },
                '/detail/:id': {
                    name: "news-detail",
                    component: function (resolve) {
                        require.async(['views/news/detail.js'], resolve);
                    }
                }
            }
        },
        '/center': {
            name: 'center', // 给这条路径加上一个名字
            component: function (resolve) {
                require.async(['views/center/center.js'], resolve);
            },
            subRoutes: {
                '/': {
                    name: "center",
                    component: function (resolve) {
                        require.async(['views/center/index.js'], resolve);
                    }
                },
                '/subscribe': {
                    name: "subscribe",
                    component: function (resolve) {
                        require.async(['views/center/subscribe.js'], resolve);
                    }
                },
                '/attention': {
                    component: function (resolve) {
                        require.async(['views/center/attention.js'], resolve);
                    }
                },
                '/comment': {
                    component: function (resolve) {
                        require.async(['views/comment/index.js'], resolve);
                    }
                },
                '/about': {
                    component: function (resolve) {
                        require.async(['views/center/about.js'], resolve);
                    }
                },
                '/message': {
                    component: function (resolve) {
                        require.async(['views/message/index.js'], resolve);
                    }
                },
                '/auth': {
                    component: function (resolve) {
                        require.async(['views/center/auth.js'], resolve);
                    }
                },
                '/customer': {
                    component: function (resolve) {
                        require.async(['views/center/customer.js'], resolve);
                    }
                },
                '/customerAdd': {
                    component: function (resolve) {
                        require.async(['views/center/customerAdd.js'], resolve);
                    }
                },
                '/customerEdit/:id': {
                    name: "customer-edit",
                    component: function (resolve) {
                        require.async(['views/center/customerEdit.js'], resolve);
                    }
                }
            }
        },
        '/login': {
            component: function (resolve) {
                require.async(['views/login/login.js'], resolve);
            },
            subRoutes: {
                '/index': {
                    component: function (resolve) {
                        require.async(['views/login/index.js'], resolve);
                    }
                },
                '/forgot': {
                    component: function (resolve) {
                        require.async(['views/login/forgot.js'], resolve);
                    }
                },
                '/update': {
                    component: function (resolve) {
                        require.async(['views/login/update.js'], resolve);
                    }
                },
                '/service': {
                    component: function (resolve) {
                        require.async(['views/login/service.js'], resolve);
                    }
                }
            }
        }
    });

    //路由重定向
    router.redirect({
        // 任意未匹配路径到 /home
        //'*': '/home',

        '/': '/financialPlanner/index'

        // 重定向可以包含动态片段，而且重定向片段必须匹配
        //'/user/:userId': '/profile/:userId',

    });

//router.beforeEach(function (transition) {
    //console.log('将要浏览到: ' + transition.to.fullPath);
    //if(transition.to.path == '/'){
    //	transition.redirect('/financialPlanner/customers');
    //}
    //if (transition.to.auth) {
    // 对用户身份进行验证...
    //}

    //if (transition.to.name === 'grouplistedit' && transition.from.name !== 'grouplist') {
    //	  transition.abort()
    //}
    //setTimeout(scroll,0,0,10);//回到顶部
    //transition.next()
//})

//router.afterEach(function (transition) {
//  console.log('成功浏览到: ' + transition.to.path)
//})


    // 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
    router.start(App, '#app');

});