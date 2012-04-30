
exports.ApprovalDetailPair = function(title, value) {
	var container = Ti.UI.createView({
		top : 0, left : 0, right : 0, height : 40
	});
	var title = Ti.UI.createLabel({
		text : title,
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		color : '#000',
		font: {fontSize : 16, fontWeight : 'bold'},
		top : 0, left : 0, width : 100, bottom : 0
	});
	var value = Ti.UI.createLabel({
		text : value,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		color : '#000',
		font: {fontSize : 16},
		wordWrap: false, ellipsize: true,
		top : 0, left : 110, right : 0, bottom : 0
	});
	container.add(title);
	container.add(value);
	
	container.addEventListener('populateValue', function(e) {
		value.text = e.value;
	});
	
	return container;
};
