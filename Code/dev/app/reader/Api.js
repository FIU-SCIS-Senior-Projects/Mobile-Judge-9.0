Ext.define('MobileJudge.reader.Api', {
	extend: 'Ext.data.reader.Json',
	alias: 'reader.api',

	read: function(response, readOptions) {
		var me = this,
			result = me.callParent([response, readOptions]),
			range = parseInt((response.getResponseHeader('Content-Range') || '/0') .split('/')[1]);

		if (range > 0 && range != result.total) result.total = range;
		return result;
	}
});


