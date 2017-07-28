module.exports = function(sequelize, DataTypes) {
	var conflict = sequelize.define('conflict', {}, {
		classMethods: {
			associate: function (models) {
				conflict.removeAttribute('id');
				conflict.belongsTo(models.term);
				conflict.belongsTo(models.user, {
					as: 'Judge',
					foreignKey: 'judgeId'
				});
				conflict.belongsTo(models.user, {
					as: 'Student',
					foreignKey: 'studentId'
				});
			}
		}
	});

	return conflict;
};
