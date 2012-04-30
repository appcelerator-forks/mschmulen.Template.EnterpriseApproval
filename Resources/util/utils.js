
var osname = Ti.Platform.osname;
exports.isAndroid = (osname === 'android');
exports.isMobileWeb = (osname === 'mobileweb');
exports.isIPhone = (osname === 'iphone');
exports.isIPad = (osname === 'ipad');
exports.isIOS = exports.isIPhone || exports.isIPad;

exports.version = Ti.version;

exports.appWidth = Ti.Platform.displayCaps.platformWidth;
exports.appHeight = Ti.Platform.displayCaps.platformHeight;

exports.windowBarColor = '#97d000';
