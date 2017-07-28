module.exports = function(sequelize, DataTypes) {
	var student = sequelize.define('student', {
		state: DataTypes.STRING,
		abbr: DataTypes.STRING,
		fullName: DataTypes.STRING,
		email: DataTypes.STRING,
		profileImgUrl: DataTypes.STRING,
		project: DataTypes.STRING,
		location: DataTypes.STRING,
		/*termName: DataTypes.STRING,
		mapImageUrl: DataTypes.STRING,*/
		grade: DataTypes.FLOAT,
		max: DataTypes.INTEGER,
		grade_display: DataTypes.STRING,
		password: DataTypes.STRING,
		oauth: DataTypes.STRING
	}, {
		timestamps: false
	});

	return student;
};
