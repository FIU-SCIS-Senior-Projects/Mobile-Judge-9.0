Ext.define('MobileJudge.store.judges.Students', {
	extend: 'Ext.data.Store',
	alias: 'store.judgeStudents',

	autoLoad: true,
	pageSize: 0,
	fields: [
		{ name: 'id',               type: 'int',     convert: null },
		{ name: 'fullName',         type: 'string',  convert: null },
		{ name: 'profileImgUrl',    type: 'string',  convert: null },
		{ name: 'project',          type: 'string',  convert: null },
		{ name: 'location',         type: 'string',  convert: null },
		{ name: 'total',            type: 'int',     convert: null },
		{ name: 'graded',           type: 'int',     convert: null },
		{ name: 'accepted',         type: 'int',     convert: null },
		{
			name: 'progress',
			type: 'float',
			depends: 'graded',
			persist: false,
			convert: function(v, r) {
				return r.data.graded / r.data.total;
			}
		},
		{
			name: 'iconCls',
			type: 'string',
			depends: 'graded',
			convert: function(v, r) {
				var done = r.data.graded == r.data.total,
					accepted = r.data.accepted == r.data.total;
				return 'x-fa fa-' + (done ? 'check' : 'edit') + (accepted? ' disabled' : '');
			}
		}
	],
	proxy: {
		type: 'api',
		url: '/api/grades/students'
	}
});
