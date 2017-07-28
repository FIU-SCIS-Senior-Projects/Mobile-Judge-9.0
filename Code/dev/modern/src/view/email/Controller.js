Ext.define('MobileJudge.view.email.Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.email',

	actionsVisible: false,

	/*onChangeFilter: function (sender) {
		console.log('Show ' + sender.getItemId());
		this.hideActions();
		//this.callParent(arguments);
	},

	onComposeMessage: function () {
		this.doCompose();
	},

	onComposeTo: function (sender) {
		var rec = sender.getRecord();
		this.doCompose(rec.get('name'));
	},

	onSelectMessage: function (sender, record) {
		//view message
	},

	hideActions: function () {
		var actions = this.actions;

		if (actions) {
			actions.hide();
		}
		this.actionsVisible = false;
	},

	showActions: function () {
		var me = this,
			actions = me.actions;

		if (!actions) {
			me.actions = actions = Ext.create({
				xtype: 'emailactions',
				defaults: {
					scope: me
				},
				enter: 'right',
				exit: 'right',
				top: 0,
				hidden: true,
				left: null,
				height: '100%',
				hideOnMaskTap: true,
				width: 250
			});

			Ext.Viewport.add(actions);
		}

		actions.show();
		me.actionsVisible = true;
	},*/

	closeComposer: function () {
		var me = this,
			composer = me.composer,
			view = me.getView(),
			viewModel = me.getViewModel();

		if (composer) {
			view.remove(composer);
			me.composer = null;

			viewModel.set('composing', false);
		}
	},

	onPlusButtonTap: function () {
		if (!this.actionsVisible) {
			this.doCompose();
		}
	},

	doCompose: function (to) {
		var me = this,
			composer = me.composer,
			view = me.getView(),
			viewModel = me.getViewModel();
			//toField;

		//me.hideActions();

		if (!composer) {
			//viewModel.set('toField', '');
			/*viewModel.set('template', null);*/

			me.composer = composer = view.add({
				xtype: 'compose',
				flex: 1
			});

			/*if (to) {
				toField = me.lookupReference('toField');
				toField.setValue(to);
			}*/

			viewModel.set('composing', true);
		}
	},

	onCloseMessage: function () {
		this.closeComposer();
	},

	onSendMessage: function (win) {
		var me = this, model = me.getViewModel(),
			address = model.get('toField'),
			template = model.get('template');

		var error = !/^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+\/=?\^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/.test(address)
						? 'Invalid email address'
						: !template || !template.isModel || Ext.isEmpty(template.id)
							? 'Please select a template'
							: false;

		if (error) {
			Ext.Msg.alert('Error', error);
		}
		else {
			win.mask();
			Ext.Ajax.request({
				url: '/api/emails',
				method: 'POST',
				jsonData: {
					templateId: template.id,
					importJudges: model.get('importJudges'),
					emails: [{ address: address }]
				},
				callback: function() {
					win.unmask();
					me.closeComposer();
				},
				success: function() {
					model.getStore('outbox').reload();
				}
			});
		}
	},


	/*onLongPressCompose: function (e) {
		//this.showActions();
	},
	onSwipe: function (event) {
		if (event.direction === 'left') {
			this.showActions();
		}
	},*/

	onTemplateChange: function (field, newValue) {
		var me = this, model = me.getViewModel();
		if (newValue && newValue.isModel) {
			Ext.Ajax.request({
				url: '/api/templates/' + newValue.id + '/preview',
				disableCaching: false,
				success: function (res) {
					model.set('preview', Ext.decode(res.responseText));
					setTimeout(me.resizePreview, 500);
				}
			});
		}
	},

	resizePreview: function() {
		var iframe = $('#previewFrame'),
			initialWidth = iframe.width();

		var newWidth, newHeight;

		var width = iframe.width();
		var height = iframe.height();
		var parentWidth = iframe.parent().width();
		var parentHeight = iframe.parent().height();

		var aspect = width / height;
		var parentAspect = parentWidth / parentHeight;

		if (aspect > parentAspect) {
			newWidth = parentWidth;
			newHeight = newWidth / aspect;
		} else {
			newHeight = parentHeight;
			newWidth = newHeight * aspect;
		}

		var scaleFactor = newWidth/initialWidth;
		iframe.css({'-webkit-transform': 'scale('+scaleFactor+')'});
	}
});
