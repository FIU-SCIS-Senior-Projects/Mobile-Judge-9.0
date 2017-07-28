Ext.define('MobileJudge.store.people.Students', {
	extend: 'Ext.data.Store',
	alias: 'store.students',

	model: 'MobileJudge.model.people.Student',

	proxy: {
		type: 'api',
		url: '/api/students'

	},

	remoteSort: true,
	remoteFilter: true,
    autoLoad: true,
	pageSize: 25,


});
