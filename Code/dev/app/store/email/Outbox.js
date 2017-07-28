Ext.define('MobileJudge.store.email.Outbox', {
	extend: 'Ext.data.Store',
	alias: 'store.outbox',

	model: 'MobileJudge.model.email.Sent',

	proxy: {
		type: 'api',
		url: '/api/emails'
	},

	autoLoad: true,
	remoteSort: true,
	remoteFilter: true,
	pageSize: 25,

	sorters: [
		{
			property: 'sent',
			direction: 'DESC'
		}
	]
});
