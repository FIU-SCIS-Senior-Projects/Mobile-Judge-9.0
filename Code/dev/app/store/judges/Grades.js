Ext.define('MobileJudge.store.judges.Grades', {
	extend: 'Ext.data.Store',
	alias: 'store.judgeGrades',

	proxy: {
		type: 'api',
		url: '/api/grades'
	},

	autoLoad: true,
	pageSize: 0,

	fields: [
		{ name: 'id',      type: 'string', convert: null },
		{ name: 'state',   type: 'int',    convert: null },
		{ name: 'comment', type: 'string', convert: null },
		{
			name: 'value',
			type: 'int',
			convert: function(v) {
				return (v && Ext.isArray(v)) ? v[0] : v;
			}
		}
	]
});
