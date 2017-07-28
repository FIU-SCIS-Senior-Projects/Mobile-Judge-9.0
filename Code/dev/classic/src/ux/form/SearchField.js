Ext.define('MobileJudge.ux.form.SearchField', {
	extend: 'Ext.form.field.Text',

	alias: 'widget.searchfilter',

	triggers: {
		clear: {
			weight: 0,
			cls: Ext.baseCSSPrefix + 'form-clear-trigger',
			hidden: true,
			handler: 'onClearClick',
			scope: 'this'
		},
		search: {
			weight: 1,
			cls: Ext.baseCSSPrefix + 'form-search-trigger',
			handler: 'onSearchClick',
			scope: 'this'
		}
	},

	paramName : 'query',
	hasSearch : false,

	config: {
		store: null
	},

	initComponent: function() {
		var me = this;

		me.callParent(arguments);
		me.on('specialkey', function(f, e){
			if (e.getKey() == e.ENTER) {
				me.onSearchClick();
			}
			else if (e.getKey() == e.ESC) {
				me.onClearClick();
			}
		});
	},

	onClearClick : function(){
		var me = this,
			activeFilter = me.activeFilter;

		if (activeFilter) {
			me.setValue('');
			me.store.getFilters().remove(activeFilter);
			me.activeFilter = null;
			me.getTrigger('clear').hide();
			me.updateLayout();
		}
	},

	onSearchClick : function(){
		var me = this,
			value = me.getValue();

		if (value.length > 0) {
			// Param name is ignored here since we use custom encoding in the proxy.
			// id is used by the Store to replace any previous filter
			me.activeFilter = new Ext.util.Filter({
				property: me.paramName,
				value: value
			});
			me.store.getFilters().add(me.activeFilter);
			me.getTrigger('clear').show();
			me.updateLayout();
		}
	}
});
