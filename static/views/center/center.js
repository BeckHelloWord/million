/**
 * Created by yy on 2016/9/14.
 */
define(function (require,exports,module) {

    var vue = Vue.extend({
        template: '<router-view></router-view>',
        created: function () {
            this.$root.setTitle('我');
            this.$root.$children[1].showfooter = true;
        }
    });
    module.exports = vue;
});