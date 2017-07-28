Ext.define('MobileJudge.view.settings.Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.settings',

	model: null,

	init: function(view) {
		this.model = view.getViewModel();
	},

	onQuestionCancelEdit: function (editor, context) {
		if (context.record.phantom) {
			context.grid.getStore().remove(context.record);
		}
	},

	onNewQuestionButtonClick: function(button) {
		var rec = new MobileJudge.model.settings.Question(),
			grid = button.up('grid'),
			editor = grid.getPlugin('gridEditor');
		grid.getStore().insert(0, rec);
		if (editor) editor.startEdit(rec, 0);
	},

	onRefreshButtonClick: function(button) {
		var grid = button.up('grid'),
			store = grid.getStore();
		store.reload();
	},

	onQuestionDelete: function(grid, rowIndex) {
		var store = grid.getStore();
		Ext.Msg.confirm('Delete', 'Are you sure you want to delete the selected record?',
				function(choice) {
					if (choice !== 'yes') return;
					store.removeAt(rowIndex);
				}, this);
	},

	onTermsLoaded: function() {
		var combo = this.getReferences().termSelector,
			rec = combo.getStore().findRecord('active', true);

		combo.setValue(rec.get('id'));
	},

	onNewTermClick: function() {
		var me = this,
			combo = me.getReferences().termSelector,
			store = me.model.getStore('terms'),
			now = new Date(),
			month = now.getMonth(),
			rec = new MobileJudge.model.settings.Term({
				name: 'New Term', //(month < 4 ? 'Spring ' : month < 8 ? 'Summer ' : 'Fall ') + now.getFullYear(),
				start: now,
				end: now,
				deadline: now
			});

		store.rejectChanges();
		store.insert(0, rec);
		combo.setValue(rec);
	},

	onSaveTermClick: function() {
		var me = this,
			form = me.getReferences().termForm,
			store = me.model.getStore('terms'),
			rec = me.model.get('selectedTerm'),
			changed = false;

		if (!form.isValid()) return;
		if (rec.modified && rec.modified.active === false && rec.get('active')) changed = rec.get('name');
		store.sync({
			success: function() {
				if (changed) Ext.GlobalEvents.fireEvent('termChanged', changed);
			}
		});
	},

	onMakeActiveTerm: function() {
		var me = this, rec = me.model.get('selectedTerm');
		rec.set('active', true);
		me.onSaveTermClick();
	},

	onDeleteTermClick: function() {
		var me = this,
			store = me.model.getStore('terms'),
			rec = me.model.get('selectedTerm');
		Ext.Msg.confirm('Delete', 'Are you sure you want to delete the selected record?',
				function(choice) {
					if (choice !== 'yes') return;
					var sync = !rec.phantom;
					store.remove(rec);
					if (sync) store.sync();
					me.onTermsLoaded(store);
				}, this);
	}

});
