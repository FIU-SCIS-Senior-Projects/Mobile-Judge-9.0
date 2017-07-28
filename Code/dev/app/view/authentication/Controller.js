Ext.define('MobileJudge.view.authentication.Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.authentication',

	loginInProcess: false,

	init: function (view) {
		OAuth.setOAuthdURL("http://mj.cis.fiu.edu/oauthd");
		OAuth.initialize('uSO6GBdeGO_y9Bdas5jNHTLxBd8');

		var model = view.getViewModel();
		if (model) Ext.each([
			'activeTerm',
			'userName',
			'profilePic',
			'title',
			'affiliation',
			'email'
		], function(key) {
			model.set(key, localStorage.getItem(key));
		});
	},

	onLoginRender: function(view) {
		var me = this, win = view.mask ? view : Ext.Viewport;

		$('.btn-oauth').click(function(e) {
			e.preventDefault();
			var cls = e.currentTarget.className.split(' '), provider = cls.pop();
			provider = (provider == 'x-btn-over' ? cls.pop() : provider).split('-')[2];

			if (me.loginInProcess) return;
			me.loginInProcess = true;
			OAuth.popup(provider, function(err, res) {
				if (err) {
					me.loginInProcess = false;
					Ext.Msg.alert("Error", Ext.isString(err) ? err : err.message);
				}
				else res.me().done(function (data) {
					console.log(data);
					me.requestToken(win, {
						provider: provider,
						id: data.id,
						email: data.email
					});
				});
			});
		});
	},

	onLoginButton: function (button) {
		var me = this,
			model = this.getViewModel();

		if (me.loginInProcess) return;
		me.loginInProcess = true;
		me.requestToken(button.up('lockingwindow') || Ext.Viewport, {
			email: model.data.email,
			password: model.data.password
		});
	},

	requestToken: function(win, data) {
		var me = this;

		win.mask();
		Ext.Ajax.request({
			url: '/api/login',
			method: 'POST',
			jsonData: data,
			callback: function() {
				me.loginInProcess = false;
			},
			success: function(resp) {
				var obj = Ext.decode(resp.responseText);
				win.unmask();
				if (!obj.result) {
					Ext.Msg.alert("Error", obj.error);
				}
				else {
					Ext.Object.each(obj.profile, localStorage.setItem, localStorage);
					localStorage.setItem('token', obj.token);
					Ext.GlobalEvents.fireEvent('login');
				}
			}
		});
	},

	onRegisterRender: function() {
		var me = this, model = me.getViewModel();

		model.set('profilePic', null);
		localStorage.removeItem('profilePic');

		$('.btn-oauth').click(function(e) {
			e.preventDefault();
			var cls = e.currentTarget.className.split(' '), provider = cls.pop();
			provider = (provider == 'x-btn-over' ? cls.pop() : provider).split('-')[2];
			OAuth.popup(provider, function(err, res) {
				if (err) {
					//Ext.Msg.alert("Error", Ext.isString(err) ? err : err.message);
				}
				else res.me().done(function (data) {
					var oauth = model.get('oauth') || {};

					if (data.name) {
						model.set('userName', data.name);
						var s = data.name.split(' ');
						if (s.length > 1) {
							model.set('firstName', s[0] || model.get('firstName'));
							model.set('lastName', s.pop() || model.get('lastName'));
						}
					}
					model.set('firstName', data.firstname || model.get('firstName'));
					model.set('lastName', data.lastname || model.get('lastName'));
					model.set('profilePic', data.avatar || model.get('profilePic'));

					//if (data.email) model.set('email', data.email);

					oauth[provider] = data.id;

					model.set('oauth', oauth);
					me.getReferences()['link'+provider].setDisabled(true);
				});
			});
		});
	},

	onSetPageOne: function(btn) {
		var refs = this.getReferences(),
			wzd = (refs && refs.regWizard) || btn.up('register');
		wzd.setActiveItem(0);
	},

	onSetPageTwo: function(btn) {
		var refs = this.getReferences(),
			wzd = (refs && refs.regWizard) || btn.up('register');
		wzd.setActiveItem(1);
	},

	onSetPageThree: function(btn) {
		var refs = this.getReferences(),
			wzd = (refs && refs.regWizard) || btn.up('register');
		wzd.setActiveItem(2);
	},

	onDoneRegister: function(btn) {
		var me = this, model = me.getViewModel(),
			grid = me.getReferences().gridConflicts,
			isPhone = Ext.manifest.toolkit === 'modern',
			win = isPhone ? btn.up('register') : Ext.getBody(),
			conflicts = isPhone ? grid.getSelections() : grid.getSelection(),
			userInfo = {
				id: localStorage.getItem('userId'),
				email: model.get('email'),
				firstName: model.get('firstName'),
				lastName: model.get('lastName'),
				fullName: model.get('userName'),
                salutation: model.get('salutation'),
				affiliation: model.get('affiliation'),
				title: model.get('title'),
				password: model.get('password'),
				profilePic: model.get('profilePic'),
				oauth: model.get('oauth'),
				conflicts: conflicts.map(function(r) { return r.get('id'); })
			};

		win.mask();
		Ext.Ajax.request({
			url: '/api/register',
			method: 'POST',
			jsonData: userInfo,
			callback: function() {
				win.unmask();
			},
			failure: function(resp) {
				Ext.Msg.alert("Error", resp.responseText);
			},
			success: function(resp) {
				var obj = Ext.decode(resp.responseText);
				localStorage.removeItem('userId');
				if (!obj.result) {
					Ext.Msg.alert("Success", obj.error, function(){
						me.redirectTo('login');
					});
				}
				else {
					Ext.Object.each(obj.profile, localStorage.setItem, localStorage);
					localStorage.setItem('token', obj.token);
					Ext.GlobalEvents.fireEvent('login');
				}

                window.location.reload();
			}
		});
	},

	onReset: function(btn) {
		var me = this, model = me.getViewModel(),
			isPhone = Ext.manifest.toolkit === 'modern',
			win = isPhone ? btn.up('passwordreset') : Ext.getBody(),
			userInfo = {
				email: model.get('email')
			};

		win.mask();
		Ext.Ajax.request({
			url: '/api/reset',
			method: 'POST',
			jsonData: userInfo,
			callback: function() {
				win.unmask();
			},
			failure: function(resp) {
				Ext.Msg.alert("Error", resp.responseText);
			},
			success: function(resp) {
				var obj = Ext.decode(resp.responseText);
				Ext.Msg.alert(!obj.result ? 'Error' : 'Success', obj.error, function(){
					me.redirectTo('login');
				});
			}
		});
	},

	onChangePassword: function(btn) {
		var me = this, model = me.getViewModel(),
			isPhone = Ext.manifest.toolkit === 'modern',
			win = isPhone ? btn.up('passwordchange') : Ext.getBody(),
			userInfo = {
				id: localStorage.getItem('userId'),
				newPassword: model.get('newPassword'),
				confirmPassword: model.get('confirmPassword')
			};

		win.mask();
		Ext.Ajax.request({
			url: '/api/reset',
			method: 'PUT',
			jsonData: userInfo,
			callback: function() {
				win.unmask();
			},
			failure: function(resp) {
				Ext.Msg.alert("Error", resp.responseText);
			},
			success: function(resp) {
				var obj = Ext.decode(resp.responseText);
				localStorage.removeItem('userId');
				if (!obj.result) {
					Ext.Msg.alert("Success", obj.error, function() {
						me.redirectTo('login');
					});
				}
				else {
					Ext.Object.each(obj.profile, localStorage.setItem, localStorage);
					localStorage.setItem('token', obj.token);
					Ext.GlobalEvents.fireEvent('login');
				}
                window.location.reload();
			}



		});

        window.location.reload();
	}
});
