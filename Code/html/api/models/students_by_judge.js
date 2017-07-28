module.exports = function(sequelize, DataTypes) {
	var sbj = sequelize.define('students_by_judge', {
		judgeId: DataTypes.INTEGER(3),
		studentId: DataTypes.INTEGER(3),
		fullName: DataTypes.STRING,
		profileImgUrl: DataTypes.STRING,
		project: DataTypes.STRING,
		location: DataTypes.STRING,
		total: DataTypes.INTEGER(3),
		graded: DataTypes.INTEGER(3),
		accepted: DataTypes.INTEGER(3)
	}, {
		timestamps: false,
		tableName: 'student_by_judge',
		classMethods: {
			associate: function () {
				sbj.removeAttribute('id');
			}
		}
	});
	return sbj;
};
