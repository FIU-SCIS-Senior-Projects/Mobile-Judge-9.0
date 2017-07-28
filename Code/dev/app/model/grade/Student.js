Ext.define('MobileJudge.model.grade.Student', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id',               type: 'int', convert: null },
        { name: 'state',            type: 'string' },
        { name: 'abbr',             type: 'string' },
        { name: 'fullName',         type: 'string', persist: false },
        { name: 'email',            type: 'string' },
        { name: 'profileImgUrl',    type: 'string' },
        { name: 'project',          type: 'string' },
        { name: 'location',         type: 'string' },
        /*{ name: 'termName',       type: 'string' },
         { name: 'mapImageUrl',     type: 'string' },*/
        { name: 'grade',            type: 'float', convert: null },
        { name: 'rawGrade',         type: 'float', convert: null },
        { name: 'max',              type: 'int', convert: null },
        { name: 'filterStatus',     type: 'string', convert: null },
    ]
});