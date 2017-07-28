var epilogue = require('epilogue');
var	fetch = require('node-fetch');
fetch.Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(server, db) {
	var trim = /^\/|\/$/g;

    server.put(apiPrefix + '/views_table_changeAll', function(req, res, next) {
        var state = req.body.state;
        var ids = req.body.ids;
		var stateId = 0;
        var count = 0;
        
        if(state == "Accepted"){
            stateId = 1;
        }
        else if(state == "Rejected"){
            stateId = 2;
        }
        else
        {
            stateId = 0;
        }
        ids.forEach(function(id){
            fetch.Promise.all([
                db.grade.update({state: stateId}, {
                    where: {
                        studentId: id
                    }
                }),
            ]).then(function(arr){
                    count++;
                    if(count === ids.length)
                    {
                        res.json({result: true});
                    }
                })
        });
        next();
    });
    
    server.put(apiPrefix + '/views_table/:id', function(req, res, next) {
        
		var acc = req.body.accepted;
        var pen = req.body.pending;
        var rej = req.body.rejected;
        var stateId = 0;
        if(acc && !pen && !rej) {
            stateId = 2;
        }
        else if(!acc && pen && !rej) {
            stateId = 1;
        }
        else if(!acc && !pen && rej) {
            stateId = 0;
        }
        else
        {
            stateId = 1;
        }
        fetch.Promise.all([
            db.grade.update({state: stateId}, {
                where: {
                    studentId: req.params.studentId
                }
            }),
        ]).then(function(arr){
                res.json({result: true});
            })
	});
    
	return epilogue.resource({
		model: db.student_grade,
		pagination: true,
		actions: ['list'],
		search: {
			param: 'query',
			attributes: [ 'fullName' ]
		},
        endpoints: [apiPrefix + '/views_table']
	});
};
