Ext.define('MobileJudge.store.codes.Grades', {
	extend: 'Ext.data.Store',
	alias: 'store.grades',

	model: 'MobileJudge.model.Code',

	autoLoad: true,
	pageSize: 0,

	proxy: {
		type: 'api',
		url: '/api/codes/grades'
	}
});
