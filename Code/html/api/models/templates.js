var Promise = require('bluebird');

module.exports = function(sequelize, DataTypes) {
	var template = sequelize.define('template', {
		id: {
			type: DataTypes.INTEGER(5),
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		subject: {
			type: DataTypes.STRING,
			allowNull: false
		},
		body: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		classMethods: {
			evalContext: function(field) {
				var db = sequelize.models;
				return function(ctx) {
					return db.placeholder
							.resolve(ctx, field)
							.reduce(function (body, rep) {
								var re = new RegExp('\\[\\[' + rep.code + '\\]\\]', 'g');
								return body.replace(re, rep.value);
							}, ctx.template[field]);
				}
			},
			getPreview: function(userId, templateId, address) {
				return sequelize.query('call onlinejudges7.sp_getPreviewContext(?,?,?);', {
					replacements:[userId, templateId, address || null],
					type: sequelize.QueryTypes.SELECT
				}).then(function(ctx) {
					if (ctx && ctx[0] && ctx[0][0] && ctx[0][0].context) {
						var context = JSON.parse(ctx[0][0].context, jsonDateReviver);
						context.email.sentId = sequelize.models.email.getSentId(context.email.id, context.email.createdAt);
						return Promise.map(['subject','body'], function(field){
							return template.evalContext(field)(context);
						});
					}
					return null;
				});
			}
		}
	});

	return template;
};
