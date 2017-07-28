/**
 * Adds an additional option to a select field filled by a store
 * @cfg {mixed} valueFieldValue Value of the added option
 * @cfg {string} displayFieldValue Text to display for the added option
 */
Ext.define('MobileJudge.ux.SelectPlus', {
	extend: 'Ext.field.Select',
	xtype: 'selectfieldplus',
	alternateClassName: 'Ext.field.SelectPlus',
	requires: 'Ext.data.Store',

	config: {
		displayFieldValue: '',
		valueFieldValue: ''
	},

	/**@override
	 * Insert our item each time the store is loaded
	 * @param {Ext.data.Store} store The refreshed store
	 */
	onStoreDataChanged: function(store) {
		if(store.findExact(this.getValueField(), this.getValueFieldValue()) === -1) { //prevent infinite loop ;)
			var item = Ext.create(store.getModel());
			item.set(this.getValueField(), this.getValueFieldValue());
			item.set(this.getDisplayField(), this.getDisplayFieldValue());
			store.insert(0, item);
		}
		this.callParent([store]);
	}
});
