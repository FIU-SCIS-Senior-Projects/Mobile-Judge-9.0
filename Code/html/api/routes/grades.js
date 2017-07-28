var forbidden = require('restify').errors.ForbiddenError,
	notFound = require('restify').errors.NotFoundError,
	Promise = require('bluebird'),
	epilogue = require('epilogue'),
	_ = require('lodash');

module.exports = function(server, db) {

	server.get(apiPrefix + '/grades/students', function (req, res, next) {
		if (!req.user || req.user.role !== 2) return next(new notFound('You don\'t have any students to grade'));

		db.students_by_judge.findAll({
			where: {
				judgeId: req.user.id
			},
			order: 'fullName'
		}).then(function(students) {
			res.json(students.map(function(s) {
				return _.mapKeys(_.omit(s.dataValues, 'judgeId'), function(value, key) {
					return key == 'studentId' ? 'id' : key;
				});
			}));
			next();
		});
	});

	server.get(apiPrefix + '/grades', function (req, res, next) {
		if (!req.user) return next(new forbidden('You don\'t have access to grades'));

		var sendGrades = function(grades){
			res.json(grades);
			next();
		};

		switch (req.user.role) {
			case 2: // Judge
				db.grade.findAll({
					attributes: ['studentId', 'questionId', 'value', 'comment', 'state'],
					where: {
						judgeId: req.user.id
					}
				}).then(function(grades){
					sendGrades(grades.map(function(g) {
						return {
							id: g.studentId + '-' + g.questionId,
							state: g.state,
							value: g.value,
							comment: g.comment
						};
					}));
				});
				break;
			case 3: // Admin
				db.term.getActiveTerm().then(function(term){
					db.grade.findAll({
						where: {
							termId: term.id
						}
					}).then(sendGrades);
				});
				break;
			default:
				return next(new forbidden('You don\'t have access to grades'));
		}
	});

	server.put(apiPrefix + '/grades', function (req, res, next) {
		switch (req.user.role) {
			case 2: // Judge
				db.term.getActiveTerm().then(function(term) {
					Promise.map(req.body, function(grade) {
						return db.grade.update({
							value: grade.value,
							comment: grade.comment,
							state: 0
						}, {
							where: {
								studentId: grade.studentId,
								questionId: grade.questionId,
								termId: term.id,
								judgeId: req.user.id,
								state: {
									'$ne': 1
								}
							}
						});
					}).then(function() {
						db.students_by_judge.count({
							where: {
								judgeId: req.user.id,
								total: {
									'$ne': db.sequelize.col('graded')
								}
							}
						}).then(function(pending) {
							var state = pending ? 7 : 8;
							db.user.update({ state: state }, {
								where: {
									id: req.user.id,
									state: {
										'$ne': state
									}
								}
							}).then(_.noop);
						});
					});

					res.send(204);
					next();
				});
				break;
			case 3: // Admin
				res.json(req.body);
				next();
				break;
			default:
				return next(new forbidden('You don\'t have access to grades'));
		}
	});

	/*var grades = epilogue.resource({
		model: db.grade,
		excludeAttributes: ['createdAt', 'updatedAt'],
		actions: ['list'],
		pagination: false,
		endpoints: [apiPrefix + '/grades']
	});

	grades.use({
		list: {
			fetch: {
				before: function(req, res, context) {
					/!*context.criteria = _.assign(filter || {}, req.params, context.criteria);
					return context.continue;*!/
					switch (req.user.role) {
						case 2: // Judge
							//filter by judgeId
							break;
						case 3: // Admin
							//filter by term
							break;
					}
					if (req.user.role == 3)

					/!*res.send(201, req.body);
					return context.stop();*!/
					return context.continue;
				}
			}
		}
	});

	return {
		grades: grades
	};*/
};
