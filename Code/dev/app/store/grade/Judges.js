Ext.define('MobileJudge.store.grade.Judges', {
    extend: 'Ext.data.Store',
    alias: 'store.judges',

    model: 'MobileJudge.model.grade.Judge',

    proxy: {
        type: 'api',
        url: '/api/judges',
    },

    remoteSort: true,
    remoteFilter: true,
    autoLoad: true,
    pageSize: 25
});
