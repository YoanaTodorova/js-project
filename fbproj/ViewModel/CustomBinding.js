(function ($, ko) {

	ko.bindingHandlers.tabsBinding = {
		init: function (element, valueAccessor) {
			setTimeout(function () {
				$(element).tabs();
			}, 0);
		}
	};

})(jQuery, ko);