Ext.define('MobileJudge.view.email.Index', {
	extend: 'Ext.Container',
	xtype: 'email',

	controller: 'email',
	viewModel: {
		type: 'emailmobile'
	},

	layout: {
		type: 'hbox',
		align: 'stretch'
	},

	/*listeners: {
		element: 'element',
		edgeswipeend: 'onSwipe'
	},*/

	items: [
		{
			xtype: 'button',
			iconCls: 'x-fa fa-plus',
			ui: 'bright-blue round',
			userCls: 'pop-out',
			bind: {
				hidden: '{composing}'
			},
			width: 50,
			height: 50,

			// These cause the button to be floated / absolute positioned
			bottom: 10,
			right: 10,

			handler: 'onPlusButtonTap'/*,
			listeners: {
				scope: 'controller',
				element: 'element',
				longpress: 'onLongPressCompose'
			}*/
		},
		{
			xtype: 'inbox',
			flex: 1,
			bind: {
				store: '{outbox}',
				hidden: '{composing}'
			},
			reference: 'messages'/*,

			listeners: {
				select: 'onSelectMessage'
			}*/
		}
	]
});
