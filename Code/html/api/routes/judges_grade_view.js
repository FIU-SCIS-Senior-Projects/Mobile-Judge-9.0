var epilogue = require('epilogue');

var fetch = require('node-fetch');

fetch.Promise = require('bluebird');

var _ = require('lodash');



module.exports = function(server, db) {



    server.put(apiPrefix + '/judges_grade_view/:id', function(req, res, next) {

        

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

                    judgeId: req.params.judgeId

                }

            }),

        ]).then(function(arr){

                res.json({result: true});

            })

 });

    



 return epilogue.resource({

  model: db.judges_grade_detail,

  pagination: true,

  actions: ['list'],

  search: {

   param: 'query',

   attributes: [ 'fullName' ]

  },

        endpoints: [apiPrefix + '/judges_grade_view']

 });

};
