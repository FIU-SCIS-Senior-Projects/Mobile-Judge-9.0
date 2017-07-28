Ext.define('MobileJudge.view.authentication.Model', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.authentication',

	data: {
		userid: '',
        salutation: '',
		firstName: '',
		lastName: '',
		affiliation: '',
		title: '',
		password: '',
		email: '',
		oauth: null,
		persist: false
	}
});
