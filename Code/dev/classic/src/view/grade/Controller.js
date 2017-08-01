Ext.define('MobileJudge.view.grade.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.grade',

    windows: {},
    model: null,
    deleteRecord: {},

    init: function (view) {
        this.model = view.getViewModel();
        var data = null;
        var text = 'Accept';
        var dataArray = null;
        var status = null;
    },

    returnData: function () {
        return this.dataArray;
    },

    getAverage: function (data) {
        var average = 0;
        var count = 0;

        data.forEach(function (item) {
            if ((item.accepted && item.accepted == true)) {
                if (item.grade)
                    average = average + item.grade;
                else if (item.gradeAverage)
                    average = average + item.gradeAverage;
                else
                    average = average + item.gradeAverage;
                count++;
            }
        })
        return (average / count).toFixed(2) != null ? (average / count).toFixed(2) : 0;
    },

    changeStatus: function (status) {
        var value;
        if (status == "Pending") {
            value = "Accepted";
        }
        else if (status == "Accepted") {
            value = "Rejected";
        }
        else {
            value = "Pending";
        }

        return value;
    },

    saveIndependentGrade: function (data) {
        Ext.Ajax.request({
            url: '/api/views_table/saveData',
            success: function (response) {
            },
            failure: this.updateError,
            jsonData: data,
            disableCaching: true,
            method: 'POST'
        });
    },

    getData: function (data) {
        Ext.Ajax.request({
            url: '/api/views_table/judges',
            success: function (response) {
                var data = JSON.parse(response.responseText)
                data.judges.forEach(function (judge) {
                    data.students.forEach(function (student) {
                        if (student.judgeId == judge.id)
                            student.judgeName = judge.fullName;
                    })
                })
                data.students.forEach(function (student) {
                    var tempAverage = 1;
                    data.grades.forEach(function (grade) {
                        if (student.judgeName == grade.judge && student.fullName == grade.student && student.project == grade.projectName) {
                            student.gradeAverage = student.gradeAverage + grade.grade;
                            tempAverage++;
                        }
                    })
                    student.gradeAverage = student.gradeAverage / tempAverage;
                })

                return data;
                Ext.getStore('mockData').data = data.students;
                Ext.getStore('mockData').reload();
            },
            failure: this.updateError,
            jsonData: data,
            disableCaching: true,
            method: 'POST'
        });
    },
    loadStudentsGrades: function () {
        var students = Ext.getStore("students").data.items;
        var grades = Ext.getStore("studentGrades").data.items;

        students.forEach(function (student) {
            var counter = 0;

            grades.forEach(function (grade) {

                if (grade.data.studentId == 1358788)//student.id)
                {
                    student.data.grade = student.data.grade + grade.data.value;
                    counter++;
                }
            })
            student.data.grade = student.data.grade / counter;
        })
        Ext.getStore("students").loadData(students, [false]);
    },

    onStateChange: function (grid, rowIndex, colIndex) {
        var me = this;
        var store = grid.getStore(), id = store.getAt(rowIndex).data.studentId, data = store.getAt(rowIndex).data,
            index = rowIndex;
        Ext.Ajax.request({
            url: '/api/views_table/' + id,
            success: function () {
                store.load();
                me.changeIcon();
            },
            failure: this.updateError,
            jsonData: data,
            disableCaching: true,
            method: 'PUT'
        });

        Ext.getStore('judgegradesview').load();
    },

    onJudgeStateChange: function (grid, rowIndex, colIndex) {
        var me = this;
        var store = grid.getStore(), id = store.getAt(rowIndex).data.judgeid, data = store.getAt(rowIndex).data,
            index = rowIndex;
        Ext.Ajax.request({
            url: '/api/judges_grade_view/' + id,
            success: function () {
                store.load();
                me.changeIcon();
            },
            failure: this.updateError,
            jsonData: data,
            disableCaching: true,
            method: 'PUT'
        });

        Ext.getStore('studentgradesview').load();

    },

    saveEditedData: function () {
        var me = this;
        var store = Ext.getStore('judgeGrades');
        var data = [];
        var outOfBounds = false;
        store.data.items.forEach(function (obj) {
            if (obj.data.grade > 10 || obj.data.grade < 0)
                outOfBounds = true;
            data.push(obj.data);
        })

        if (outOfBounds) {
            me.loadThirdViewData(data[0]);
        }
        else {
            Ext.Ajax.request({
                url: '/api/third_view_save_edited',
                success: function (response) {
                    var data = JSON.parse(response.responseText)
                    me.loadThirdViewData(data.data[0]);
                },
                failure: this.updateError,
                jsonData: data,
                disableCaching: true,
                method: 'POST'
            });
        }
    },

    loadSecondViewData: function (data) {
        var me = this;
        Ext.Ajax.request({
            url: '/api/second_view',
            success: function (response) {
                var data = JSON.parse(response.responseText)
                Ext.getStore('studentDetailData').loadData(data);
                var average = me.getAverage(data);

                Ext.getCmp('gradeLabel').setText(average);
                me.changeIconSecondView();
            },
            failure: this.updateError,
            jsonData: data,
            disableCaching: true,
            method: 'POST'
        });
    },

    loadThirdViewData: function (data) {
        var me = this;
        Ext.Ajax.request({
            url: '/api/third_view',
            success: function (response) {
                var data = JSON.parse(response.responseText)
                Ext.getStore('judgeGrades').loadData(data);
                var sum = 0;
                $("#gradeThirdLabel").text(0);
                data.forEach(function (item) {
                    if (item.accepted == "Accepted") {
                        sum = item.grade + sum;
                        $("#gradeThirdLabel").text(sum);
                    }
                })

                $("#judgeThirdLabel").text(data[0].judge);
                $("#studentThirdLabel").text(data[0].student);
                $("#projectThirdLabel").text(data[0].projectName);
                me.changeIconThirdView();
            },
            failure: this.updateError,
            jsonData: data,
            disableCaching: true,
            method: 'POST'
        });
    },
    changeStatusSecondView: function(grid, rowIndex, colIndex){
        var me = this;
        var store = Ext.getStore('studentDetailData'), status;
        var data = [];
        var changeTo = Ext.getCmp('detailAllButton').tooltip;
        var tempObj;

        if(!isNaN(rowIndex)){
            tempObj = {
                studentId: store.data.items[rowIndex].data.studentId,
                judgeId: store.data.items[rowIndex].data.judgeId
            };
            data.push(tempObj);

            if(store.data.items[rowIndex].data.accepted && !store.data.items[rowIndex].data.rejected && !store.data.items[rowIndex].data.pending)
                status = "Rejected"
            else if(!store.data.items[rowIndex].data.accepted && store.data.items[rowIndex].data.rejected && !store.data.items[rowIndex].data.pending)
                status = "Pending";
            else if(!store.data.items[rowIndex].data.accepted && !store.data.items[rowIndex].data.rejected && store.data.items[rowIndex].data.pending)
                status = "Accepted";
            else
                status = "Accepted";
        }
        else{
            if(changeTo ==='Accept-All'){
                status = 'Accepted';
                Ext.getCmp('detailAllButton').tooltip = 'Reject-All';
            }
            else if(changeTo ==='Pending-All'){
                status = 'Pending';
                Ext.getCmp('detailAllButton').tooltip = 'Accept-All';
            }
            else{
                status = 'Rejected';
                Ext.getCmp('detailAllButton').tooltip = 'Pending-All';
            }

            store.data.items.forEach(function(item){
                tempObj = {
                    studentId: item.data.studentId,
                    judgeId: item.data.judgeId
                };
                data.push(tempObj);
            })
        }

        var sendData = {
            data: data,
            state: status
        };

        Ext.Ajax.request({
            url: '/api/second_view_save',
            success: function(){
                me.loadSecondViewData(data[0]);
            },
            failure: this.updateError,
            jsonData :sendData,
            disableCaching:true,
            method:'PUT'
        });

    },

    changeStatusThirdView: function (grid, rowIndex, colIndex) {
        var me = this;
        var store = Ext.getStore('judgeGrades'), status;
        var data = [];
        var changeTo = Ext.getCmp('detailAllThirdButton').tooltip;
        var tempObj;

        if (!isNaN(rowIndex)) {
            tempObj = {
                studentId: store.data.items[rowIndex].data.studentId,
                judgeId: store.data.items[rowIndex].data.judgeId,
                questionId: store.data.items[rowIndex].data.questionId
            };
            data.push(tempObj);

            if (store.data.items[rowIndex].data.accepted === "Accepted")
                status = "Rejected"
            else if (store.data.items[rowIndex].data.accepted === "Rejected")
                status = "Pending";
            else
                status = "Accepted";
        }
        else {
            if (changeTo === 'Accept-All') {
                status = 'Accepted';
                Ext.getCmp('detailAllThirdButton').tooltip = 'Reject-All';
            }
            else if (changeTo === 'Pending-All') {
                status = 'Pending';
                Ext.getCmp('detailAllThirdButton').tooltip = 'Accept-All';
            }
            else {
                status = 'Rejected';
                Ext.getCmp('detailAllThirdButton').tooltip = 'Pending-All';
            }

            store.data.items.forEach(function (item) {
                tempObj = {
                    studentId: item.data.studentId,
                    judgeId: item.data.judgeId,
                    questionId: item.data.questionId
                };
                data.push(tempObj);
            })
        }
        var sendData = {
            data: data,
            state: status
        };

        Ext.Ajax.request({
            url: '/api/third_view_save',
            success: function () {
                me.loadThirdViewData(data[0]);
            },
            failure: this.updateError,
            jsonData: sendData,
            disableCaching: true,
            method: 'PUT'
        });
    },

    globalSecondViewStatus: function (grid, rowIndex, colIndex) {
        var me = this;
        var store = Ext.getStore('studentDetailData'), status;
        var data = [];
        var changeTo = Ext.getCmp('detailAllButton').tooltip;
        var tempObj;
        var choice = '';
        Ext.Msg.show({
            title: 'Global Grade Change',
            msg: 'Which change would you like to perform?',
            width: 400,
            closable: true,
            buttons: Ext.Msg.YESNOCANCEL,
            buttonText: {
                ok: 'Accept-All',
                yes: 'Pending-All',
                no: 'Reject-All',
                cancel: 'Cancel'
            },
            fn: function (buttonValue, inputText, showConfig) {

                if (buttonValue == 'ok') {
                    choice = 'Accept-All';
                }
                else if (buttonValue == 'yes') {
                    choice = 'Pending-All';
                }
                else if (buttonValue == 'no') {
                    choice = 'Reject-All';
                }
                else {
                    choice = 'cancel';
                }

                if (choice != 'cancel') {

                    Ext.getCmp('detailAllButton').tooltip = choice;

                    changeTo = choice;

                    if (changeTo === 'Accept-All') {
                        status = 'Accepted';
                    }
                    else if (changeTo === 'Pending-All') {
                        status = 'Pending';
                    }
                    else {
                        status = 'Rejected';
                    }

                    store.data.items.forEach(function (item) {
                        tempObj = {
                            studentId: item.data.studentId,
                            judgeId: item.data.judgeId
                        };
                        data.push(tempObj);
                    })

                    var sendData = {
                        data: data,
                        state: status
                    };

                    Ext.Ajax.request({
                        url: '/api/second_view_save',
                        success: function () {
                            me.loadSecondViewData(data[0]);
                        },
                        failure: this.updateError,
                        jsonData: sendData,
                        disableCaching: true,
                        method: 'PUT'
                    });
                }


            }
        });



    },

    globalThirdViewStatus: function (grid, rowIndex, colIndex) {
        var me = this;
        var store = Ext.getStore('judgeGrades'), status;
        var data = [];
        var changeTo = Ext.getCmp('detailAllThirdButton').tooltip;
        var tempObj;
        var choice = '';
        Ext.Msg.show({
            title: 'Global Grade Change',
            msg: 'Which change would you like to perform?',
            width: 400,
            closable: true,
            buttons: Ext.Msg.YESNOCANCEL,
            buttonText: {
                ok: 'Accept-All',
                yes: 'Pending-All',
                no: 'Reject-All',
                cancel: 'Cancel'
            },
            fn: function (buttonValue, inputText, showConfig) {

                if (buttonValue == 'ok') {
                    choice = 'Accept-All';
                }
                else if (buttonValue == 'yes') {
                    choice = 'Pending-All';
                }
                else if (buttonValue == 'no') {
                    choice = 'Reject-All';
                }
                else {
                    choice = 'cancel';
                }

                if (choice != 'cancel') {

                    Ext.getCmp('detailAllThirdButton').tooltip = choice;

                    changeTo = choice;

                    if (changeTo === 'Accept-All') {
                        status = 'Accepted';
                    }
                    else if (changeTo === 'Pending-All') {
                        status = 'Pending';
                    }
                    else {
                        status = 'Rejected';
                    }

                    store.data.items.forEach(function (item) {
                        tempObj = {
                            studentId: item.data.studentId,
                            judgeId: item.data.judgeId,
                            questionId: item.data.questionId
                        };
                        data.push(tempObj);
                    })

                    var sendData = {
                        data: data,
                        state: status
                    };

                    Ext.Ajax.request({
                        url: '/api/third_view_save',
                        success: function () {
                            me.loadThirdViewData(data[0]);
                        },
                        failure: this.updateError,
                        jsonData: sendData,
                        disableCaching: true,
                        method: 'PUT'
                    });
                }


            }
        });



    },

    updateMainStore: function () {
        var me = this;
        var mainStore = Ext.getStore('studentgradesview');
        me.changeIcon();
        mainStore.load();
    }
    ,

    onStatesLoaded: function (store, records) {
        var filter = store.getStoreId().replace(/States/, 'Filter');
        this.model.set(filter, records);
    }
    ,

    changeIcon: function () {
        var me = this;
        var items;

        if (me.status === null || !me.status)
            items = Ext.getStore('studentgradesview').data.items;
        else
            items = [{data: {accepted: me.status}}];

        var green = false;
        var yellow = false;
        var red = false;

        items.forEach(function (item) {
            if (item.data.accepted == true) {
                Ext.getCmp('topIcon').setSrc('/resources/images/icons/Green.ico');
                green = true;
            }
            if (item.data.pending == true) {
                Ext.getCmp('topIcon').setSrc('/resources/images/icons/Yellow.ico');
                yellow = true
            }
            if (item.data.rejected == true) {
                Ext.getCmp('topIcon').setSrc('/resources/images/icons/Red.ico');
                red = true;
            }

            if (green && yellow) {
                Ext.getCmp('topIcon').setSrc('/resources/images/icons/YellowGreen.ico');
            }
            if (green && red) {
                Ext.getCmp('topIcon').setSrc('/resources/images/icons/RedGreen.ico');
            }
            if (red && yellow) {
                Ext.getCmp('topIcon').setSrc('/resources/images/icons/RedYellow.ico');
            }
            if (red && yellow && green) {
                Ext.getCmp('topIcon').setSrc('/resources/images/icons/RedYellowGreen.ico');
            }
        })
    }
    ,

    changeIconSecondView: function () {
        var me = this;
        var items;

        if (me.status === null || !me.status)
            items = Ext.getStore('studentDetailData').data.items;
        else
            items = [{data: {accepted: me.status}}];

        var green = false;
        var yellow = false;
        var red = false;

        items.forEach(function (item) {
            if (item.data.accepted == true) {
                Ext.getCmp('detailAllButton').setSrc('/resources/images/icons/Green.ico');
                green = true;
            }
            if (item.data.pending == true) {
                Ext.getCmp('detailAllButton').setSrc('/resources/images/icons/Yellow.ico');
                yellow = true
            }
            if (item.data.rejected == true) {
                Ext.getCmp('detailAllButton').setSrc('/resources/images/icons/Red.ico');
                red = true;
            }

            if (green && yellow) {
                Ext.getCmp('detailAllButton').setSrc('/resources/images/icons/YellowGreen.ico');
            }
            if (green && red) {
                Ext.getCmp('detailAllButton').setSrc('/resources/images/icons/RedGreen.ico');
            }
            if (red && yellow) {
                Ext.getCmp('detailAllButton').setSrc('/resources/images/icons/RedYellow.ico');
            }
            if (red && yellow && green) {
                Ext.getCmp('detailAllButton').setSrc('/resources/images/icons/RedYellowGreen.ico');
            }
        })
    }
    ,

    changeIconThirdView: function () {
        var me = this;
        var items;

        if (me.status === null || !me.status)
            items = Ext.getStore('judgeGrades').data.items;
        else
            items = [{data: {accepted: me.status}}];

        var green = false;
        var yellow = false;
        var red = false;

        items.forEach(function (item) {
            if (item.data.accepted === "Accepted") {
                Ext.getCmp('detailAllThirdButton').setSrc('/resources/images/icons/Green.ico');
                green = true;
            }
            if (item.data.accepted === "Pending") {
                Ext.getCmp('detailAllThirdButton').setSrc('/resources/images/icons/Yellow.ico');
                yellow = true
            }
            if (item.data.accepted === "Rejected") {
                Ext.getCmp('detailAllThirdButton').setSrc('/resources/images/icons/Red.ico');
                red = true;
            }

            if (green && yellow) {
                Ext.getCmp('detailAllThirdButton').setSrc('/resources/images/icons/YellowGreen.ico');
            }
            if (green && red) {
                Ext.getCmp('detailAllThirdButton').setSrc('/resources/images/icons/RedGreen.ico');
            }
            if (red && yellow) {
                Ext.getCmp('detailAllThirdButton').setSrc('/resources/images/icons/RedYellow.ico');
            }
            if (red && yellow && green) {
                Ext.getCmp('detailAllThirdButton').setSrc('/resources/images/icons/RedYellowGreen.ico');
            }
        })
    }
    ,

    onFilterChange: function (selModel, selections) {
        var filter = selections.map(function (r) {
            return r.get('abbr');
        });

        if(filter.indexOf("AC") > -1 && filter.indexOf("DR") > -1 && filter.indexOf("IN") > -1){
            filter = ["PAR","PA","PR","AR","P","A","R"];
        }
        else if(filter.indexOf("AC") > -1 && filter.indexOf("DR") > -1){
            filter = ["PAR","PA","PR","AR","P","A"];
        }
        else if(filter.indexOf("AC") > -1 && filter.indexOf("IN") > -1){
            filter = ["PAR","PA","PR","AR","A","R"];
        }
        else if(filter.indexOf("DR") > -1 && filter.indexOf("IN") > -1){
            filter = ["PAR","PA","PR","AR","P","R"];
        }
        else if(filter.indexOf("AC") > -1){
            filter = ["PAR","PA","AR","A"];
        }
        else if(filter.indexOf("DR") > -1){
            filter = ["PAR","PA","PR","P"];
        }
        else if(filter.indexOf("IN") > -1){
            filter = ["PAR","PR","AR","R"];
        }
        else{
            filter = [];
        }

        this.model.getStore(selModel.storeId).filter('filterStatus', Ext.isEmpty(filter) ? 'XX' : filter);

    },


    statusManager: function () {
        var me = this;
        var data = {
            ids: null,
            state: null
        };
        var ids = [];
        var mainStore = Ext.getStore('studentgradesview');
        var changeTo = Ext.getCmp('topIcon').tooltip;

        var choice = '';

        Ext.Msg.show({
            title: 'Global Grade Change',
            msg: 'Which change would you like to perform?',
            width: 400,
            closable: true,
            buttons: Ext.Msg.YESNOCANCEL,
            buttonText: {
                ok: 'Accept-All',
                yes: 'Pending-All',
                no: 'Reject-All',
                cancel: 'Cancel'
            },
            fn: function (buttonValue, inputText, showConfig) {

                if (buttonValue == 'ok') {
                    choice = 'Accept-All';
                }
                else if (buttonValue == 'yes') {
                    choice = 'Pending-All';
                }
                else if (buttonValue == 'no') {
                    choice = 'Reject-All';
                }
                else {
                    choice = 'cancel';
                }

                if (choice != 'cancel') {
                    mainStore.data.items.forEach(function (row) {
                        ids.push(row.data.studentId);
                    })
                    data['ids'] = ids;

                    changeTo = choice;

                    if (changeTo === 'Accept-All') {
                        data['state'] = 'Accepted';
                    }
                    if (changeTo === 'Pending-All') {
                        data['state'] = 'Pending';
                    }
                    if (changeTo === 'Reject-All') {
                        data['state'] = 'Rejected';
                    }


                    Ext.Ajax.request({
                        url: '/api/views_table_changeAll',
                        success: function () {

                            Ext.getCmp('topIcon').tooltip = choice;

                            me.status = data['state'];

                            me.changeIcon();
                            mainStore.load();
                            me.status = null;

                        },
                        failure: this.updateError,
                        jsonData: data,
                        disableCaching: true,
                        method: 'PUT'
                    });
                }

            },

            multiline: false,
            icon: Ext.Msg.QUESTION
        });


    },

    onExportGradeReport: function () {
        var linkURL = '/api/views_table?count=999';

        if(document.getElementById('AcceptedGrades').className == 'selected' ){
            linkURL = linkURL + '&filterStatus=PAR&filterStatus=PA&filterStatus=AR&filterStatus=A';
        }
        if(document.getElementById('PendingGrades').className == 'selected' ){
            linkURL = linkURL + '&filterStatus=PAR&filterStatus=PA&filterStatus=PR&filterStatus=P';
        }
        if(document.getElementById('RejectedGrades').className == 'selected' ){
            linkURL = linkURL + '&filterStatus=PAR&filterStatus=PR&filterStatus=AR&filterStatus=R';
        }
        if(linkURL == '/api/views_table?count=999'){
            alert("No Filters Selected!");
            return;
        }

        if(document.getElementById('studentIdxColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=studentId';
        }
        else if(document.getElementById('studentIdxColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-studentId';
        }
        else if(document.getElementById('studentNameColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=fullName';
        }
        else if(document.getElementById('studentNameColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-fullName';
        }
        else if(document.getElementById('studentEmailColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=email';
        }
        else if(document.getElementById('studentEmailColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-email';
        }
        else if(document.getElementById('studentProjColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=project';
        }
        else if(document.getElementById('studentProjColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-project';
        }
        else if(document.getElementById('studentAgColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=grade';
        }
        else if(document.getElementById('studentAgColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-grade';
        }
        else if(document.getElementById('studentRgColumn').className.includes('x-column-header-sort-ASC')){
            linkURL = linkURL + '&sort=rawGrade';
        }
        else if(document.getElementById('studentRgColumn').className.includes('x-column-header-sort-DESC')){
            linkURL = linkURL + '&sort=-rawGrade';
        }

        Ext.Ajax.request({
            url: linkURL,
            method: 'GET',
            success: function (response, options) {
                JSONToCSVConvertor(Ext.decode(response.responseText), "Student Grade Report", true);
            }

        });
    },


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
