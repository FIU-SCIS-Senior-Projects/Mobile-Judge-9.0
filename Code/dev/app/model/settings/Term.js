Ext.define('MobileJudge.model.settings.Term', {
	extend: 'Ext.data.Model',
	requires: [
		'Ext.data.validator.Length',
		'Ext.data.validator.Presence',
		'Ext.data.validator.Range',
		'Ext.data.validator.Format'
	],

	fields: [
		{ name: 'id',                   type: 'int', convert: null },
		{ name: 'name',                 type: 'string' },
		{ name: 'start',                type: 'date', dateWriteFormat: 'C' },
		{ name: 'end',                  type: 'date', dateWriteFormat: 'C' },
		{ name: 'deadline',             type: 'date', dateWriteFormat: 'C' },
		{ name: 'active',               type: 'boolean', defaultValue: false, convert: null },
		{ name: 'allowJudgeLogin',      type: 'boolean', defaultValue: false, convert: null  },
		{ name: 'showGrades',           type: 'boolean', defaultValue: false, convert: null },
		{ name: 'studentsPerJudge',     type: 'int',     defaultValue: 5,     convert: null },
		{ name: 'location',             type: 'string',  defaultValue: 'SCIS JCCL Lab (ECS 241), which is located on the second floor of the ECS building on the Main Campus (also known as Modesto A. Maidique Campus)' },
		{ name: 'mapImageUrl',          type: 'string' },
		{ name: 'srProjectUrl',         type: 'string',  defaultValue: 'http://spws.cis.fiu.edu:8080/SPW2-RegisterAPI/rest/SPWRegister' },
		{ name: 'srProjectToken',       type: 'string',  defaultValue: '123FIUspw' },
		{ name: 'liveUrl',              type: 'string',  defaultValue: 'http://mj.cis.fiu.edu/' },
		{ name: 'developmentUrl',       type: 'string',  defaultValue: 'http://mj-dev.cis.fiu.edu/' },
		{ name: 'noProfileImageUrl',    type: 'string',  defaultValue: 'http://spws.cis.fiu.edu/Senior-Project-Web-Site-Ver-5/img/no-photo.jpeg' },
		{ name: 'display',              type: 'int',     defaultValue: 0,     convert: null },

		{ name: 'mailFrom',             type: 'string',  defaultValue: 'Masoud Sadjadi <sadjadi@cs.fiu.edu>' },
		{ name: 'resetPasswordTemplate',type: 'int',     defaultValue: 3,     convert: null },
		{ name: 'confirmTemplate',      type: 'int',     defaultValue: 38,     convert: null },
		{ name: 'rejectInviteTemplate', type: 'int',     defaultValue: 36,     convert: null },
		{ name: 'removeInviteTemplate', type: 'int',     defaultValue: 37,     convert: null },

		{ name: 'startDate',    type: 'date', depends: 'start',    persist: false, convert: function(v, r) { return r.setDate('start',    v); } },
		{ name: 'startTime',    type: 'date', depends: 'start',    persist: false, convert: function(v, r) { return r.setTime('start',    v); } },
		{ name: 'endDate',      type: 'date', depends: 'end',      persist: false, convert: function(v, r) { return r.setDate('end',      v); } },
		{ name: 'endTime',      type: 'date', depends: 'end',      persist: false, convert: function(v, r) { return r.setTime('end',      v); } },
		{ name: 'deadlineDate', type: 'date', depends: 'deadline', persist: false, convert: function(v, r) { return r.setDate('deadline', v); } },
		{ name: 'deadlineTime', type: 'date', depends: 'deadline', persist: false, convert: function(v, r) { return r.setTime('deadline', v); } }
	],

	validators: {
		name: [
			{ type: 'presence' },
			{ type: 'length', min: 1 }
		],
		studentsPerJudge: [
			{ type: 'presence' },
			{ type: 'range', min: 1, max: 10 }
		],
		startDate: 'presence',
		startTime: 'presence',
		endDate: 'presence',
		endTime: 'presence',
		deadlineDate: 'presence',
		deadlineTime: 'presence',

		mailFrom: [
			{ type: 'presence' },
			{ type: 'format', matcher: /^([\w\s]+)?(\<([\w\.\-_]+)?\w+@\w+(\.\w+){1,}\>)$|^(([\w\.\-_]+)?\w+@\w+(\.\w+){1,})$/ }
		],
		resetPasswordTemplate: 'presence',
		confirmTemplate: 'presence',
		rejectInviteTemplate: 'presence',
		removeInviteTemplate: 'presence'
	},

	setDateTime: function(field, v) {
		var me = this,
			modified = me.modified || (me.modified = {}),
			previousValues = me.previousValues || (me.previousValues = {}),
			comparator = me.fieldsMap[field];

		if (comparator.isEqual(me.data[field], v)) return;

		previousValues[field] = v;
		if (comparator.isEqual(modified[field], v)) {
			delete modified[field];
			me.dirty = Object.keys(modified).length > 0;
		}
		else {
			modified[field] = me.data[field];
			me.dirty = true;
		}
		me.data[field] = v;
	},

	setDate: function(field, v) {
		var me = this, nv = new Date(me.data[field]);
		if (v) {
			nv.setFullYear(v.getFullYear());
			nv.setMonth(v.getMonth());
			nv.setDate(v.getDate());
			me.setDateTime(field, nv);
		}
		return nv;
	},

	setTime: function(field, v) {
		var me = this, nv = new Date(me.data[field]);
		if (v) {
			nv.setHours(v.getHours());
			nv.setMinutes(v.getMinutes());
			me.setDateTime(field, nv);
		}
		return nv;
	}
});
