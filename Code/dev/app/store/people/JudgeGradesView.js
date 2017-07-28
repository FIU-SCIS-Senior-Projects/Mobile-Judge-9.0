Ext.define('MobileJudge.store.grade.JudgeGradesView', {
    extend: 'Ext.data.Store',
    alias: 'store.judgegradesview',

    model: 'MobileJudge.model.grade.JudgeGradesView',

    proxy: {
        type: 'api',
        url: '/api/judges_grade_view',
        noCache:false,
    },

    autoSync: true,
    autoLoad: true,
    remoteSort: true,
    remoteFilter: true,
    pageSize: 999,

});