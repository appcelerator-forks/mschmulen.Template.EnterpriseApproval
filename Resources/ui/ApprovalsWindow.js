
exports.ApprovalsWindow = function() {
	var utils = require('util/utils');
	var ApprovalDetailWindow = require('ui/ApprovalDetailWindow').ApprovalDetailWindow;
	var approvalDetailWin = new ApprovalDetailWindow();
	
	var win = Ti.UI.createWindow({
		title : 'Approvals',
		backgroundColor : '#fff',
		barColor : utils.windowBarColor,
		layout : !utils.isIOS ? 'vertical' : null
	});
	var createDetailRow = function(data) {
		var row = Ti.UI.createTableViewRow({
			height : 50,
			backgroundGradient : {
				colors : [
					{color : '#fff', position : 0.0},
					{color : '#eee', position : 1.0}
				],
				startPoint : {x : 0, y : 0}, endPoint : {x : 0, y : 50},
				type : 'linear', backFillStart : false
			},
			color: 'transparent', selectedColor: 'transparent',
			hasChild : true,
			data : data
		});
		row.add(Ti.UI.createLabel({
			text : data.VendorName,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			font : {fontWeight : 'bold', fontSize : 16},
			wordWrap : false, ellipsize : true,
			top : 0, left : 10, right : 20, height : 30,
			color : '#000'
		}));
		row.add(Ti.UI.createLabel({
			text : data.GrossAmnt + ' ' + data.Currency,
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			font : {fontSize : 14},
			wordWrap : false, ellipsize : true,
			bottom : 5, left : 25, right : 20, height : 20,
			color : '#000'
		}));
		return row;
	};
	
	var clickedRowIndex = -1;
	var table = Ti.UI.createTableView({
		left : 0, right : 0, top : 0, bottom : 0,
		data : null
	});
	table.addEventListener('click', function(e) {
		clickedRowIndex = e.index;
		approvalDetailWin.fireEvent('populateDetail', {data:e.row.data});
		win.containingTab.open(approvalDetailWin);
	});
	
	var refreshData = function() {
		// Refresh the data here.
		// For demo purposes, just load some mock data.
		var mockApprovalData = require('util/mockApprovalData');
		var approvalItems = mockApprovalData.items;
		
		// Populate the table from the data.
		var rows = [];
		for (var i = 0, len = approvalItems.length; i < len; i++) {
			var row = createDetailRow(approvalItems[i]);
			rows.push(row);
		}
		table.data = null;
		table.data = rows;
		broadcastBadgeValue();
	};
	
	var refreshButton;
	var refreshSpacer = null;
	if (utils.isIOS) {
		// Create the button on the navbar.
		refreshButton = Ti.UI.createButton({
			systemButton : Ti.UI.iPhone.SystemButton.REFRESH
		});
		win.rightNavButton = refreshButton;
	} else {
		// We can't have a nice navbar button.
		refreshButton = Ti.UI.createImageView({
			image : '/images/RefreshButton.png',
			top : 3, left : 30, height : 29, width : 55
		});
		refreshSpacer = Ti.UI.createView({
			top : 0, left : 0, height : 35, right : 0
		});
		refreshSpacer.add(refreshButton);
	}
	refreshButton.addEventListener('click', function(e) {
		refreshData();
	});
	
	var broadcastBadgeValue = function() {
		setTimeout(function() {
			var numRows = 0;
			if (table && table.data && table.data[0] && table.data[0].rows) {
				numRows = table.data[0].rows.length;
			}
			Ti.App.fireEvent('badgeValue', {value:numRows});
		}, 600);
	};
	approvalDetailWin.addEventListener('approvalCompleted', function(e) {
		if (e && e.data && (clickedRowIndex >= 0)) {
			table.deleteRow(clickedRowIndex);
			clickedRowIndex = -1;
		}
		broadcastBadgeValue();
	});
	approvalDetailWin.addEventListener('approvalCompleted', function(e) {
		if (e && e.data && (clickedRowIndex >= 0)) {
			table.deleteRow(clickedRowIndex);
			clickedRowIndex = -1;
		}
		broadcastBadgeValue();
		if (utils.isMobileWeb) {
			win.containingTab.close();
		}
	});
	
	refreshData();
	
	if (refreshSpacer) {
		win.add(refreshSpacer);
	}
	win.add(table);
	return win;
};
