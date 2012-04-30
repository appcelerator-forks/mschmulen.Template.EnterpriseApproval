
exports.SearchDetailTable = function() {
	// Create the core UI elements of the table.
	var SearchDetailPair = require('ui/SearchDetailPair').SearchDetailPair;
	var poNumberPair = new SearchDetailPair('PO Number:', '');
	var vendorPair = new SearchDetailPair('Vendor:', '');
	var requesterPair = new SearchDetailPair('Requester:', '');
	var numberPair = new SearchDetailPair('Number:', '');
	var descriptionPair = new SearchDetailPair('Description:', '');
	var quantityPair = new SearchDetailPair('Quantity:', '');
	var amountPair = new SearchDetailPair('Amount:', '');
	
	// Populate the array of rows for the table.
	var createRows = function() {
		var rows = [];
		var rowHeight = 40;
		var row = Ti.UI.createTableViewRow({height : rowHeight, header : 'PO Header'});
		row.add(poNumberPair);
		rows.push(row);
		row = Ti.UI.createTableViewRow({height : rowHeight});
		row.add(vendorPair);
		rows.push(row);
		row = Ti.UI.createTableViewRow({height : rowHeight});
		row.add(requesterPair);
		rows.push(row);
		row = Ti.UI.createTableViewRow({height : rowHeight, header : 'PO Item', hasChild : true});
		row.add(numberPair);
		rows.push(row);
		row = Ti.UI.createTableViewRow({height : rowHeight});
		row.add(descriptionPair);
		rows.push(row);
		row = Ti.UI.createTableViewRow({height : rowHeight});
		row.add(quantityPair);
		rows.push(row);
		row = Ti.UI.createTableViewRow({height : rowHeight});
		row.add(amountPair);
		rows.push(row);
		return rows;
	};
	
	var utils = require('util/utils');
	var table = Ti.UI.createTableView({
		backgroundColor : '#fff',
		style : utils.isIOS ? Ti.UI.iPhone.TableViewStyle.GROUPED : null,
		data : createRows()
	});
	var currentData = {};
	
	var populateFields = function(data) {
		currentData = data || {};
		poNumberPair.fireEvent('populateValue', {value:currentData.poNumber});
		vendorPair.fireEvent('populateValue', {value:currentData.vendor});
		requesterPair.fireEvent('populateValue', {value:currentData.requester});
		numberPair.fireEvent('populateValue', {value:currentData.number});
		descriptionPair.fireEvent('populateValue', {value:currentData.description});
		quantityPair.fireEvent('populateValue', {value:currentData.quantity});
		amountPair.fireEvent('populateValue', {value:currentData.amount});
	};
	
	table.addEventListener('populateDetail', function(e) {
		populateFields(e.data);
	});
	table.addEventListener('click', function(e) {
		if (e.index === 3) {
			// Announce that we need the PDF viewer opened.
			table.fireEvent('openPDF', {
				url:'http://www.appcelerator.com.s3.amazonaws.com/blog/relm/whitepaper_4steps_RELM.pdf'
			});
		}
	});
	
	return table;
};
