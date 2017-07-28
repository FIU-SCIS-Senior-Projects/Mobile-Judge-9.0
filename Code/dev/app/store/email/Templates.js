Ext.define('MobileJudge.store.email.Templates', {
	extend: 'Ext.data.Store',
	alias: 'store.templates',

	model: 'MobileJudge.model.email.Template',

	proxy: {
		type: 'api',
		url: '/api/templates'
	},

	autoLoad: true,
	autoSync: true,
	pageSize: 0
});
