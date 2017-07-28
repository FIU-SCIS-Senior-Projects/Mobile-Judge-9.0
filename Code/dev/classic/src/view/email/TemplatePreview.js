Ext.define('MobileJudge.view.email.TemplatePreview', {
    extend: 'Ext.form.Panel',
    alias: 'widget.templatepreview',
    requires: [
        'Ext.form.field.Text',
        'Ext.form.field.ComboBox',
	    'Ext.container.Container'
    ],

    cls: 'email-compose',

    layout: {
        type:'vbox',
        align:'stretch'
    },

    scrollable: true,

    defaults: {
        labelWidth: 60,
        labelSeparator: ''
    },

	items: [
		{
			xtype: 'combobox',
			fieldLabel: 'Template',
			store: 'templates',
			queryMode: 'local',
			editable: false,
			emptyText: 'Select a Template',
			displayField: 'name',
			valueField: 'id',
			bind: {
				value: '{template}'
			},
			listeners: {
				change: "onTemplateChange"
			}
		},
        {
            xtype: 'textfield',
	        name: 'subject',
	        readOnly: true,
	        fieldLabel: 'Subject',
	        bind: {
		        value: '{preview.subject}'
	        }
        },
	    {
		    xtype: 'container',
		    scrollable: true,
		    border: 1,
		    padding: 8,
		    style: {
			    borderColor: '#d0d0d0',
			    borderStyle: 'solid'
		    },
		    flex: 1,
		    minHeight: 100,
		    items: [
			    {
				    xtype: 'component',
				    bind: {
					    html: '{preview.body}'
				    }
			    }
		    ]
	    }
    ]
});
