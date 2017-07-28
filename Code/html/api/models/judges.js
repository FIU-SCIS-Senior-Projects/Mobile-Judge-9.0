module.exports = function(sequelize, DataTypes) {
	var judge = sequelize.define('judge', {
		state: DataTypes.STRING,
		abbr: DataTypes.STRING,
		fullName: DataTypes.STRING,
		email: DataTypes.STRING,
		title: DataTypes.STRING,
		affiliation: DataTypes.STRING,
		profileImgUrl: DataTypes.STRING,
		/*termName: DataTypes.STRING,
		mapImageUrl: DataTypes.STRING,*/
		password: DataTypes.STRING,
		oauth: DataTypes.STRING
	}, {
		timestamps: false
	});

	return judge;
};
