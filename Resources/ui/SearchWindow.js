
exports.SearchWindow = function() {
	var utils = require('util/utils');
	var win = Ti.UI.createWindow({
		title : 'Search',
		backgroundColor : '#fff',
		barColor : utils.windowBarColor
	});
	
	var searchByPoNumber = true;
	typeSelectedCB = function(type) {
		Ti.API.info(type + ' selected.');
		searchByPoNumber = (type === 'PO');
	};
	doSearchCB = function(term) {
		Ti.API.info('Perform Search for: ' + term + ' (searchByPoNumber=' + searchByPoNumber + ')');
		hideSearchBar();
		performSearch();
		searchDetailTable.show();
		noSearchResults.hide();
		mask.animate(fadeOutMask);
	};
	cancelSearchCB = function() {
		Ti.API.info('Cancel Search.');
		hideSearchBar();
		mask.animate(fadeOutMask);
	};
	var SearchBar = require('ui/SearchBar').SearchBar;
	var customSearchBar = new SearchBar({
		top : 0,
		typeSelectedCB : typeSelectedCB,
		doSearchCB : doSearchCB,
		cancelSearchCB : cancelSearchCB
	});
	
	var openPdfInAndroid = function(url) {
		xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(10000);
		xhr.onload = function() {
			// Save the data into a local file.
			var filename = 'tmp.pdf';
			var f = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename);
			f.write(this.responseData);
			
			// Attempt to open the file.
			try {
				Ti.Android.currentActivity.startActivity(Ti.Android.createIntent({
					action : Ti.Android.ACTION_VIEW,
					type : 'application/pdf',
					data : f.getNativePath()
				}));
			} catch (e) {
				var alertDialog = Ti.UI.createAlertDialog({
					title : 'ERROR',
					message : 'No PDF viewer was found on this Android device.',
					buttonNames : ['OK'],
					cancel : 0
				});
				alertDialog.show();
			}
		};
		xhr.open('GET', url);
		xhr.send();
	}
	
	var PDFWindow = require('ui/PDFWindow').PDFWindow;
	var pdfWindow = new PDFWindow();
	
	var SearchDetailTable = require('ui/SearchDetailTable').SearchDetailTable;
	var searchDetailTable = new SearchDetailTable();
	searchDetailTable.hide();
	searchDetailTable.addEventListener('openPDF', function(e) {
		if (e && e.url) {
			if (utils.isAndroid) {
				openPdfInAndroid(e.url);
			} else {
				pdfWindow.children[0].url = e.url;
				win.containingTab.open(pdfWindow);
			}
		}
	});
	
	var NoSearchResults = require('ui/NoSearchResults').NoSearchResults;
	var noSearchResults = new NoSearchResults();
	noSearchResults.hide();
	
	// Create some animations.
	var animationDuration = 300;
	var slideSearchUp = Ti.UI.createAnimation({
		top : -44,
		duration : animationDuration
	});
	var slideSearchDown = Ti.UI.createAnimation({
		top : 0,
		duration : animationDuration
	});
	var fadeInMask = Ti.UI.createAnimation({
		opacity : 0.5,
		duration : animationDuration
	});
	var fadeOutMask = Ti.UI.createAnimation({
		opacity : 0.0,
		duration : animationDuration
	});
	
	var mask = Ti.UI.createView({
		backgroundColor : '#000', opacity : 0.5,
		left : 0, right : 0, top : 0, bottom : 0
	});
	mask.animate(fadeInMask);
	
	var searchVisible = true;
	var toggleSearchButton;
	if (utils.isIPhone) {
		toggleSearchButton = Ti.UI.createButton({
			image : '/images/spyglass_30.png',
		});
	} else {
		toggleSearchButton = Ti.UI.createImageView({
			image : '/images/SpyglassButton.png',
			top : 7, right : 7, height : 30, width : 30
		});
	}
	var showSearchBar = function() {
		if (!searchVisible) {
			customSearchBar.show();
			customSearchBar.animate(slideSearchDown);
			searchVisible = true;
			mask.show();
			mask.animate(fadeInMask);
		}
	};
	var hideSearchBar = function() {
		if (searchVisible) {
			customSearchBar.reset();
			customSearchBar.animate(slideSearchUp);
			setTimeout(function() {
				// Let the animation finish before hiding.
				customSearchBar.hide();
			}, slideSearchUp.duration);
			searchVisible = false;
			mask.animate(fadeOutMask);
			setTimeout(function() {
				// Let the fade-out finish before hiding.
				mask.hide();
			}, animationDuration);
		}
	};
	toggleSearchButton.addEventListener('click', function() {
		if (!searchVisible) {
			showSearchBar();
		} else {
			hideSearchBar();
		}
	});
	
	var performSearch = function() {
		// Load the search data.
		// For demo purposes, just load some mock data.
		var mockPOSearchData = require('util/mockPOSearchData');
		var poSearchHeader = mockPOSearchData.header;
		var poSearchItem = mockPOSearchData.item;
		
		// Populate the results from the data.
		var searchData = {
			poNumber : poSearchHeader.PoNumber,
			vendor : poSearchHeader.VendName,
			requester : poSearchHeader.SalesPers,
			number : poSearchItem.Trackingno,
			description : poSearchItem.ShortText,
			quantity : poSearchItem.Quantity,
			amount : poSearchItem.EffValue + ' ' + poSearchHeader.Currency,
		};
		searchDetailTable.fireEvent('populateDetail', {data:searchData});
	};
	
	win.add(searchDetailTable);
	win.add(mask);
	// win.add(noSearchResults);
	win.add(customSearchBar.view);
	
	if (utils.isIPhone) {
		win.rightNavButton = toggleSearchButton;
	} else {
		win.add(toggleSearchButton);
	}
	
	win.addEventListener('blur', function() {
		customSearchBar.reset();
	});
	
	return win;
};
