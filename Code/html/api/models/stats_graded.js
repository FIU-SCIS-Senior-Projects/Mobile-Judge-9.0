module.exports = function(sequelize, DataTypes) {
	var stats = sequelize.define('stats_graded', {
		state: {
			type: DataTypes.STRING,
			get: function()  {
				var state = this.getDataValue('state'),
						total = this.getDataValue('total');
				return state + ': ' + total;
			}
		},
		total: DataTypes.INTEGER(3)
	}, {
		timestamps: false,
		tableName: 'stats_graded',
		classMethods: {
			associate: function () {
				stats.removeAttribute('id');
			}
		}
	});
	return stats;
};
