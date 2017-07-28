Ext.define('MobileJudge.view.email.TemplateEditor', {
    extend: 'Ext.form.Panel',
    alias: 'widget.templateeditor',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.Text',
        'Ext.form.field.ComboBox',
	    'Ext.form.FieldContainer'
    ],

    controller: 'email',

    cls: 'email-compose',

    layout: {
        type:'vbox',
        align:'stretch'
    },

    bodyPadding: 10,
    scrollable: true,

    defaults: {
        labelWidth: 90,
        labelSeparator: ''
    },

	listeners: {
		afterrender: 'afterTemplateRender'
	},

	bbar: [
		'->',
		{
			ui: 'soft-green',
			text: 'Save',
			handler: 'onTemplateSaveClick'
		},
		{
			ui: 'soft-red',
			text: 'Discard',
			handler: 'onTemplateDiscardClick'
		},
		'->'
	],

    items: [
        {
            xtype: 'textfield',
	        allowBlank : false,
	        name: 'name',
            fieldLabel: 'Title'
        },
        {
            xtype: 'textfield',
	        allowBlank : false,
	        name: 'subject',
	        fieldLabel: 'Subject'
        },
	    {
		    xtype: 'combobox',
		    fieldLabel: 'Fields to Insert',
		    store: 'placeholders',
		    queryMode: 'local',
		    editable: false,
		    emptyText: 'Select a Field',
		    displayField: 'text',
		    valueField: 'code',
		    listeners: {
			    change: "onInsertPlaceHolderChange"
		    }
	    },
	    {
		    xtype: 'fieldcontainer',
		    itemId: 'editorContainer',
		    flex: 1,
		    minHeight: 100,
		    labelAlign: 'top',
		    items: [
			    {
				    xtype: 'component',
				    html: '<textarea id="templateEditor" name="body"></textarea>'
			    }
		    ]
	    }
    ]
});
