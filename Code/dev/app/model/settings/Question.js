Ext.define('MobileJudge.model.settings.Question', {
	extend: 'Ext.data.Model',
	requires: [
		'Ext.data.validator.Length',
		'Ext.data.validator.Range'
	],

	fields: [
		{ name: 'id',       type: 'int',        convert: null, persist: false, useNull: true },
		{ name: 'text',     type: 'string',     convert: null },
		{ name: 'value',    type: 'int',        convert: null },
		{ name: 'display',  type: 'int',        convert: null },
		{ name: 'enabled',  type: 'boolean',    convert: null, defaultValue: true  }
	],

	validators: {
		text: { type: 'length', min: 1 },
		value: { type: 'range', min: 1, max: 10 },
		display: { type: 'range', min: 1 }
	}
});
