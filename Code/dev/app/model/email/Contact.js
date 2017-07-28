Ext.define('MobileJudge.model.email.Contact', {
	extend: 'Ext.data.Model',

	fields: [
		{ name: 'id',           type: 'int', convert: null },
		{ name: 'fullName',     type: 'string' },
		{ name: 'email',        type: 'string' },
		{ name: 'termId',       type: 'int', convert: null },
		{ name: 'role',         type: 'int', convert: null },
		{ name: 'state',        type: 'int', convert: null }
	]
});
