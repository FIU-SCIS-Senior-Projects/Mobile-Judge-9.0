Ext.define('MobileJudge.view.email.EmailModel', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.email',

	stores: {
		outbox: {
			type: 'outbox',
			storeId: 'outbox'
		},

		templates: {
			type: 'templates',
			storeId: 'templates'
		},

		placeholders: {
			type: 'placeholders',
			storeId: 'placeholders'
		}
	}
});
