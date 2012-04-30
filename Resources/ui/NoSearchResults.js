
exports.NoSearchResults = function(data) {
	var view = Ti.UI.createView({
		top : 0, left : 0, right : 0, bottom : 0, layout : 'vertical'
	});
	var title = Ti.UI.createLabel({
		text : 'No data to display',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		color : '#000',
		font: {fontSize : 18, fontWeight : 'bold'},
		top : 80, left : 0, right : 0, height : 40
	});
	view.add(title);
	
	return view;
};
