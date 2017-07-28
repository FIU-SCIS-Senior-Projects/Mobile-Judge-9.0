Ext.define('MobileJudge.store.codes.AdminStates', {
	extend: 'Ext.data.Store',
	alias: 'store.adminstates',

	model: 'MobileJudge.model.Code',

	autoLoad: true,
	pageSize: 0,

	proxy: {
		type: 'api',
		url: '/api/codes/admins'
	}
});
