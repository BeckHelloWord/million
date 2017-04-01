/**
 * Created by hmc on 2016/7/7.
 */
// 理财师 首页

define(function (require,exports,module) {
	
    var product = Vue.extend({
		template: '<router-view></router-view>',
		created: function () {
			this.$root.setTitle('产品');
		}
	});
    module.exports = product;
});

