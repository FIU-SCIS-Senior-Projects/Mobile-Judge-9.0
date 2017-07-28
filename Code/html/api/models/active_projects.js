module.exports = function(sequelize, DataTypes) {
	return sequelize.define('active_project', {
		name: DataTypes.STRING
	}, {
		//tableName: 'active_projects',
		timestamps: false
	});
};
