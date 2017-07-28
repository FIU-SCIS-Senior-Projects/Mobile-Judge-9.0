Ext.define('MobileJudge.store.email.Lists', {
	extend: 'Ext.data.Store',
	alias: 'store.emaillists',

	proxy: {
		type: 'api',
		url: '/api/emails/lists'
	},

	fields: [
		{ name: 'id',       type: 'int', convert: null },
		{ name: 'name',     type: 'string' },
		{ name: 'students', convert: eval },
		{ name: 'judges',   convert: eval }
	],

	autoLoad: true,
	pageSize: 0
});
