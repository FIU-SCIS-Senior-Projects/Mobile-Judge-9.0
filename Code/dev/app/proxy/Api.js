Ext.define('MobileJudge.proxy.API', {
	extend: 'Ext.data.proxy.Rest',
	alias: 'proxy.api',

	noCache: false,

	startParam: 'offset',
	limitParam: 'count',
	pageParam: '',
	remoteSort: true,

	simpleSortMode: true,

	reader: {
		type: 'api'
	},

	writer: {
		type: 'json'
	},

	encodeFilters: function(filters) {
		return filters.map(function(f){
			return f.serialize();
		});
	},

	getParams: function(operation) {
		var me = this,
			params = me.callParent([operation]),
			filterParam = me.getFilterParam(),
			filters = params[filterParam],
			sortParam = me.getSortParam(),
			directionParam = me.getDirectionParam();

		if (params[directionParam] == 'DESC') params[sortParam] = '-' + params[sortParam];
		delete params[directionParam];

		if (filters) {
			filters.forEach(function(f){
				params[f.property] = f.value;
			});
			delete params[filterParam];
		}

		return params;
	}
});
