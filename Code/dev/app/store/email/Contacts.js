Ext.define('MobileJudge.store.email.Contacts', {
	extend: 'Ext.data.Store',
	alias: 'store.contacts',

	model: 'MobileJudge.model.email.Contact',

	proxy: {
		type: 'api',
		url: '/api/emails/contacts'
	},

	pageSize: 0
});
