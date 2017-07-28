Ext.define('MobileJudge.view.settings.Model', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.settings',

	stores: {
		terms: {
			type: 'terms',
			storeId: 'terms',
			listeners: {
				load: 'onTermsLoaded'
			}
		},
		questions: {
			type: 'questions',
			storeId: 'questions'
		},
		templates4Term: {
			type: 'templates',
			storeId: 'templates4Term'
		}
	},

	formulas: {
		selectedTerm: {
			bind: {
				bindTo: '{termSelector.selection}',
				deep: true
			},
			get: function(term) {
				return term;
			},
			set: function(term) {
				if (!term.isModel) term = this.getStore('terms').getById(term);
				this.set('selectedTerm', term);
			}
		},
		status: {
			bind: {
				bindTo: '{selectedTerm}',
				deep: true
			},
			get: function(term) {
				var ret = {
					dirty: term ? term.dirty : false,
					valid: term && term.isModel ? term.isValid() : false,
					active: term && term.isModel ? term.get('active') : false,
					phantom: term ? term.phantom : false
				};
				ret.canSave = (ret.dirty || ret.phantom) && ret.valid;
				ret.canDelete = (!ret.dirty && !ret.active) || ret.phantom;
				ret.canCreate = (!ret.dirty && !ret.phantom);
				return ret;
			}
		}
	}

});
