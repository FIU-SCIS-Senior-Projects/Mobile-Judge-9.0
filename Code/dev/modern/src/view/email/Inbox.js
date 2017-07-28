Ext.define('MobileJudge.view.email.Inbox', {
    extend: 'Ext.dataview.List',
    xtype: 'inbox',

	requires: [
		'Ext.plugin.ListPaging',
		'Ext.plugin.PullRefresh'
	],

    plugins: [
        {
            xclass: 'Ext.plugin.PullRefresh'
        },
	    {
		    xclass: 'Ext.plugin.ListPaging',
		    autoPaging: true
	    }
    ],

	cls: 'email-list',
	disableSelection: true,

    itemTpl: new Ext.XTemplate(
        '<div class="inbox-item">',
            '<div class="inbox-inner-row inbox-{replied:pick(\'read\',\'unread\')}">',
                '<div class="list-cls inbox-from">{address}</div>',
                '<div class="inbox-date">',
                    /*'<tpl if="has_attachments">',
                        '<span class="x-fa fa-paperclip inbox-attachment"></span>',
                    '</tpl>',*/
                    '{[this.formatDate(values.sent)]}', //{sent:date("M d")}
                '</div>',
            '</div>',
            '<div class="inbox-inner-row">',
                '<div class="inbox-summary">{subject}</div>',
                /*'<div class="inbox-favorite">',
                    '<tpl if="state">',
                        '<span class="x-fa fa-heart-o"></span>',
                    '<tpl else>',
                        '<span class="x-fa inbox-favorite-icon fa-heart"></span>',
                    '</tpl>',
                '</div>',*/
            '</div>' +
        '</div>',
	    {
		    formatDate: function(date) {
			    var check = new Date(date),
				    today = new Date(),
				    start = new Date(today.getTime() + (-1 - today.getDay()) * 24*60*60*1000),
				    end = new Date(today.getTime() + (6 - today.getDay()) * 24*60*60*1000),
				    format = (check.setHours(0,0,0,0) == today.setHours(0,0,0,0))
			                    ? 'g:i a'
					            : (start < date && date < end)
			                        ? 'l'
					                : 'M d';
			    return Ext.Date.format(date, format);
		    }
	    }
    )
});
