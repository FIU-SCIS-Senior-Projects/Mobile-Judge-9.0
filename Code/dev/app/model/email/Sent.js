Ext.define('MobileJudge.model.email.Sent', {
	extend: 'Ext.data.Model',

	fields: [
		{ name: 'id',               type: 'int', convert: null },
		{ name: 'address',          type: 'string' },
		{ name: 'subject',          type: 'string' },
		{ name: 'fullName',         type: 'string' },
		{ name: 'profileImgUrl',    type: 'string' },
		{ name: 'state',            type: 'string' },
		{ name: 'sent',             type: 'date' },
		{ name: 'replied',          type: 'date' }
	]
});
