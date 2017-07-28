Ext.define('MobileJudge.view.email.SelectEmails', {
	extend: 'Ext.container.Container',
	alias: 'widget.selectemails',

	requires: [
		'Ext.view.View',
		'Ext.form.field.TextArea'
	],

	layout: {
		type:'vbox',
		align:'stretch'
	},

	items: [
		{
			xtype: 'dataview',
			cls: 'selectemail',
			disableSelection: true,
			loadMask: false,
			trackOver: false,
			itemSelector: 'tbody tr',
			tpl: [
				'<table>',
					'<thead>',
						'<tr>',
							'<th>',
								'<input type="checkbox" name="all" id="all" />',
								'<label for="all">Terms</label>',
							'</th>',
							'<th>',
								'<input type="checkbox" name="students" id="students" />',
								'<label for="students">Students</label>',
							'</th>',
							'<th>',
								'<input type="checkbox" name="judges" id="judges" />',
								'<label for="judges">Judges</label>',
							'</th>',
						'</tr>',
					'</thead>',
					'<tbody>',
						'<tpl for=".">',
							'<tr>',
								'<td>',
									'<input type="checkbox" name="t-{id}" id="t-{id}" />',
									'<label for="t-{id}">{name}</label>',
								'</td>',
								'<td class="stateSelector">',
									'<input type="checkbox" name="t-{id}-1" id="t-{id}-1" />',
									'<tpl for="students">',
										'<button type="button" data-filter="1,{parent.id},{id}" title="{name}">{abbr}</button>',
									'</tpl>',
								'</td>',
								'<td class="stateSelector">',
									'<input type="checkbox" name="t-{id}-2" id="t-{id}-2" />',
									'<tpl for="judges">',
										'<button type="button" data-filter="2,{parent.id},{id}" title="{name}">{abbr}</button>',
									'</tpl>',
								'</td>',
							'</tr>',
						'</tpl>',
					'</tbody>',
				'</table>'
			],
			bind: {
				store: '{emaillists}'
			},
			listeners: {
				afterrender: 'onSelectEmailsAfterRender'
			}
		},
		{
			xtype: 'textareafield',
			id: 'extraEmails',
			name: 'extraEmails',
			margin: '10 0 0 0',
			fieldLabel: 'Extra e-mails (one per line)',
			labelAlign: 'top',
			anchor: '100%',
			flex: 1,
			bind: {
				value: '{extraEmailText}'
			}
		}
	]

});
