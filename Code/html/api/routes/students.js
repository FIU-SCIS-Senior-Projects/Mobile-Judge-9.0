var epilogue = require('epilogue'),
	Promise = require('bluebird'),
	fetch = require('node-fetch'),
	_ = require('lodash');

module.exports = function(server, db) {
	var trim = /^\/|\/$/g;

	var getStudentsFromSpws = function(term) {
			return fetch(term.srProjectUrl.replace(trim, '') + '/getAll/' + term.srProjectToken.replace(trim, ''))
				.then(function (res) {
					return Promise.map(res.json(), function (s) {
						return _.assign(s, {termId: term.id});
					});
				});
		},
		parseId = function(id) { return parseInt(id || '0'); };

	server.get(apiPrefix + '/students/change', function(req, res, next) {
		db.term.getActiveTerm()
			.then(getStudentsFromSpws)
			.then(function(students) {
				var woProjects = _.filter(students, 'projectID', '');
				students = _.reject(students, 'projectID', '');
				var ids = _.map(students, 'id').map(parseId);
				var projects = _.uniq(_.map(students, 'projectID').map(parseId));

				Promise.all([
					db.user.scope('current', 'students').count({ where: { state: { '$ne': 10 }, id: { $in: ids } } }),
					db.user.scope('current', 'students').count({ where: { state: { '$ne': 10 }, id: { $notIn: ids } } }),
					db.active_project.count({
						where: {
							id: { $in: projects },
							termId: students[0].termId
						}
					}),
					db.active_project.count({
						where: {
							id: { $notIn: projects },
							termId: students[0].termId
						}
					})
				]).then(function(arr){
					var both = arr[0],
						dropped = arr[1],
						pBoth = arr[2],
						pDropped = arr[3];

					res.send({
						students: {
							dropped: dropped,
							update: both,
							'new': ids.length - both,
							woProject: woProjects.length
						},
						projects: {
							deactivate: pDropped,
							update: pBoth,
							'new': projects.length - pBoth
						}
					});
					next();
				});
			});
	});

	server.post(apiPrefix + '/students', function(req, res, next) {
		db.term.getActiveTerm()
			.then(getStudentsFromSpws)
			.then(function (students) {
				students = _.reject(students, 'projectID', '');
				var termId,
					ids = _.map(students, 'id').map(parseId),
					projects = _.uniq(_.map(students, function(s) {
						return {
							id: parseInt(s.projectID),
							name: s.projectTitle,
							termId: (termId = s.termId)
						};
					}), 'id');

				return Promise.map(projects, function(p) { return db.project.upsert(p);	})
					.then(function() {
						return Promise.all([
							db.user.update({state: 10}, {
								where: {
									role: 1,
									termId: termId,
									id: {$notIn: ids}
								}
							}),
							Promise.map(students, function (s) {
								return db.user.upsert({
									id: parseInt(s.id),
									email: s.email + '@fiu.edu',
									firstName: s.firstName,
									lastName: s.lastName,
									termId: s.termId,
									role: 1,
									state: s.valid ? 9 : 11,
									//location: 0,
									//profileImgUrl: s.image, // <- TODO: get image from spws
									projectId: parseInt(s.projectID)
								});
							})
						]);
					});
			})
			.then(function() {
				res.send(true);
				next();
			});
	});

	/*server.put(apiPrefix + '/students/:id', function(req, res, next) {

	});*/

	return epilogue.resource({
		model: db.student,
		excludeAttributes: ['password','oauth'],
		actions: ['list'],
		search: {
			param: 'query',
			attributes: [ 'fullName', 'project', 'email' ]
		},
		endpoints: [apiPrefix + '/students']
	});
};
