var notFound = require('restify').errors.NotFoundError,
	Promise = require('bluebird'),
	epilogue = require('epilogue'),
	_ = require('lodash');

module.exports = function(server, db) {

	server.get(apiPrefix + '/emails/:id/context', function (req, res, next) {
		db.email.getContext(req.params.id).then(function(body) {
			if (body == null) return next(new notFound());
			res.json(body);
			next();
		});
	});

	server.get(apiPrefix + '/emails/:id/body', function (req, res, next) {
		db.email.getBody(req.params.id).then(function(body) {
			if (body == null) return next(new notFound());
			res.html(body);
			next();
		});
	});

	server.get(apiPrefix + '/emails/:id/subject', function (req, res, next) {
		db.email.getSubject(req.params.id).then(function(subject) {
			if (subject == null) return next(new notFound());
			res.text(subject);
			next();
		});
	});

	var contacts = epilogue.resource({
			model: db.contact,
			actions: ['list'],
			endpoints: [apiPrefix + '/emails/contacts'],
			pagination: false,
			sort: {
				default: 'fullName'
			}
		}),
		selection = epilogue.resource({
			model: db.lists,
			actions: ['list'],
			pagination: false,
			endpoints: [apiPrefix + '/emails/lists']
		}),
		list = epilogue.resource({
			model: db.sent,
			actions: ['list'],
			endpoints: [apiPrefix + '/emails'],
			search: {
				param: 'query',
				attributes: [ 'fullName', 'address', 'subject' ]
			},
			sort: {
				default: '-sent'
			}
		}),
		crud = epilogue.resource({
			model: db.email,
			excludeAttributes: ['createdAt', 'updatedAt'],
			actions: ['create', 'read', 'update', 'delete'],
			endpoints: [apiPrefix + '/emails', apiPrefix + '/emails/:id']
		});

	contacts.use({
		list: {
			fetch: {
				before: function (req, res, context) {
					if (req.params.filter !== undefined) {
						req.params.filter = JSON.parse(req.params.filter);
						context.criteria = req.params.filter;
					}
					return context.continue;
				}
			},
			send: {
				before: function (req, res, context) {
					context.instance = _.uniq(context.instance, 'email');
					return context.continue;
				}
			}
		}
	});

	crud.use({
		create: {
			write: {
				before: function (req, res, context) {
					var emails = req.body.emails,
						templateId = req.body.templateId,
						importJudges = req.body.importJudges || false,
						addresses = (_.uniq(_.map(emails, 'address'))).join(),
						_emailsDic = {};

					emails.forEach(function(e) {
						if (e.firstName || e.lastName) {
							_emailsDic[e.address] = _.assign(_emailsDic[e.address] || {}, {
								firstName: e.firstName,
								lastName: e.lastName
							});
						}
					});

					return Promise.all([
						db.term.getActiveTerm(),
						db.sequelize.query('call onlinejudges7.sp_findUserAccount(?, ?);', {
							replacements:[addresses, importJudges],
							model: db.user
						}),
						db.email.findAll({
							attributes: [[db.sequelize.fn('MAX', db.sequelize.col('id')), 'lastId']]
						})
					]).then(function(r){
						var term = r[0], users = r[1][0],
							lastId = r[2][0].get('lastId'), _emails = [];

						users.forEach(function(u) {
							if (u.id > 0) {
								if (_emailsDic[u.email]) {
									u.firstName = _emailsDic[u.email].firstName || '';
									u.lastName = _emailsDic[u.email].lastName || '';
								}

								if (importJudges && u.state < 4) u.state = 2; // mark it as invited

								u.save().then(_.noop);
							}

							_emails.push({
								templateId: templateId,
								termId: term.id,
								userId: u.id,
								address: u.email
							});
						});

						return db.email.bulkCreate(_emails).then(function() {
							db.email.findAll({
								where: {
									id: { '$gt': lastId },
									templateId: templateId
								},
								order: 'id',
								limit: _emails.length
							}).then(function(sent) {
								(function processMail() {
									var mail = sent.shift();
									if (!mail) return;
									mail.render().then(function(render){
										mailer.sendMail({
											from: term.mailFrom,
											to: render.address,
											subject: render.subject,
											html: render.body
										}, function() {
											process.nextTick(processMail);
										});
									});
								})();
							});

							res.send(201, req.body);
							return context.stop();
						});
					});
				}
			}
		}
	});

	return {
		crud: crud,
		address: contacts,
		list: list,
		selection: selection
	};
};
