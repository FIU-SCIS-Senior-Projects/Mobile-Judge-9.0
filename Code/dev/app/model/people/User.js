Ext.define('MobileJudge.model.people.User', {
	extend: 'Ext.data.Model',

	proxy: {
		type: 'api',
		url: '/api/users'
	},

	fields: [
		{ name: 'id',               type: 'int', convert: null },
		{ name: 'role',             type: 'int', convert: null },
		{ name: 'state',            type: 'int', convert: null },
		{ name: 'fullName',         type: 'string', persist: false },
		{ name: 'firstName',        type: 'string' },
		{ name: 'lastName',         type: 'string' },
		{ name: 'email',            type: 'string' },
		//{ name: 'password',         type: 'string' },
        { name: 'salutation',       type: 'string' },
		{ name: 'title',            type: 'string' },
		{ name: 'affiliation',      type: 'string' },
		{ name: 'location',         type: 'int', convert: null },
		/*{ name: 'oauth',            type: 'int', convert: null },
		{ name: 'oauthId',          type: 'string' },
		{ name: 'token',            type: 'string' },*/
		{ name: 'profileImgUrl',    type: 'string' },
		{ name: 'projectId',        type: 'int', convert: null },
		{ name: 'termId',           type: 'int', convert: null }
	]
});
