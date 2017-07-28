Ext.define('MobileJudge.model.email.Placeholder', {
	extend: 'Ext.data.Model',
	requires: [
		'Ext.data.validator.Length'
	],

	fields: [
		{ name: 'id',       type: 'int', persist: false, useNull: true, convert: null },
		{ name: 'code',     type: 'string' },
		{ name: 'text',     type: 'string' },
		{ name: 'value',    type: 'string' }
	],

	validators: {
		code: { type: 'length', min: 1 },
		text: { type: 'length', min: 1 },
		value: { type: 'length', min: 1 }
	}
});
