
var utils = require('util/utils');
if (utils.isMobileWeb && (utils.version < 2.0)) {
	alert('Sorry - this application requires Titanium Mobile SDK 2.0 or later');
} else {
	var TabGroup = require('ui/TabGroup').TabGroup;
	var tabGroup = new TabGroup();
	tabGroup.open();
}
