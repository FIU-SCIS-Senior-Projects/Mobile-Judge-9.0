Ext.define('NestedGrid.overrides.view.Table', {
    override: 'Ext.view.Table',
    checkThatContextIsParentGridView: function(e){
        var target = Ext.get(e.target);
        var parentGridView = target.up('.x-grid-view');
        if (this.el.getId() != parentGridView.getId()) {
            /* event of different grid caused by grids nesting */
            return false;
        } else {
            return true;
        }
    },
    processItemEvent: function(record, row, rowIndex, e) {
        if (e.target && !this.checkThatContextIsParentGridView(e)) {
            return false;
        } else {
            return this.callParent([record, row, rowIndex, e]);
        }
    }
});



Ext.define('NestedGrid.ux.RowExpanderGrid', {
    extend: 'Ext.grid.plugin.RowExpander',
    requires: [
        'Ext.grid.feature.RowBody',
        'Ext.grid.plugin.RowExpander',
        'Ext.grid.Panel'
    ],

    alias: 'plugin.rowexpandergrid',
    /**
     * @cfg {Object} [gridConfig={}]
     * Add configuration as you add in normal grid creation for inner grid.
     *
     */
    gridConfig:null,

    setCmp: function(outerGrid) {
        var me = this;
        this.rowBodyTpl=new Ext.XTemplate('<div class="detailData"></div>');
        me.callParent(arguments);

        // <debug>
        if (!me.gridConfig) {
            Ext.Error.raise("The 'gridConfig' config is required and is not defined.");
        }
        // </debug>
    },
    init:function(outerGrid){
        var me = this;

        //Calling the parent init function of RowExpander
        this.callParent(arguments);
        //Attaching event handler on the gridview's event like  (expandbady/collapsebody)
        outerGrid.getView().on('expandbody',me.addInnerGridOnExpand,me);
        //outerGrid.getView().on('collapsebody',me.removeInnerGridOnCollapse,me);

    },

    addInnerGridOnExpand : function (rowNode, record, expandRow, eOpts) {
        var me=this;
        if( Ext.fly(rowNode).down('.x-grid-view')){
            return;
        }
        // Resetting the expanded records object of row expander plugin
        me.recordsExpanded[record.internalId] = false;
        //Getting the dom element in which we have to render the inner grid
        var detailData = Ext.DomQuery.select("div.detailData", expandRow);
        //Creating the object of inner grid based upon passed grid config
        var innerGrid=Ext.create('Ext.grid.Panel',me.gridConfig);
        //rendering the innerGrid into dom element
        innerGrid.render(detailData[0]);
    }
});