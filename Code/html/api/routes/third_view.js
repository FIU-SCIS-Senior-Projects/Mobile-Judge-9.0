var epilogue = require('epilogue');
var	fetch = require('node-fetch');
fetch.Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(server, db) {
	var trim = /^\/|\/$/g;

server.post(apiPrefix + '/third_view', function(req, res, next) {
        
        db.judges_grade.findAll({
            where: {
                studentId: req.params.studentId,
                judgeId: req.params.judgeId
            }
        }).then(function(judge_grades){
                res.json(judge_grades);
            })
        next();
	});   
       
    server.put(apiPrefix + '/third_view_save', function(req, res, next) {
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
        
        data.forEach(function(obj){
            fetch.Promise.all([
                db.grade.update({state: stateId}, {
                    where: {
                        studentId: obj.studentId,
                        judgeId: obj.judgeId,
                        questionId: obj.questionId
                    }
                }),
            ]).then(function(arr){
                    count++;
                    if(count === data.length)
                    {
                        res.json({result: true});
                    }
                })
        });
	});
    
    server.post(apiPrefix + '/third_view_save_edited', function(req, res, next) {
        var data = req.params;
        var count = 0;
        data.forEach(function(obj){
            fetch.Promise.all([
                db.grade.update({value: obj.grade, comment:obj.comment}, {
                    where: {
                        studentId: obj.studentId,
                        judgeId: obj.judgeId,
                        questionId: obj.questionId
                    }
                }),
            ]).then(function(arr){
                    count++;
                    if(count === data.length)
                    {
                        res.json({result: true, data: data});
                    }
                })
        });
        next();
	});
    
	return epilogue.resource({
		model: db.judges_grade,
        endpoints: [apiPrefix + '/third_view']
	});
};
