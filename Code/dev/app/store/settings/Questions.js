Ext.define('MobileJudge.store.settings.Questions', {
	extend: 'Ext.data.Store',
	alias: 'store.questions',

	model: 'MobileJudge.model.settings.Question',

	proxy: {
		type: 'api',
		url: '/api/questions'
	},

	autoLoad: true,
	autoSync: true,
	pageSize: 0
});
