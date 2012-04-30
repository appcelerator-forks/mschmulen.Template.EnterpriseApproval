
exports.HomeWindow = function() {
	var utils = require('util/utils');
	
	var win = Ti.UI.createWindow({
		title : 'Home',
		backgroundColor : '#fff',
		barColor : utils.windowBarColor
	});
	
	var logoImage = Ti.UI.createImageView({
		image : '/images/Logo.png',
		height : 113, width : 248
	});

	win.add(logoImage);
	return win;
};
