Ext.define('MobileJudge.model.grade.JudgeGradesView', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'judgeId',              type: 'int', convert: null },
        { name: 'state',                type: 'string', convert: null },
        { name: 'email',                 type: 'string', convert: null },
        { name: 'fullName',              type: 'string' },

    ]
});