Ext.define('MobileJudge.view.main.Controller', {
	extend: 'MobileJudge.view.main.BaseController',
	alias: 'controller.main',

	config: {
		showNavigation: true
	},

	collapsedCls: 'main-nav-collapsed',
	slidOutCls: 'main-nav-slid-out',
	showNavigation: false,

	init: function (view) {
		var me = this,
			refs = me.getReferences(),
			logo = refs.logo,
			nav = refs.navigation;

		me.nav = nav;
		me.callParent([ view ]);

		// Detach the navigation container so we can float it in from the edge.
		nav.getParent().remove(nav, false);
		nav.addCls(['x-floating', 'main-nav-floated', me.slidOutCls]);
		nav.setScrollable(true);
		nav.getRefOwner = function () {
			// we still need events to route here or our base
			return view;
		};

		// Also, transplant the logo from the toolbar to be docked at the top of the
		// floating nav.
		nav.add(logo);
		logo.setDocked('top');

		Ext.getBody().appendChild(nav.element);
	},

	onNavigationItemClick: function (tree, info) {
		if (info.select) {
			// If we click a selectable node, slide out the navigation tree. We cannot
			// use select event for this since the user may tap the currently selected
			// node. We don't want to slide out, however, if the tap is on an unselectable
			// thing (such as a parent node).
			this.setShowNavigation(false);
		}
	},

	onNavigationTreeSelectionChange: function (tree, node) {
		this.setShowNavigation(false);
		this.callParent(arguments);
	},

	onToggleNavigationSize: function () {
		this.setShowNavigation(!this.getShowNavigation());
	},

	updateShowNavigation: function (showNavigation, oldValue) {
		// Ignore the first update since our initial state is managed specially. This
		// logic depends on view state that must be fully setup before we can toggle
		// things.
		//
		// NOTE: We do not callParent here; we replace its logic since we took over
		// the navigation container.
		//
		if (oldValue !== undefined) {
			var me = this,
					nav = me.nav,
					mask = me.mask;

			if (showNavigation) {
				me.mask = mask = Ext.Viewport.add({
					xtype: 'loadmask',
					userCls: 'main-nav-mask'
				});

				mask.element.on({
					tap: me.onToggleNavigationSize,
					scope: me,
					single: true
				});
			} else if (mask) {
				mask.destroy();
				me.mask = null;
			}

			nav.toggleCls(me.slidOutCls, !showNavigation);
		}
	},

	setCurrentView: function (hashTag) {
		hashTag = (hashTag || '').toLowerCase();

		var me = this,
			refs = me.getReferences(),
			isLockScreen = Ext.Array.contains(me.commonPages, hashTag),
			mainCard = refs.mainCard,
			navigationTree = refs.navigationTree,
			store = navigationTree.getStore();

		if (!me.isMenuLoaded() && !isLockScreen) return;

		var	node = store.findNode('routeId', hashTag) || store.findNode('viewType', hashTag),
			view = isLockScreen ? hashTag : (node && (node.get('viewType') || node.get('routeId'))) || 'page404', // hashTag,
			existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
			newView;

		refs.maintoolbar.setHidden(isLockScreen);

		if (!existingItem) {
			try {
				newView = mainCard.add({
					xtype: view,
					routeId: hashTag
				});
			}
			catch (e) {
				console.log(e); // <- This should never happens
				newView = mainCard.add({
					xtype: 'page404',
					routeId: hashTag
				});
			}
		} else newView = existingItem;

		mainCard.setActiveItem(newView);
		navigationTree.setSelection(node);

		//if (newView.isFocusable(true)) {
		//    newView.focus();
		//}
	}
});
