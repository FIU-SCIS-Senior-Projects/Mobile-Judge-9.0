Ext.define('MobileJudge.view.email.Controller', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.email',

	windows: {},
	templateEditor: null,

	init: function () {

		if (typeof CKEDITOR === 'undefined') {
			Ext.Loader.loadScript({
				url: '//cdn.ckeditor.com/4.5.3/full-all/ckeditor.js'
			});
		}

		this.setCurrentView('outbox');
	},

	onMenuClick: function (menu, item) {
		if (item && !Ext.isEmpty(item.routeId)) {
			this.setCurrentView(item.routeId, item.params);
		}
	},

	setCurrentView: function (view, params) {
		var contentPanel = this.getView().down('#contentPanel'),
			newView = null;

		//We skip rendering for the following scenarios:
		// * There is no contentPanel
		// * view xtype is not specified
		// * current view is the same
		if (!contentPanel || view === '' || (contentPanel.down() && contentPanel.down().xtype === view)) {
			return false;
		}

		if (params && params.openWindow) {
			if (newView = this.windows[view]) {
				if (params.windowCfg.autoShow) newView.show();
				return newView;
			}
			else {
				var cfg = Ext.apply({
					xtype: 'emailwindow',
					items: [
						Ext.apply({
							xtype: view
						}, params.targetCfg)
					]
				}, params.windowCfg);

				this.windows[view] = newView = Ext.create(cfg);
			}
		} else {
			Ext.suspendLayouts();

			contentPanel.removeAll(true);
			newView = contentPanel.add(
				Ext.apply({
					xtype: view
				}, params)
			);

			Ext.resumeLayouts(true);
		}

		return newView;
	},

	beforeDetailsRender: function (view) {
		var record = view.record ? view.record : {},
			id = record.get('id');

		Ext.Ajax.request({
			url: '/api/emails/' + id + '/body',
			disableCaching: false,
			success: function(res) {
				view.down('#mailBody').setHtml(res.responseText);
			}
		});

		view.down('#emailSubjectContainer').setData(record.data ? record.data : {});
		view.down('#userImage').setSrc(record.get('profileImgUrl'));
	},

	//#region ToolBar Buttons
	onBackBtnClick: function () {
		this.setCurrentView('outbox');
	},

	/*onResendBtnClick: function () {
		this.setCurrentView('outbox');
	},*/

	onNewEmailButtonClick: function () {
		this.setCurrentView('emailwizard', {
			openWindow: true,
			windowCfg: {
				title: 'Send Mail Wizard',
				autoShow: true
			}
		});
	},

	onNewPlaceholderButtonClick: function (button) {
		var rec = new MobileJudge.model.email.Placeholder(),
			grid = button.up('grid'),
			editor = grid.getPlugin('gridEditor');
		grid.getStore().insert(0, rec);
		if (editor) editor.startEdit(rec, 0);
	},

	onDeleteButtonClick: function(grid, rowIndex) {
		var store = grid.getStore(),
			record = store.getAt(rowIndex);

		if (record.phantom) {
			store.remove(record);
		}
		else Ext.Msg.confirm('Delete', 'Are you sure you want to delete the selected record?',
				function(choice) {
					if (choice !== 'yes') return;
					store.remove(record);
				});
	},

	onRefreshButtonClick: function(button) {
		var grid = button.up('grid'),
			store = grid.getStore();
		store.reload();
	},

	onNewTemplateButtonClick: function (button) {
		var rec = new MobileJudge.model.email.Template();
		this.openTemplateEditor('New Template', rec).store = button.up('grid').getStore();
	},

	onCloneButtonClick: function(grid, rowIndex) {
		var store = grid.getStore(),
			rec = store.getAt(rowIndex);

		this.openTemplateEditor('New Cloned Template', new MobileJudge.model.email.Template({
			name: rec.get('name'),
			subject: rec.get('subject'),
			body: rec.get('body')
		})).store = store;
	},
	//#endregion

	onGridEditorCancelEdit: function (editor, context) {
		if (context.record.phantom) {
			context.grid.getStore().remove(context.record);
		}
	},


	onEmailDoubleClick: function (grid, record) {
		this.setCurrentView('emaildetails', {record: record});
	},

	//#region Template Methods
	openTemplateEditor: function(title, record) {
		var window = this.setCurrentView('templateeditor', {
			openWindow: true,
			windowCfg: {
				autoShow: false
			}
		});

		window.setTitle(title);
		window.down('form').loadRecord(record);
		if (CKEDITOR.instances.templateEditor) {
			CKEDITOR.instances.templateEditor.setData(record.get('body'), {
				callback: function() {
					this.resetDirty();
					this.resetUndo();
				}
			});
		}
		window.activeRecord = record;
		window.show();
		return window;
	},

	onTemplateDoubleClick: function (grid, record) {
		this.openTemplateEditor('Edit Template: ' + record.get('id'), record);
	},

	afterTemplateRender: function(view) {
		var me = this;

		CKEDITOR.replace('templateEditor', {
			resize_enabled: false,
			removePlugins: 'elementspath',
			skin: 'office2013,/resources/skins/office2013/',
			extraPlugins: 'placeholder,autoembed,autolink,lineutils,menu,menubutton,richcombo,tableresize' //docprops,
		}).on('instanceReady', function (e) {
			e.editor.resize("100%", view.down('#editorContainer').getEl().dom.clientHeight);
			me.templateEditor = e.editor;
			var rec = view.getRecord();
			if (rec) {
				me.templateEditor.setData(rec.get('body'), {
					callback: function() {
						this.resetDirty();
						this.resetUndo();
					}
				});
			}
		});
	},

	onInsertPlaceHolderChange: function(field, newValue) {
		if (!Ext.isEmpty(newValue) && typeof CKEDITOR !== 'undefined')
			this.templateEditor.insertHtml("[[" + newValue + "]]");
		field.setValue('');
	},

	onTemplateSaveClick: function(button) {
		var win = button.up('window'),
			form = button.up('form'),
			active = win.activeRecord;

		if (!active || (!form.isDirty() && !this.templateEditor.checkDirty())) {
			win.activeRecord = null;
			win.close();
			return;
		}
		if (form.isValid()) {
			var needToAdd = active.phantom,
				body = this.templateEditor.getData();
			form.updateRecord(active);
			active.set('body', body);
			if (needToAdd && win.store) win.store.add(active);
			win.activeRecord = null;
			win.close();
		}
	},

	onTemplateDiscardClick: function (button) {
		var win = button.up('window');
		if (win) win.close();
	}
	//#endregion

});
