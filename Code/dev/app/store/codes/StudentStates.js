Ext.define('MobileJudge.store.codes.StudentStates', {
	extend: 'Ext.data.Store',
	alias: 'store.studentStates',

	model: 'MobileJudge.model.Code',

	autoLoad: true,
	pageSize: 0,

	proxy: {
		type: 'api',
		url: '/api/codes/students'
	}
});
