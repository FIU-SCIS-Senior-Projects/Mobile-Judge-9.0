var epilogue = require('epilogue');
var	fetch = require('node-fetch');
fetch.Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(server, db) {
	var trim = /^\/|\/$/g;
    
    server.post(apiPrefix + '/second_view', function(req, res, next) {
        db.judges_grade.findAll({
            where: {
                studentId: req.params.studentId,
            }
        }).then(function(judge_grades){
            var iteration = 0;
            var response = [];
            var obj = {
                            judgeName: judge_grades[0].judge,
                            gradeAverage: 0,
			    rawGrade:0,
                            studentId: judge_grades[0].studentId,
                            judgeId: judge_grades[0].judgeId,
                            accepted: false,
                            rejected: false,
                            pending: false
                        };
            
            judge_grades.forEach(function(jg){
                if(obj.judgeId != jg.judgeId){
                    response.push(obj);
                    obj = {
                                judgeName: jg.judge,
                                gradeAverage: jg.accepted === "Accepted" ? jg.grade:0, 
				rawGrade:jg.grade,
                                studentId: jg.studentId,
                                judgeId: jg.judgeId,
                                accepted: false,
                                rejected: false,
                                pending: false
                            };
                }
                else{
                    if(jg.accepted == "Accepted"){
                        obj.accepted = true;
                        obj.gradeAverage = obj.gradeAverage + jg.grade;
			obj.rawGrade = obj.rawGrade + jg.grade;
                        
                    } 
                    else if(jg.accepted == "Pending") {
			obj.pending = true; 
			obj.rawGrade = obj.rawGrade + jg.grade;
		    }
                    else {
			obj.rejected = true; 
			obj.rawGrade = obj.rawGrade + jg.grade;
		    }
                }
                iteration++;
                if(iteration === judge_grades.length){
                    response.push(obj);
                    res.json(response);
                }
            })
        })
        next();
	});
    
    server.put(apiPrefix + '/second_view_save', function(req, res, next) {

        var stateId = 0;
        var count = 0;
        var data = req.params.data;

        
        if(req.params.state == "Accepted"){
            stateId = 1;
        }
        else if(req.params.state == "Rejected"){
            stateId = 2;
        }
        else
        {
            stateId = 0;
        }
        
        if(data.length == 1){
            fetch.Promise.all([
                db.grade.findAll({
                    where: {
                        studentId: data[0].studentId,
                        judgeId: data[0].judgeId
                    }
                }),
            ]).then(function(arr){
                    var grades = arr[0];
                    data.forEach(function(obj){
                        grades.forEach(function(grade){
                            if(grade.judgeId == obj.judgeId){
                                grade.state = stateId;
                                grade.save();
                            }
                        })
                        count++;

                        if(count === data.length)
                        {

                            res.json({result: true});
                            next();
                        }
                    })
                })    
        }
        else{
            fetch.Promise.all([
                db.grade.findAll({
                    where: {
                        studentId: data[0].studentId
                    }
                }),
            ]).then(function(arr){
                    var grades = arr[0];
                    data.forEach(function(obj){
                        grades.forEach(function(grade){
                            if(grade.judgeId == obj.judgeId){
                                grade.state = stateId;
                                grade.save();
                            }
                        })
                        count++;

                        if(count === data.length)
                        {

                            res.json({result: true});
                            next();
                        }
                    })
                })
        }
	});
    
	return epilogue.resource({
		model: db.judges_grade,
        endpoints: [apiPrefix + '/second_view']
	});
};
