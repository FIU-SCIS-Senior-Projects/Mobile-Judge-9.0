var phpdate = require('phpdate-js'),
	vm = require('vm'),
	_ = require('lodash');

module.exports = function(sequelize, DataTypes) {

	function getPlaceHolders(field) {
		var reg = /\[\[(\w+)\]\]/g;
		var res = {};

		var match = reg.exec(field);
		while (match != null) {
			res[match[1]] = true;
			match = reg.exec(field);
		}

		return Object.keys(res);
	}

	return sequelize.define('placeholder', {
		id: {
			type: DataTypes.INTEGER(3),
			primaryKey: true,
			autoIncrement: true
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false
		},
		text: {
			type: DataTypes.STRING,
			allowNull: false
		},
		value: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		classMethods: {
			resolve: function(ctx, field) {
				ctx.phpdate = phpdate;
				vm.createContext(ctx);

				return this.sequelize.models.placeholder.findAll({
					attributes: ['code', 'value'],
					where: {
						code: {
							$in: getPlaceHolders(ctx.template[field])
						}
					}
				}).map(function(p) {
					var res = _.assign({}, p.dataValues);
					res.value = vm.runInContext(res.value || '""', ctx);
					return res;
				});
			}
		}
	});
};
