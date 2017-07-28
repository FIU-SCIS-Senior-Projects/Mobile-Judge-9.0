Ext.define('MobileJudge.store.settings.Terms', {
	extend: 'Ext.data.Store',
	alias: 'store.terms',

	model: 'MobileJudge.model.settings.Term',

	proxy: {
		type: 'api',
		url: '/api/terms'
	},

	autoLoad: true,
	pageSize: 0,

	sorters: {
		direction: 'ASC',
		property: 'display'
	}

});
