Ext.define('MobileJudge.view.email.Window', {
	extend: 'Ext.window.Window',
	alias: 'widget.emailwindow',

	autoShow: true,
	closeAction: 'hide',
	modal: true,
	maximizable: true,

	layout: 'fit',

	width: 200,
	height: 200,

	afterRender: function () {
		var me = this;

		me.callParent(arguments);

		me.syncSize();

		// Since we want to always be a %age of the viewport, we have to watch for
		// resize events.
		Ext.on(me.resizeListeners = {
			resize: me.onViewportResize,
			scope: me,
			buffer: 50
		});
	},

	onDestroy: function () {
		Ext.un(this.resizeListeners);

		this.callParent();
	},

	resizeEditor: function() {
		var editor = this.down('#editorContainer');

		if (editor) {
			CKEDITOR.instances.templateEditor.resize("100%", editor.getEl().dom.clientHeight);
		}
	},

	restore: function() {
		this.callParent(arguments);
		this.resizeEditor();
	},

	maximize: function() {
		this.callParent(arguments);
		this.resizeEditor();
	},

	onViewportResize: function () {
		this.syncSize();
	},

	close: function() {
		this.callParent(arguments);

		if (this.activeRecord) {
			if (this.activeRecord.phantom) this.activeRecord.destroy();
			if (this.activeRecord.dirty) this.activeRecord.reject();
			this.down('form').reset(true);
			this.activeRecord = null;
		}
	},

	syncSize: function () {
		var width = Ext.Element.getViewportWidth(),
			height = Ext.Element.getViewportHeight();

		// We use percentage sizes so we'll never overflow the screen (potentially
		// clipping buttons and locking the user in to the dialog).

		this.setSize(Math.floor(width * 0.9), Math.floor(height * 0.9));
		this.setXY([Math.floor(width * 0.05), Math.floor(height * 0.05)]);
	}
});
