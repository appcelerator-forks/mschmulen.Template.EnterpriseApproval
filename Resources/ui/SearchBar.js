
exports.SearchBar = function(params) {
	typeSelectedCB = params.typeSelectedCB || function(type) {
		Ti.API.info('NOT IMPLEMENTED');
	};
	doSearchCB = params.doSearchCB || function() {
		Ti.API.info('NOT IMPLEMENTED');
	};
	cancelSearchCB = params.cancelSearchCB || function() {
		Ti.API.info('NOT IMPLEMENTED');
	};
	var mainTop = (params && params.top) ? params.top : 0;
	
	var utils = require('util/utils');
	var mainControlsHeight = 44;
	var mainContainer = Ti.UI.createView({
		top : mainTop, left : 0, right : 0, height : 96,
	});
	var mainControlsContainer = Ti.UI.createView({
		backgroundImage : '/images/SearchBarSolidBG.png',
		top : 0, left : 0, right : 0, height : mainControlsHeight
	});
	var showTypesButton = Ti.UI.createImageView({
		image : '/images/POButtonArrow.png',
		top : 7, left : 5, width : 55, height : 29
	});
	var arrow = Ti.UI.createImageView({
		image : '/images/WhiteArrow.png',
		top : 12, left : 36, width : 19, height : 19
	});
	var searchBarContainer = Ti.UI.createView({
		backgroundImage : '/images/SearchBarSolidBG.png',
		top : 0, left : showTypesButton.left + showTypesButton.width + 4, bottom : 0, width : 190
	});
	var leftEndCap = Ti.UI.createImageView({
		image : '/images/LeftEndCap.png',
		top : 0, left : 0, width : 31, height : 44
	});
	var textFieldContainer = Ti.UI.createView({
		backgroundImage : '/images/SearchBarBG.png',
		top : 0, left : leftEndCap.width, height : 44, width : searchBarContainer.width-62
	});
	var textField = Ti.UI.createTextField({
		hintText : 'Number', value : '',
		color : '#000',
		font : {fontSize : 14},
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_NONE,
		top : 8, left : 0, right : 0, bottom : 8
	});
	var rightEndCap = Ti.UI.createImageView({
		image : '/images/RightEndCap.png',
		top : 0, left : (textFieldContainer.left + textFieldContainer.width), width : 31, height : 44
	});
	var cancelButton = Ti.UI.createImageView({
		image : '/images/CancelButton.png',
		top : 7, left : 4 + searchBarContainer.left + searchBarContainer.width, width : 55, height : 29
	});
	
	rightEndCap.addEventListener('click', function() {
		if (textField.value !== '') {
			textField.value = '';
			textField.fireEvent('change', {});
		}
	});
	
	var typeContainerHeight = 52;
	var topHidden = -(typeContainerHeight - mainControlsHeight);
	var topVisible = mainControlsContainer.height;
	var typeContainer = Ti.UI.createView({
		backgroundImage : '/images/SubBar.png',
		left : 15, height : typeContainerHeight, top : topHidden, width : 133
	});
	var label = Ti.UI.createLabel({
		text : 'Search By:', color : '#000',
		font : {fontWeight : 'bold', fontSize : 11},
		top : 1, left : 16, width : 100, height : 18
	});
	var poTypeButton = Ti.UI.createImageView({
		image : '/images/POButton.png',
		left : 7, top : 18, width : 55, height : 29
	});
	var invTypeButton = Ti.UI.createImageView({
		image : '/images/INVButton.png',
		left : 71, top : 18, width : 55, height : 29
	});
	
	var slideTypesUp = Ti.UI.createAnimation({
		top : topHidden,
		left : typeContainer.left,
		duration : 300
	});
	var slideTypesDown = Ti.UI.createAnimation({
		top : topVisible,
		left : typeContainer.left,
		duration : 300
	});
	
	var cwMatrix = Ti.UI.create2DMatrix();
	var ccwMatrix = Ti.UI.create2DMatrix();
	if (utils.isMobileWeb) {
		cwMatrix = cwMatrix.rotate(-180);
		ccwMatrix = ccwMatrix.rotate(180);
	} else {
		cwMatrix = cwMatrix.rotate(-180);
		ccwMatrix = ccwMatrix.rotate(0);
	}
	var pointUp = Ti.UI.createAnimation({
		transform : cwMatrix,
		duration : 300
	});
	var pointDown = Ti.UI.createAnimation({
		transform : ccwMatrix,
		duration : 300
	});
	
	var typesVisible = false;
	var hideTypes = function() {
		if (typesVisible) {
			typeContainer.animate(slideTypesUp);
			arrow.animate(pointDown);
			typesVisible = false;
		}
	};
	var showTypes = function() {
		if (!typesVisible) {
			typeContainer.animate(slideTypesDown);
			arrow.animate(pointUp);
			typesVisible = true;
		}
	};
	
	showTypesButton.addEventListener('click', function() {
		typesVisible ? hideTypes() : showTypes();
		textField.blur();
	});
	arrow.addEventListener('click', function() {
		typesVisible ? hideTypes() : showTypes();
		textField.blur();
	});
	
	poTypeButton.addEventListener('click', function() {
		hideTypes();
		showTypesButton.image = '/images/POButtonArrow.png';
		typeSelectedCB('PO');
	});
	invTypeButton.addEventListener('click', function() {
		hideTypes();
		showTypesButton.image = '/images/INVButtonArrow.png';
		typeSelectedCB('INV');
	});
	
	textField.addEventListener('focus', function(e) {
		hideTypes();
	});
	var showingX = false;
	textField.addEventListener('change', function() {
		if (textField.value !== '') {
			if (!showingX) {
				rightEndCap.image = '/images/RightEndCapX.png';
				showingX = true;
			}
		} else {
			if (showingX) {
				rightEndCap.image = '/images/RightEndCap.png';
				showingX = false;
			}
		}
	});
	textField.addEventListener('return', function(e) {
		textField.blur();
		if (textField.value !== '') {
			doSearchCB(textField.value);
		};
	});
	mainContainer.addEventListener('reset', function(e) {
		resetUI();
	});
	var resetUI = function() {
		textField.value = '';
		rightEndCap.image = '/images/RightEndCap.png';
		hideTypes();
		textField.blur();
	};
	
	cancelButton.addEventListener('click', function(e) {
		resetUI();
		cancelSearchCB();
	});
	
	var animate = function(animation) {
		mainContainer.animate(animation);
	};
	var hide = function() {
		mainContainer.hide();
	};
	var show = function() {
		mainContainer.show();
	};
	
	searchBarContainer.add(leftEndCap);
	textFieldContainer.add(textField);
	searchBarContainer.add(textFieldContainer);
	searchBarContainer.add(rightEndCap);
	mainControlsContainer.add(showTypesButton);
	mainControlsContainer.add(arrow);
	mainControlsContainer.add(searchBarContainer);
	mainControlsContainer.add(cancelButton);
	typeContainer.add(label);
	typeContainer.add(poTypeButton);
	typeContainer.add(invTypeButton);
	mainContainer.add(typeContainer);
	mainContainer.add(mainControlsContainer);
	
	return {
		view : mainContainer,
		hide : hide,
		show : show,
		animate : animate,
		reset : resetUI
	}
};
