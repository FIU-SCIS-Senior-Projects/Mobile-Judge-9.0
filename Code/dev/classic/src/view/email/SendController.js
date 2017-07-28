Ext.define('MobileJudge.view.email.SendController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.sendemail',

	requires: [
		'Ext.util.DelayedTask'
	],

	selectListRender: false,
	selectListLoaded: false,
	selectListTask: null,
	rootCheckBox: null,
	model: null,

	init: function(view) {
		this.model = view.getViewModel();
		view.on('show', this.onEmailWizardShow, this);
	},

	onEmailWizardShow: function(wnd) {
		var wzd = wnd.child('emailwizard');
		if (!wzd) return;

		var model = this.model;
		while(!model.get('atStart')) this.navigate(null, wzd, 'prev');

		var table = Ext.query('.selectemail table', false)[0];
		table.query('button.selected', false).forEach(function(btn) {
			btn.removeCls('selected');
		});

		table.query('input[type="checkbox"]').forEach(function(chk) {
			chk.indeterminate = chk.checked = false;
		});

		model.set('filters', []);
		model.set('extraEmailText', '');

		model.set('template', '');
		model.set('preview', {subject:'', body:''});

		model.set('atEnd', false);
	},

	setupTask: function() {
		var task = this.selectListTask || new Ext.util.DelayedTask(this.setupListeners, this);
		task.delay(250);
	},

	onSelectEmailsLoaded: function() {
		this.selectListLoaded = true;
		if (this.selectListRender) this.setupTask();
	},

	onSelectEmailsAfterRender: function() {
		this.selectListRender = true;
		if (this.selectListLoaded) this.setupTask();
	},

	onStudentsLoaded: function(store, records) {
		this.model.set('selectedStudents', records);
	},

	onJudgesLoaded: function(store, records) {
		this.model.set('selectedJudges', records);
	},

	onExtraSelectionChange: function(store, records) {
		this.model.set('selectedExtra', records);
	},

	setupListeners: function() {
		var me = this,
			model = this.model;

		if (!me.selectListLoaded || !me.selectListRender || me.rootCheckBox) return;

		var BtnNode = function(btn, father, hdrFather) {
			var button = btn, parent = father, header = hdrFather;

			Object.defineProperty(this, 'indeterminate', {
				value: false,
				writable: false
			});

			Object.defineProperty(this, 'checked', {
				get: function() {
					return button.hasCls('selected');
				},
				set: function(value) {
					var old = this.checked;
					button[value ? 'setCls' : 'removeCls']('selected');
					if (old != value) {
						parent.update(); header.update();
						var filters = model.get('filters').reduce(function(dic, i) {
								dic[i] = true;
								return dic;
							}, {});
						delete filters[button.dom.dataset.filter];
						if (value) filters[button.dom.dataset.filter] = true;

						model.set('filters', Object.keys(filters));
						model.notify();
					}
				}
			});

			btn.on('click', function(e) {
				e.preventDefault();
				if (e.type !== 'keydown' && e.button) return;
				this.checked = !this.checked;
			}, this);
		};

		var ChkNode = function(chk, father) {
			var checkbox = chk.dom, parent = father, children = [],
				setChildren = function(value) {
					children.forEach(function(child){
						child.checked = value;
					});
				};

			Object.defineProperty(this, 'indeterminate', {
				get: function () {
					return checkbox.indeterminate;
				}
			});
			Object.defineProperty(this, 'checked', {
				get: function() {
					return checkbox.checked && !checkbox.indeterminate;
				},
				set: function(value) {
					checkbox.checked = value;
					checkbox.indeterminate = false;
					setChildren(value);
				}
			});

			this.addChkChild = function(chk) {
				var child = new ChkNode(chk, this);
				children.push(child);
				return child;
			};

			this.addBtnChild = function(btn, header) {
				var child = new BtnNode(btn, this, header);
				children.push(child);
				header.children.push(child);
				return child;
			};

			this.update = function() {
				var selected = 0, weak = 0;

				for(var i = 0; i < children.length; i++) {
					if (children[i].checked) selected++;
					if (children[i].indeterminate) weak++;
				}

				checkbox.indeterminate = (checkbox.checked = selected > 0 || weak > 0) && (selected != children.length);
				if (parent) parent.update();
			};

			chk.on('change', function(e, target) {
				if (e.type !== 'keydown' && e.button) return;
				setChildren(target.checked);
				if (parent) parent.update();
			}, this);

			this.children = children;
		};

		var table = Ext.query('.selectemail table', false)[0], cols = [];

		table.query('thead input[type="checkbox"]', false).forEach(function(chk) {
			cols.push(!me.rootCheckBox
					? (me.rootCheckBox = new ChkNode(chk))
					: me.rootCheckBox.addChkChild(chk));
		});

		table.query('tbody tr', false).forEach(function(tr) {
			var term = null;

			tr.query('td', false).forEach(function(td, i){
				var chk = td.child('input[type="checkbox"]');
				if (!term) { term = me.rootCheckBox.addChkChild(chk); }
				else {
					var btnParent = term.addChkChild(chk);
					td.query('button', false).forEach(function(btn){
						btnParent.addBtnChild(btn, cols[i]);
					});
				}
			});
		});
	},

	onNextClick: function(button) {
		var me = this, panel = button.up('panel');

		if (me.model.get('atStart')) {
			var students = me.model.getStore('students'),
				judges = me.model.getStore('judges'),
				extra = me.model.getStore('extraEmails');

			var filters = {}, stdParams = {}, judParams = {};

			me.model.get('filters').forEach(function(f){
				var fs = f.split(','),
					role = filters[fs[0]] || {},
					term = role[fs[1]] || [];
				term.push(parseInt(fs[2]));
				role[fs[1]] = term;
				filters[fs[0]] = role;
			});

			Ext.Object.each(filters, function(role, terms) {
				var params = role == '1' ? stdParams : judParams;
				params.role = parseInt(role);
				params['$or'] = [];
				Ext.Object.each(terms, function(termId, states){
					params['$or'].push({
						termId: parseInt(termId),
						state: {
							'$in': states
						}
					});
				});
			});

			students.removeAll(); judges.removeAll(); extra.removeAll();

			if (!Ext.Object.isEmpty(stdParams)) students.load({ params: { 'filter': Ext.encode(stdParams) } });
			if (!Ext.Object.isEmpty(judParams)) judges.load({ params: { 'filter': Ext.encode(judParams) } });

			var extraEmails = this.model.get('extraEmailArray');
			if (extraEmails.length > 0)	{
				extra.loadData(extraEmails);
				me.model.set('selectedExtra', extra.getData().items);
			}

			me.model.notify();
		}
		else if (me.model.get('atEnd')) {
			var template = this.model.get('template');
			if (Ext.isEmpty(template)) return;
			var	getRecord = function(r) {
					return r.phantom ? {
						//userId: 0 : r.get('id'),
						firstName: r.get('firstName'),
						lastName: r.get('lastName'),
						address: r.get('email')
					} : {
						//userId: r.get('id'),
						address: r.get('email')
					};
				},
				batch = {
					templateId: template,
					importJudges: this.model.get('importJudges'),
					emails: Ext.Array.merge(
						this.model.get('selectedStudents').map(getRecord),
						this.model.get('selectedJudges').map(getRecord),
						this.model.get('selectedExtra').map(getRecord)
					)
				};

			Ext.getBody().mask();
			panel.up('window').close();
			Ext.Ajax.request({
				url: '/api/emails',
				method: 'POST',
				jsonData: batch,
				callback: function() {
					Ext.getBody().unmask();
				},
				success: function(res) {
					Ext.getStore('outbox').reload();
				}
			});
			return;
		}

		this.model.set('atStart', false);
		this.navigate(button, panel, 'next');
	},

	onPreviousClick: function(button) {
		var panel = button.up('panel');
		this.model.set('atEnd', false);
		this.navigate(button, panel, 'prev');
	},

	navigate: function(button, panel, direction) {
		var layout = panel.getLayout(),
			progress = this.lookupReference('progress'),
			model = this.model,
			progressItems = progress.items.items,
			item, i, activeItem, activeIndex;

		layout[direction]();

		activeItem = layout.getActiveItem();
		activeIndex = panel.items.indexOf(activeItem);

		for (i = 0; i < progressItems.length; i++) {
			item = progressItems[i];

			if (activeIndex === item.step) {
				item.setPressed(true);
			}
			else {
				item.setPressed(false);
			}

			// IE8 has an odd bug with handling font icons in pseudo elements;
			// it will render the icon once and not update it when something
			// like text color is changed via style addition or removal.
			// We have to force icon repaint by adding a style with forced empty
			// pseudo element content, (x-sync-repaint) and removing it back to work
			// around this issue.
			// See this: https://github.com/FortAwesome/Font-Awesome/issues/954
			// and this: https://github.com/twbs/bootstrap/issues/13863
			if (Ext.isIE8) {
				item.btnIconEl.syncRepaint();
			}
		}

		activeItem.focus();

		// beginning disables previous
		if (activeIndex === 0) {
			model.set('atStart', true);
		}

		// wizard is 4 steps. Disable next at end.
		if (activeIndex === 2) {
			model.set('atEnd', true);
		}
	},

	onTemplateChange: function(field, newValue) {
		var model = this.model;
		if (!Ext.isEmpty(newValue)) {
			Ext.Ajax.request({
				url: '/api/templates/' + newValue + '/preview',
				disableCaching: false,
				success: function(res) {
					model.set('preview', Ext.decode(res.responseText));
				}
			});
		}
	}
});
