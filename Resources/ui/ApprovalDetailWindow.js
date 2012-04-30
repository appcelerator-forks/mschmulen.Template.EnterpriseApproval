
exports.ApprovalDetailWindow = function() {
	var utils = require('util/utils');
	var win = Ti.UI.createWindow({
		title : 'Detail',
		backgroundColor : '#fff',
		barColor : utils.windowBarColor,
		layout : 'vertical'
	});
	var Approver = require('approval/Approver').Approver;
	var approver = new Approver();
	var currentData = {};
	
	// Layout the UI fields.
	var ApprovalDetailPair = require('ui/ApprovalDetailPair').ApprovalDetailPair;
	var vendorPair = new ApprovalDetailPair('Vendor:', '');
	var amountPair = new ApprovalDetailPair('Amount:', '');
	var dueDatePair = new ApprovalDetailPair('Due Date:', '');
	var statusPair = new ApprovalDetailPair('Status:', '');
	var numPairs = 4;
	var detailsContainer = Ti.UI.createView({
		top : 30, left : 20, right : 20, height : numPairs*vendorPair.height, layout : 'vertical'
	});
	detailsContainer.add(vendorPair);
	detailsContainer.add(amountPair);
	detailsContainer.add(dueDatePair);
	detailsContainer.add(statusPair);
	
	var approveButton = Ti.UI.createButton({
		title : 'Approve',
		height : 44, width : 100, top : 0, left : 0
	});
	approveButton.addEventListener('click', function(e) {
		if (approver.approve(currentData)) {
			win.fireEvent('approvalCompleted', {data:currentData});
			// alert(currentData.VendorName + '\nhas been approved.');
			(!utils.isMobileWeb) && win.close();
		}
	});
	
	var denyButton = Ti.UI.createButton({
		title : 'Deny',
		height : 44, width : 100, top : 0, right : 0
	});
	denyButton.addEventListener('click', function(e) {
		if (approver.deny(currentData)) {
			win.fireEvent('approvalCompleted', {data:currentData});
			// alert(currentData.VendorName + '\nhas been denied.');
			(!utils.isMobileWeb) && win.close();
		}
	});
	
	var buttonContainer = Ti.UI.createView({
		top : 50, width : 230, height : 44,
	});
	buttonContainer.add(approveButton);
	buttonContainer.add(denyButton);
	
	var populateFields = function(data) {
		currentData = data || {};
		vendorPair.fireEvent('populateValue', {value:currentData.VendorName});
		amountPair.fireEvent('populateValue', {value:currentData.GrossAmnt + ' ' + currentData.Currency});
		dueDatePair.fireEvent('populateValue', {value:currentData.DueDate});
		statusPair.fireEvent('populateValue', {value:currentData.Status});
	};
	
	win.addEventListener('populateDetail', function(e) {
		populateFields(e.data);
	});
	
	win.add(detailsContainer);
	win.add(buttonContainer);
	return win;
};
