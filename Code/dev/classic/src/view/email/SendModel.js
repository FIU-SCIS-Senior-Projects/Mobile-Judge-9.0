Ext.define('MobileJudge.view.email.SendModel', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.sendemail',

	stores: {
		emaillists: {
			type: 'emaillists',
			storeId: 'emaillists',
			listeners: {
				load: 'onSelectEmailsLoaded'
			}
		},

		students: {
			type: 'contacts',
			storeId: 'studentcontacts',
			listeners: {
				load: 'onStudentsLoaded'
			}
		},

		judges: {
			type: 'contacts',
			storeId: 'judgecontacts',
			listeners: {
				load: 'onJudgesLoaded'
			}
		},

		extraEmails: {
			type: 'array',
			storeId: 'extraEmails',
			model: 'MobileJudge.model.email.Contact',
			pageSize: 0
		}
	},

	data: {
		atStart: true,
		atEnd: false,

		filters: [],
		extraEmailText: '',

		selectedStudents: [],
		selectedJudges: [],
		selectedExtra: [],

		template: '',
		preview: {
			subject: '',
			body: ''
		}
	},

	formulas: {
		caption: function(get) { return get('atEnd') ? 'Send' : 'Next'; },
		studentsSelection: function(get) { return get('selectedStudents'); },
		judgesSelection: function(get) { return get('selectedJudges'); },
		extraSelection: function(get) { return get('selectedExtra'); },
		importJudges: {
			bind: {
				id: '{template}'
			},
			get: function(data) {
				if (Ext.isEmpty(data.id)) return false;
				var template = Ext.getStore('templates').getById(data.id);
				if (!template) return false;
				return template.get('body').indexOf('[[accept]]') >= 0;
			}
		},
		extraEmailArray: {
			bind: {
				extraEmails: '{extraEmailText}'
			},
			get: function(data) {
				var reg = /^((?:[\w\.\-_]+)?\w+@[a-zA-Z][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z])(?:\,([^\,\n\r]*))?(?:\,(\w*))?$/igm;
				var res = [], text = data.extraEmails;

				var match = reg.exec(text);
				while (match != null) {
					var firstName = match[2] || '',
						lastName = match[3] || '';

					res.push({
						firstName: firstName,
						lastName: lastName,
						fullName: firstName + ' ' + lastName,
						email: match[1]
					});
					match = reg.exec(text);
				}

				return res;
			}
		},
		canMoveNext: {
			bind: {
				atStart: '{atStart}',
				atEnd: '{atEnd}',
				filters: '{filters}',
				extraEmails: '{extraEmailArray}',
				template: '{template}',
				selectedStudents: '{selectedStudents}',
				selectedJudges: '{selectedJudges}',
				selectedExtra: '{selectedExtra}'
			},
			get: function (data) {
				if (data.atStart) return data.filters.length > 0 || data.extraEmails.length > 0;
				if (data.atEnd) return !Ext.isEmpty(data.template);
				return (data.selectedStudents.length + data.selectedJudges.length + data.selectedExtra.length) > 0;
			}
		}
	}
});
