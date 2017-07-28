Ext.define('MobileJudge.view.judges.Model', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.judge',

	data: {
		questions: [],

		index: 0,
		student: {}
	},

	stores: {
		questions: {
			type: 'questions',
			storeId: 'activeQuestions',
			listeners: {
				load: 'onQuestionsLoaded'
			}
		},
		students: {
			type: 'judgeStudents',
			storeId: 'myStudents'
		},
		grades: {
			type: 'judgeGrades',
			storeId: 'myGrades'
		}
	},

	formulas: {
		progress: {
			bind: {
				total: '{student.total}',
				index: '{index}'
			},
			get: function(data) {
				return (data.index + 1) + ' of ' + data.total;
			}
		},
		atStart: {
			bind: {
				bindTo: '{index}'
			},
			get: function(index) {
				return index == 0;
			}
		},
		atEnd: {
			bind: {
				total: '{student.total}',
				index: '{index}'
			},
			get: function (data) {
				return (data.index + 1) >= data.total;
			}
		},
		next: {
			bind: {
				bindTo: '{atEnd}'
			},
			get: function(atEnd) {
				return {
					text: atEnd ? 'Submit' : 'Next',
					icon: 'x-fa fa-' + (atEnd ? 'check' : 'angle-right'),
					ui: atEnd ? 'soft-green' : 'soft-blue'
				};
			}
		},
		question: {
			bind: {
				index: '{index}',
				questions: '{questions}'
			},
			get: function(data) {
				return data.questions[data.index];
			}
		},
		grade: {
			bind: {
				bindTo: '{student.id}-{question.id}'
			},
			get: function(id) {
				return this.getStore('grades').getById(id);
			}
		},
		gradeDisplay: {
			bind: {
				grade: '{grade.value}',
				max: '{question.value}',
				deep: true
			},
			get: function(data) {
				return data.grade + ' / ' + data.max;
			}
		},
		isAccepted: {
			bind: {
				bindTo: '{grade}',
				deep: true
			},
			get: function(grade) {
				return grade && grade.isModel && grade.get('state') == 1;
			}
		}
	}
});
