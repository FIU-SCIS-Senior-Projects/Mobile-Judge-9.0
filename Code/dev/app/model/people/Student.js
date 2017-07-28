Ext.define('MobileJudge.model.people.Student', {
	extend: 'Ext.data.Model',

	fields: [
		{ name: 'id',               type: 'int', convert: null },
		{ name: 'state',            type: 'string' },
		{ name: 'abbr',             type: 'string' },
        { name: 'fullName',         type: 'string', persist: false },
		{ name: 'email',            type: 'string' },
		{ name: 'profileImgUrl',    type: 'string' },
		{ name: 'project',          type: 'string' },
		{ name: 'location',         type: 'string' },
		/*{ name: 'termName',         type: 'string' },
		{ name: 'mapImageUrl',      type: 'string' },*/
		{ name: 'grade',            type: 'float', convert: null },
		{ name: 'max',              type: 'int', convert: null },
		{ name: 'grade_display',    type: 'string' }
	]
});
