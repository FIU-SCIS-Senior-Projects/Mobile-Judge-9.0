module.exports = function(sequelize, DataTypes) {
	var project = sequelize.define('project', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		classMethods: {
			associate: function (models) {
				project.belongsTo(models.term);
				project.hasMany(models.user, {
					as: 'Students',
					scope: { role: 1 }
				});

				project.addScope('current', {
					include: [
						{ model: models.term, where: { active: true }}
					]
				});
			}
		}
	});

	return project;
};
