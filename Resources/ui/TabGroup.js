
exports.TabGroup = function() {
	var utils = require('util/utils');
	if (utils.isIOS) {
		Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.TRANSLUCENT_BLACK;
	}

	var HomeWindow = require('ui/HomeWindow').HomeWindow;
	var homeWin = new HomeWindow();
	var homeTab = Ti.UI.createTab({
		title : 'Home',
		icon : '/images/home_30_black.png',
		window : homeWin
	});
	homeWin.containingTab = homeTab;
	
	var ApprovalsWindow = require('ui/ApprovalsWindow').ApprovalsWindow;
	var approvalsWin = new ApprovalsWindow();
	var approvalsTab = Ti.UI.createTab({
		title : 'Approval',
		icon : '/images/white_list_folder_30.png',
		window : approvalsWin
	});
	approvalsWin.containingTab = approvalsTab;

	var SearchWindow = require('ui/SearchWindow').SearchWindow;
	var searchWin = new SearchWindow();
	var searchTab = Ti.UI.createTab({
		title : 'PO Search',
		icon : '/images/spyglass_30_black.png',
		window : searchWin
	});
	searchWin.containingTab = searchTab;

	var tabGroup = Ti.UI.createTabGroup();
	tabGroup.addTab(homeTab);
	tabGroup.addTab(approvalsTab);
	tabGroup.addTab(searchTab);
	
	Ti.App.addEventListener('badgeValue', function(e) {
		var value = (e.value > 0) ? e.value : null;
		approvalsTab.badge = value;
	});

	return tabGroup;
};
