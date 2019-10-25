(function(root, factory) {
	if (typeof module === 'object' && typeof exports === 'object') {
		module.exports = factory();
	} else if (typeof exports === 'object') {
		exports._jsonp = factory();
	} else {
		root._jsonp = factory();
	}
})(this, function() {
	return function(options) {
		var scriptDom = document.createElement('script');
		var body = document.body;
		var src = options.url + '?' + params(options.data);
		scriptDom.src = src;
		body.appendChild(scriptDom);
		_cb = function(res) {
			options.success(res);
		};
		function params(obj) {
			var string = '';
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					var item = key + '=' + obj[key];
					string += item + '&';
				}
			}
			return string + 'callback=_cb';
		}
	};
});
