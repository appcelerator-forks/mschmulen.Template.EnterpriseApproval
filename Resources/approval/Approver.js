
exports.Approver = function() {
	var approve = function(data) {
		// Handle the Approve request.
		// ...
		return true;
	};
	
	var deny = function(data) {
		// Handle the Deny request.
		// ...
		return true;
	};
	
	return {
		approve : approve,
		deny : deny
	};
};
