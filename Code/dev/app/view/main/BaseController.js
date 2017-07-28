Ext.define('MobileJudge.view.main.BaseController', {
	extend: 'Ext.app.ViewController',

	listen: {
		global: {
			login: 'onLogIn',
			logout: 'onLogout',
			termChanged: 'onActiveTermChanged',
			navTreeReady: 'onNavTreeReady',
			requestError: 'onRequestError'
		},
		controller: {
			'#': {
				unmatchedroute: 'onRouteChange'
			}
		}
	},

	routes: {
		':node': 'onRouteChange'
	},

	stores: [
		'NavigationTree'
	],

	menuStore: null,
	model: null,
	profile: [
		'activeTerm',
		'userName',
		'profilePic',
		'title',
		'affiliation',
		'email'
	],
	commonPages: [
		'login',
		'register',
		'passwordreset',
		'passwordchange',
		'lockscreen',
		'page404',
		'page500'
	],

	init: function(view) {
		this.model = view.getViewModel();
		this.loadProfileModel();
		this.menuStore = Ext.getStore('NavigationTree');
	},

	isMenuLoaded: function() {
		return (this.menuStore.isLoaded() && !this.menuStore.isLoading());
	},

	onNavigationTreeSelectionChange: function (tree, node) {
		var to = node && (node.get('routeId') || node.get('viewType'));
		if (to) this.redirectTo(to);
	},

	onRouteChange: function (id) {
		var token = localStorage.getItem('token'),
			isLockScreen = Ext.Array.contains(this.commonPages, id);

		if (Ext.isEmpty(token) && !isLockScreen) {
			localStorage.setItem('redirect', id);
			this.redirectTo('login');
		}
		else {
			if (!this.isMenuLoaded() && !isLockScreen) {
				this.menuStore.load();
			}
			else if ((id == 'register' || id == 'passwordchange')
					&& !localStorage.getItem('userId')) {
				this.redirectTo(Ext.isEmpty(token) ? 'login' : 'home');
			}
			else this.setCurrentView(id);
		}
	},

	loadProfileModel: function() {
		var me = this;
		Ext.each(me.profile, function(key) {
			me.model.set(key, localStorage.getItem(key));
		});
	},

	reloadAllStores: function(but) {
		Ext.data.StoreManager.each(function(store) {
			if (but && Ext.Array.contains(but, store.getStoreId())) return;
			if (store.getStoreId() !== 'ext-empty-store') {
				if (store.getStoreId() == 'NavigationTree') {
					store.removeAll();
					store.load();
				}
				else store.reload();
			}
		});
	},

	onNavTreeReady: function() {
		this.redirectTo(Ext.util.History.getToken(), true);
	},

	onLogIn: function() {
		this.loadProfileModel();
		this.getReferences().mainCard.removeAll();
		this.reloadAllStores();
		var redirect = localStorage.getItem('redirect') || 'home';
		this.redirectTo(redirect == 'login' ? 'home' : redirect);
		localStorage.removeItem('redirect');
	},

	onLogout: function() {
		localStorage.removeItem('redirect');
		localStorage.removeItem('token');
		Ext.each(this.profile, localStorage.removeItem, localStorage);
		this.redirectTo('login');
	},

	onActiveTermChanged: function(term) {
		localStorage.setItem('activeTerm', term);
		this.model.set('activeTerm', term);
		this.reloadAllStores(['placeholders', 'templates', 'outbox', 'questions', 'NavigationTree']);
	},

	onRequestError: function(conn, resp) {
		switch(resp.status) {
			case 401:
				localStorage.removeItem('token');
				var back = Ext.util.History.getToken();
				if (back !== 'lockscreen' && back !== 'login') localStorage.setItem('redirect', back);
				/*this.redirectTo((localStorage.getItem('email')) ? 'lockscreen' : 'login');*/
				break;
			case 500:
				this.redirectTo('page500');
				break;
		}
	}
});
