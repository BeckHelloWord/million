/**
 * Created by hmc on 2016/7/7.
 */
// 理财师 首页

define(function (require,exports,module) {
	
    var financialPlanner = Vue.extend({
		template: '<router-view></router-view>',
		created: function () {
			this.$root.setTitle('首页');
		}
	});
    module.exports = financialPlanner;
});

