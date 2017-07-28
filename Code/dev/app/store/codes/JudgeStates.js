Ext.define('MobileJudge.store.codes.JudgeStates', {
	extend: 'Ext.data.Store',
	alias: 'store.judgeStates',

	model: 'MobileJudge.model.Code',

	autoLoad: true,
	pageSize: 0,

	proxy: {
		type: 'api',
		url: '/api/codes/judges'
	}
});
