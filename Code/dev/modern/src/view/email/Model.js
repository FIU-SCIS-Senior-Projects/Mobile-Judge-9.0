Ext.define('MobileJudge.view.email.Model', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.emailmobile',

	stores: {
		outbox: {
			type: 'outbox',
			storeId: 'outbox'
		},

		templates: {
			type: 'templates',
			autoSync: false,
			storeId: 'templates'
		}
	},

	formulas: {
		previewMobile: {
			bind: {
				bindTo: '{preview.body}',
				deep: true
			},
			get: function(html) {
				return 'data:text/html;charset=UTF-8,' + encodeURIComponent(html);
			}
		},
		importJudges: {
			bind: {
				bindTo: '{template}',
				deep: true
			},
			get: function(template) {
				if (!template || !template.isModel) return false;
				template = this.getStore('templates').getById(template.id);
				if (!template) return false;
				return template.get('body').indexOf('[[accept]]') >= 0;
			}
		}
	}
});
