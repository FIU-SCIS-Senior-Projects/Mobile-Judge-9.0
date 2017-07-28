Ext.define('MobileJudge.store.codes.Locations', {
	extend: 'Ext.data.Store',
	alias: 'store.locations',

	model: 'MobileJudge.model.Code',

	autoLoad: true,
	pageSize: 0,

	proxy: {
		type: 'api',
		url: '/api/codes/locations'
	}
});
