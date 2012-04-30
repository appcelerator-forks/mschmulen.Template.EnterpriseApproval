
exports.PDFWindow = function() {
	var utils = require('util/utils');
	
	var win = Ti.UI.createWindow({
		backgroundColor : '#fff',
		barColor : utils.windowBarColor
	});
	var webView = Ti.UI.createWebView({
		left : 0, right : 0, top : 0, bottom : 0,
		url: ''
	});
	win.add(webView);
	return win;
};
