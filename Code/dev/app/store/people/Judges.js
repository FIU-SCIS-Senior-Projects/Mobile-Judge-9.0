Ext.define('MobileJudge.store.people.Judges', {
	extend: 'Ext.data.Store',
	alias: 'store.judges',

	model: 'MobileJudge.model.people.Judge',

	proxy: {
		type: 'api',
		url: '/api/judges',
	},

	remoteSort: true,
	remoteFilter: true,
    autoLoad: true,
    pageSize: 25
});
