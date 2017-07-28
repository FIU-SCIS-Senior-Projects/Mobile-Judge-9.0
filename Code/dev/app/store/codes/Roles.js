Ext.define('MobileJudge.store.codes.Roles', {
	extend: 'Ext.data.Store',
	alias: 'store.roles',

	model: 'MobileJudge.model.Code',

	autoLoad: true,
	pageSize: 0,

	proxy: {
		type: 'api',
		url: '/api/codes/roles'
	}
});
