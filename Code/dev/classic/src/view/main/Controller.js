Ext.define('MobileJudge.view.main.Controller', {
	extend: 'MobileJudge.view.main.BaseController',
	alias: 'controller.main',

	lastView: null,

	setCurrentView: function (hashTag) {
		hashTag = (hashTag || '').toLowerCase();

		var me = this,
			refs = me.getReferences(),
			isLockScreen = Ext.Array.contains(me.commonPages, hashTag),
			mainCard = refs.mainCard,
			mainLayout = mainCard.getLayout(),
			navigationList = refs.navigationTree,
			store = navigationList.getStore();

		if (!me.isMenuLoaded() && !isLockScreen) return;

		var node = store.findNode('routeId', hashTag) || store.findNode('viewType', hashTag),
			view = isLockScreen ? hashTag : (node && (node.get('viewType') || node.get('routeId'))) || 'page404', // hashTag,
			lastView = me.lastView,
			existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
			newView;

		// Kill any previously routed window
		if (lastView && lastView.isWindow) lastView.destroy();
		lastView = mainLayout.getActiveItem();

		if (!existingItem) {
			try {
				newView = Ext.create({
					xtype: view,
					routeId: hashTag,  // for existingItem search later
					hideMode: 'offsets'
				});
			}
			catch (e) {
				console.log(e); // <- This should never happens
				newView = Ext.create({
					xtype: 'page404',
					routeId: hashTag,
					hideMode: 'offsets'
				});
			}
		}

		if (!newView || !newView.isWindow) {
			// !newView means we have an existing view, but if the newView isWindow
			// we don't add it to the card layout.
			if (existingItem) {
				// We don't have a newView, so activate the existing view.
				if (existingItem !== lastView) {
					mainLayout.setActiveItem(existingItem);
				}
				newView = existingItem;
			}
			else {
				// newView is set (did not exist already), so add it and make it the
				// activeItem.
				Ext.suspendLayouts();
				mainLayout.setActiveItem(mainCard.add(newView));
				Ext.resumeLayouts(true);
			}
		}

		navigationList.setSelection(node);
		if (newView.isFocusable(true)) newView.focus();
		me.lastView = newView;
	},

	onToggleNavigationSize: function () {
		var me = this,
			refs = me.getReferences(),
			navigationList = refs.navigationTree,
			wrapContainer = refs.mainContainerWrap,
			collapsing = !navigationList.getMicro(),
			new_width = collapsing ? 64 : 250;

		if (Ext.isIE9m || !Ext.os.is.Desktop) {
			Ext.suspendLayouts();

			refs.senchaLogo.setWidth(new_width);

			navigationList.setWidth(new_width);
			navigationList.setMicro(collapsing);

			Ext.resumeLayouts(); // do not flush the layout here...

			// No animation for IE9 or lower...
			wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
			wrapContainer.updateLayout();  // ... since this will flush them
		}
		else {
			if (!collapsing) {
				// If we are leaving micro mode (expanding), we do that first so that the
				// text of the items in the navlist will be revealed by the animation.
				navigationList.setMicro(false);
			}

			// Start this layout first since it does not require a layout
			refs.senchaLogo.animate({dynamic: true, to: {width: new_width}});

			// Directly adjust the width config and then run the main wrap container layout
			// as the root layout (it and its chidren). This will cause the adjusted size to
			// be flushed to the element and animate to that new size.
			navigationList.width = new_width;
			wrapContainer.updateLayout({isRoot: true});
			navigationList.el.addCls('nav-tree-animating');

			// We need to switch to micro mode on the navlist *after* the animation (this
			// allows the "sweep" to leave the item text in place until it is no longer
			// visible.
			if (collapsing) {
				navigationList.on({
					afterlayoutanimation: function () {
						navigationList.setMicro(true);
						navigationList.el.removeCls('nav-tree-animating');
					},
					single: true
				});
			}
		}
	}
});
