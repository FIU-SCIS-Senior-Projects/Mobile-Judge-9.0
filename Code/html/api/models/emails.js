var Promise = require('bluebird'),
	crypt = require('../utils/crypt.js');

module.exports = function(sequelize, DataTypes) {

	var email = sequelize.define('email', {
		id: {
			type: DataTypes.INTEGER(10),
			primaryKey: true,
			autoIncrement: true
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		classMethods: {
			associate: function (models) {
				email.belongsTo(models.term);
				email.belongsTo(models.template);
				email.belongsTo(models.user);
			},
			getSentId: function(id, createdAt) {
				createdAt = createdAt === undefined
						? crypt.randomValueHex(13)
						: createdAt.getTime();
				return crypt.encrypt([id, createdAt].join()).toUpperCase();
			},
			getContext: function(id) {
				return sequelize.query('call onlinejudges7.sp_getEmailContext(?);', {
					replacements:[id],
					type: sequelize.QueryTypes.SELECT
				}).then(function(ctx) {
					if (ctx && ctx[0] && ctx[0][0] && ctx[0][0].context) {
						var context = JSON.parse(ctx[0][0].context, jsonDateReviver);
						context.email.sentId = email.getSentId(context.email.id, context.email.createdAt);
						return context;
					}
					return null;
				});
			},
			evalContext: function(field) {
				var db = sequelize.models;
				return function(ctx) {
					return ctx == null
					? Promise.resolve(null)
					: db.placeholder
						.resolve(ctx, field)
						.reduce(function (body, rep) {
							var re = new RegExp('\\[\\[' + rep.code + '\\]\\]', 'g');
							return body.replace(re, rep.value);
						}, ctx.template[field]);
				}
			},
			getSubject: function(id) {
				return email.getContext(id).then(this.evalContext('subject'));
			},
			getBody: function(id) {
				return email.getContext(id).then(this.evalContext('body'));
			}
		},
		instanceMethods: {
			getContext: function() {
				return email.getContext(this.getDataValue('id'));
			},
			getSubject: function() {
				return this.getContext().then(email.evalContext('subject'));
			},
			getBody: function() {
				return this.getContext().then(email.evalContext('body'));
			},
			render: function() {
				var me = this;
				return me.getContext().then(function(context) {
					return Promise.map(['subject', 'body'], function (field) {
						return email.evalContext(field)(context);
					}).then(function (render) {
						return {
							address: me.address,
							subject: render[0],
							body: render[1]
						};
					})
				});
			}
		},
		getterMethods: {
			sentId: function() {
				return email.getSentId(this.getDataValue('id'), this.getDataValue('createdAt'));
			}
		}
	});

	return email;
};
