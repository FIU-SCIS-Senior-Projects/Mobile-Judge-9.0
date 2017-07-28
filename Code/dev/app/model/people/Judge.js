Ext.define('MobileJudge.model.people.Judge', {
	extend: 'Ext.data.Model',

	fields: [
		{ name: 'id',               type: 'int', convert: null },
		{ name: 'state',            type: 'string' },
		{ name: 'abbr',             type: 'string' },
		{ name: 'fullName',         type: 'string', persist: false },
		{ name: 'email',            type: 'string' },
		{ name: 'profileImgUrl',    type: 'string' },
		{ name: 'title',            type: 'string' },
		{ name: 'affiliation',      type: 'string' }/*,
		{ name: 'termName',         type: 'string' },
		{ name: 'mapImageUrl',      type: 'string' }*/
	]
});
