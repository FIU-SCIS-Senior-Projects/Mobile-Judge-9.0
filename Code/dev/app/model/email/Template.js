Ext.define('MobileJudge.model.email.Template', {
	extend: 'Ext.data.Model',

	fields: [
		{ name: 'id',       type: 'int', persist: false, useNull: true, convert: null },
		{ name: 'name',     type: 'string' },
		{ name: 'subject',  type: 'string' },
		{ name: 'body',     type: 'string' }
	],

	validators: {
		name: { type: 'length', min: 1 },
		subject: { type: 'length', min: 1 },
		body: { type: 'length', min: 1 }
	}
});
