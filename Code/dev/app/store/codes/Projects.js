Ext.define('MobileJudge.store.codes.Projects', {
	extend: 'Ext.data.Store',
	alias: 'store.projects',

	model: 'MobileJudge.model.Code',

	autoLoad: true,
	pageSize: 0,

	proxy: {
		type: 'api',
		url: '/api/projects'
	}
});
