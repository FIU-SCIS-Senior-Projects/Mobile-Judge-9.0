Ext.define('MobileJudge.model.Code', {
	extend: 'Ext.data.Model',

	fields: [
		{ name: 'id',   type: 'int', convert: null },
		{ name: 'name', type: 'string' },
		{ name: 'abbr', type: 'string' }
	]
});
