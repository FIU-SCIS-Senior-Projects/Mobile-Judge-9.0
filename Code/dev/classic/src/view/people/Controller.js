Ext.define('MobileJudge.view.people.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.people',

    windows: {},
    model: null,
    deleteRecord: {},

    init: function (view) {
        this.model = view.getViewModel();
    },

    onStatesLoaded: function (store, records) {
        var filter = store.getStoreId().replace(/States/, 'Filter');
        this.model.set(filter, records);
    },

    onFilterChange: function (selModel, selections) {
        var filter = selections.map(function (r) {
            return r.get('abbr');
        });
        this.model.getStore(selModel.storeId).filter('abbr', Ext.isEmpty(filter) ? 'XX' : filter);

        var checkbox = document.getElementById('chkid');

        if (selModel.storeId == 'students'){
            if (selections.length == 3){
                checkbox.checked = true;
                checkbox.indeterminate = false;
            }
            else if (selections.length == 0){
                checkbox.checked = false;
                checkbox.indeterminate = false;
            }
            else {
                checkbox.indeterminate = true;
            }
        }

        var checkbox2 = document.getElementById('chkid2');

        if (selModel.storeId == 'judges'){
            if (selections.length == 9){
                checkbox2.checked = true;
                checkbox2.indeterminate = false;
            }
            else if (selections.length == 0){
                checkbox2.checked = false;
                checkbox2.indeterminate = false;
            }
            else {
                checkbox2.indeterminate = true;
            }
        }

    },

    onUserDelete: function (grid, rowIndex) {
        var store = grid.getStore(), id = store.getAt(rowIndex).get('id');

        Ext.Msg.confirm('Delete', 'Are you sure you want to delete the selected record?',
            function (choice) {
                if (choice !== 'yes') return;
                Ext.getBody().mask();
                Ext.Ajax.request({
                    url: '/api/users/' + id,
                    method: 'DELETE',
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        store.reload();
                    }
                });
            });
    },

    onGridEditorCancelEdit: function (editor, context) {
        if (context.record.phantom) {
            context.grid.getStore().remove(context.record);
        }
    },


    onStudentsLoad: function (btn) {
        var me = this;
        btn.setDisabled(true);
        btn.setText('Please Wait');

        Ext.Ajax.request({
            url: '/api/students/change',
            success: function (resp) {
                var tpl = new Ext.XTemplate(
                    '<span style="font-size:14px">Students</span><hr />',
                    '<span style="text-align:right;width:80px;display:inline-block;">Dropped:&nbsp;</span>{students.dropped}<br />',
                    '<span style="text-align:right;width:80px;display:inline-block;">Update:&nbsp;</span>{students.update}<br />',
                    '<span style="text-align:right;width:80px;display:inline-block;">New:&nbsp;</span>{students.new}<br />',
                    '<tpl if="students.woProject &gt; 0">',
                    '<span style="text-align:right;width:80px;display:inline-block;">No Projects:&nbsp;</span>{students.woProject}<br />',
                    '</tpl>',
                    '<br />',
                    '<span style="font-size:14px">Projects</span><hr />',
                    '<span style="text-align:right;width:80px;display:inline-block;">Deactivate:&nbsp;</span>{projects.deactivate}<br />',
                    '<span style="text-align:right;width:80px;display:inline-block;">Update:&nbsp;</span>{projects.update}<br />',
                    '<span style="text-align:right;width:80px;display:inline-block;">New:&nbsp;</span>{projects.new}<br />'
                );
                Ext.Msg.confirm('Apply this changes?', tpl.apply(Ext.decode(resp.responseText)),
                    function (choice) {
                        if (choice !== 'yes') {
                            btn.setText('Sync');
                            btn.setDisabled(false);
                            return;
                        }

                        Ext.Ajax.request({
                            url: '/api/students',
                            method: 'POST',
                            callback: function () {
                                btn.setText('Sync');
                                btn.setDisabled(false);
                                //.getView().refresh();
                            },
                            success: function () {
                                //Ext.Msg.alert('Success', 'Changes applied!', function() {
                                me.model.getStore('students').reload();
                                //});
                            }
                        });
                    });
            }
        });
    },

    onExportReport: function () {
        var linkURL = '/api/students?count=999';

        if(document.getElementById('Active').className == 'selected' ){
            linkURL = linkURL + '&abbr=AC';
        }
        if(document.getElementById('Dropped').className == 'selected' ){
            linkURL = linkURL + '&abbr=DR';
        }
        if(document.getElementById('Incomplete').className == 'selected' ){
            linkURL = linkURL + '&abbr=IN';
        }
        if(linkURL == '/api/students?count=999'){
            alert("No Filters Selected!");
            return;
        }

        if(document.getElementById('idxColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=id';
        }
        else if(document.getElementById('idxColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-id';
        }
        else if(document.getElementById('nameColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=fullName';
        }
        else if(document.getElementById('nameColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-fullName';
        }
        else if(document.getElementById('emailColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=email';
        }
        else if(document.getElementById('emailColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-email';
        }
        else if(document.getElementById('comboProjects').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=project';
        }
        else if(document.getElementById('comboProjects').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-project';
        }
        else if(document.getElementById('locationColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=location';
        }
        else if(document.getElementById('locationColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-location';
        }
        else if(document.getElementById('stateColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=state';
        }
        else if(document.getElementById('stateColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-state';
        }

        Ext.Ajax.request({
            url: linkURL,
            method: 'GET',
            success: function (response, options) {
                JSONToCSVConvertor(Ext.decode(response.responseText), "Student Summary Report", true);
            }

        });
    },

    onExportJudgeReport: function () {
        var linkURL = '/api/judges?count=999';

        if(document.getElementById('Prospective').className == 'selected' ){
            linkURL = linkURL + '&abbr=PR';
        }
        if(document.getElementById('Invited').className == 'selected' ){
            linkURL = linkURL + '&abbr=IN';
        }
        if(document.getElementById('Rejected').className == 'selected' ){
            linkURL = linkURL + '&abbr=RJ';
        }
        if(document.getElementById('Pending').className == 'selected' ){
            linkURL = linkURL + '&abbr=PE';
        }
        if(document.getElementById('Registered').className == 'selected' ){
            linkURL = linkURL + '&abbr=RG';
        }
        if(document.getElementById('Attended').className == 'selected' ){
            linkURL = linkURL + '&abbr=AT';
        }
        if(document.getElementById('Started Grading').className == 'selected' ){
            linkURL = linkURL + '&abbr=ST';
        }
        if(document.getElementById('Graded').className == 'selected' ){
            linkURL = linkURL + '&abbr=GR';
        }
        if(document.getElementById('Removed').className == 'selected' ){
            linkURL = linkURL + '&abbr=RE';
        }
        if(linkURL == '/api/judges?count=999'){
            alert("No Filters Selected!");
            return;
        }

        if(document.getElementById('JudgeIdxColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=id';
        }
        else if(document.getElementById('JudgeIdxColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-id';
        }
        else if(document.getElementById('JudgeNameColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=fullName';
        }
        else if(document.getElementById('JudgeNameColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-fullName';
        }
        else if(document.getElementById('JudgeEmailColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=email';
        }
        else if(document.getElementById('JudgeEmailColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-email';
        }
        else if(document.getElementById('JudgeTitleColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=title';
        }
        else if(document.getElementById('JudgeTitleColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-title';
        }
        else if(document.getElementById('JudgeOrgColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=affiliation';
        }
        else if(document.getElementById('JudgeOrgColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-affiliation';
        }
        else if(document.getElementById('JudgeStateColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=state';
        }
        else if(document.getElementById('JudgeStateColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-state';
        }

        var offset = '&offset=';
        var num = 0;

        Ext.Ajax.request({
            url: linkURL + offset + num,
            method: 'GET',
            success: function (response, options) {
                var resp = response.responseText.substring(1,response.responseText.length - 1) + ',';
                num += 999;
                Ext.Ajax.request({
                    url: linkURL + offset + num,
                    method: 'GET',
                    success: function (response2, options2) {
                        var resp2 = resp + response2.responseText.substring(1,response2.responseText.length - 1) + ',';
                        num += 999;
                        Ext.Ajax.request({
                            url: linkURL + offset + num,
                            method: 'GET',
                            success: function (response3, options3) {
                                var resp3 = resp2 + response3.responseText.substring(1,response3.responseText.length - 1) + ',';

                                resp3 = '[' + resp3 +']';
                                JSONToCSVConvertor(Ext.decode(resp3), "Judge Summary Report", true);
                            }


                        });
                    }


                });
            }


        });




    },

    onImportJudges: function () {
        var me = this;
        var form = this.lookupReference('judgeUploadForm').getForm();
        form.submit({
            url: '/api/judges/import',
            waitMsg: 'Importing judges...',
            success: function (form, action) {
                me.model.getStore('judges').reload();
                var tpl = new Ext.XTemplate(
                    'File processed on the server.<br />',
                    'Name: {fileName}<br/>',
                    'Size: {fileSize:fileSize}<br /><hr />',
                    'Processed: {total}<br />',
                    'Inserted: {records}<br />',
                    'Skipped: {skipped}'
                );
                Ext.Msg.alert('Success', tpl.apply(action.result));
            },
            failure: function (form, action) {
                console.log(action);
                Ext.Msg.alert("Error", action.response.responseText);
            }
        });
    },



    onJudgeTemplateDownload: function(){
        csv = "Email,First Name,Last Name\r\n";
        var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
        var link = document.createElement("a");

        link.href = uri;
        link.style = "visibility:hidden";
        link.download = "Judge Template.csv";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    onStudentsUpdate: function(editor, e){
        var store = Ext.getStore("students");
        var record = store.getAt(e.rowIdx);
        var idx = record.get('id');
        var fN = record.get('fullName').split(' ')[0];
        var lN = record.get('fullName').split(' ')[1];
        var ema = record.get('email');
        var pro = record.get('project');
        var loc = record.get('location').replace(/\D/g,'');
        var sta = record.get('state');

        if(Number(loc) > 254 || Number(loc) < 0){
            alert("Location: Please choose a location 0-254");

            if(/^\d+$/.test(pro) && /^\d+$/.test(sta)){
                var jsonObj = {
                    id: idx,
                    firstName: fN,
                    lastName: lN,
                    email: ema,
                    projectId: pro,
                    state: sta,
                }
            }else if (/^\d+$/.test(pro)){
                var jsonObj = {
                    id: idx,
                    firstName: fN,
                    lastName: lN,
                    email: ema,
                    projectId: pro,
                }
            }else if (/^\d+$/.test(sta)){
                var jsonObj = {
                    id: idx,
                    firstName: fN,
                    lastName: lN,
                    email: ema,
                    state: sta,
                }
            }else{
                var jsonObj = {
                    id: idx,
                    firstName: fN,
                    lastName: lN,
                    email: ema,
                }
            }

        }else{

            if(/^\d+$/.test(pro) && /^\d+$/.test(sta)){
                var jsonObj = {
                    id: idx,
                    firstName: fN,
                    lastName: lN,
                    email: ema,
                    projectId: pro,
                    location: loc ,
                    state: sta,
                }
            }else if (/^\d+$/.test(pro)){
                var jsonObj = {
                    id: idx,
                    firstName: fN,
                    lastName: lN,
                    email: ema,
                    projectId: pro,
                    location: loc ,
                }
            }else if (/^\d+$/.test(sta)){
                var jsonObj = {
                    id: idx,
                    firstName: fN,
                    lastName: lN,
                    email: ema,
                    location: loc ,
                    state: sta,
                }
            }else{
                var jsonObj = {
                    id: idx,
                    firstName: fN,
                    lastName: lN,
                    email: ema,
                    location: loc ,
                }
            }

        }




        Ext.Ajax.request({
            url: '/api/users/'+ idx,
            method: 'PUT',
            jsonData: Ext.encode(jsonObj),
            success: function () {
                store.reload();

            }

        });


    },

    onJudgesUpdate: function(editor, e){
        var store = Ext.getStore("judges");
        var record = store.getAt(e.rowIdx);
        var idx = record.get('id');
        var fN = record.get('fullName').split(' ')[0];
        var lN = record.get('fullName').split(' ')[1];
        var ema = record.get('email');
        var ti = record.get('title');
        var aff = record.get('affiliation');
        var sta = record.get('state');

        if(/^\d+$/.test(sta)){
            var jsonObj = {
                id: idx,
                firstName: fN,
                lastName: lN,
                email: ema,
                title: ti,
                affiliation: aff ,
                state: sta
            }
        }else{
            var jsonObj = {
                id: idx,
                firstName: fN,
                lastName: lN,
                email: ema,
                title: ti,
                affiliation: aff ,
            }
        }

        Ext.Ajax.request({
            url: '/api/users/'+ idx,
            method: 'PUT',
            jsonData: Ext.encode(jsonObj),
            success: function () {
                store.reload();
            }

        });


    }

});


function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel, store1) {
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';

    if (ShowLabel) {
        var row = "";

        for (var index in arrData[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        CSV += row + '\r\n';
    }

    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        for (var index in arrData[i]) {
            row += ''+ arrData[i][index] + ',';
        }
        row.slice(0, row.length - 1);
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var link = document.createElement("a");

    link.href = uri;
    link.style = "visibility:hidden";
    link.download = ReportTitle + ".csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}