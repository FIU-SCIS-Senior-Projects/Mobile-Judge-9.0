Ext.define('MobileJudge.override.Connection', {
	override: 'Ext.data.Connection',

	constructor: function(config) {
		this.callParent(config);
		this.on('requestcomplete', this.refreshToken, this);
		this.on('requestexception', this.handle401Error, this);
	},

	handle401Error: function (conn, response) {
		Ext.GlobalEvents.fireEvent('requestError', conn, response);
	},

	refreshToken: function(conn, response) {
		if (response && response.getResponseHeader) {
			var refreshToken = response.getResponseHeader('X-AUTH-TOKEN');
			if (refreshToken) localStorage.setItem('token', refreshToken);
		}
	},

	request: function(options) {
		options = options || {};

		var token = localStorage.getItem('token');
		if (token) options.headers = {
			Authorization: 'Bearer ' + token
		};

		this.callParent([options]);
	}
});
