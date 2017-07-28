Ext.define('MobileJudge.view.judges.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.judge',

	model: null,

	init: function(view) {
		this.model = view.getViewModel();
	},

	onQuestionsLoaded: function(store, records) {
		var questions = [];

		records.forEach(function(q) {
			if (q.get('enabled')) questions.push({
				id: q.get('id'),
				text: q.get('text'),
				value: q.get('value')
			});
		});

		this.model.set('questions', questions);
	},

	onStudentsRefresh: function() {
		this.model.getStore('questions').reload();
		this.model.getStore('students').reload();
		this.model.getStore('grades').reload();
	},

	onGrade: function(grid, rowIndex, colIndex, item, e, record) {
		this.startGrading(this.getReferences().wizard, record);
	},

	onItemTap: function(view, index, target, record) {
		if (record.get('accepted') != record.get('total')) {
			this.startGrading(view.up('judgehome'), record);
		}
	},

	startGrading: function(wizard, record) {
		var me = this, model = me.model;
		model.set('student', record);
		model.set('index', 0);
		wizard.setActiveItem(1);
	},

	onPrevBtn: function(btn) {
		var me = this, model = me.model;
		if (!model.get('atStart')) {
			model.set('index', model.get('index') - 1);

			var scroll = btn.up('judgequestion').getScrollable();
			if (scroll) scroll.scrollTo(null, 0);
		}
		else {
			var refs = me.getReferences(),
				wizard = (refs && refs.wizard) || btn.up('judgehome');
			wizard.setActiveItem(0);
		}
	},

	onNextBtn: function(btn) {
		var me = this, model = me.model,
			refs = me.getReferences(),
			wizard = (refs && refs.wizard) || btn.up('judgehome');

		if (!model.get('atEnd')) {
			model.set('index', model.get('index') + 1);

			var scroll = btn.up('judgequestion').getScrollable();
			if (scroll) scroll.scrollTo(null, 0);
		}
		else {
			var student = model.get('student'),
				studentId = student.get('id'),
				questions = model.get('questions'),
				grades = model.getStore('grades'),
				batch = [];

			questions.forEach(function(q) {
				var grade = grades.getById(studentId + '-' + q.id);
				batch.push({
					studentId: studentId,
					questionId: q.id,
					value: grade.get('value'),
					comment: grade.get('comment') || ''
				});
			});

			btn.setDisabled(true);
			Ext.Ajax.request({
				url: '/api/grades',
				method: 'PUT',
				jsonData: batch,
				callback: function() {
					btn.setDisabled(false);
				},
				failure: function(resp) {
					Ext.Msg.alert("Error", resp.responseText);
				},
				success: function() {
					student.set('graded', student.get('total'));
					wizard.setActiveItem(0);
				}
			});
		}
	}
});
