Ext.define('MobileJudge.store.email.Placeholders', {
	extend: 'Ext.data.Store',
	alias: 'store.placeholders',

	model: 'MobileJudge.model.email.Placeholder',

	proxy: {
		type: 'api',
		url: '/api/placeholders'
	},

	autoLoad: true,
	autoSync: true,
	pageSize: 0
});
