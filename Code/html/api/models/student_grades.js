module.exports = function(sequelize, DataTypes) {
	var student_grade = sequelize.define('student_grade', {
        studentId: DataTypes.INTEGER,
	email: DataTypes.STRING,
        termId: DataTypes.INTEGER,
        state: DataTypes.STRING,
	abbr: DataTypes.STRING,
	fullName: DataTypes.STRING,
        project: DataTypes.STRING,
	grade: DataTypes.DECIMAL,
	rawGrade: DataTypes.DECIMAL,
	max: DataTypes.DECIMAL,
        accepted: DataTypes.BOOLEAN,
        pending: DataTypes.BOOLEAN,
        rejected: DataTypes.BOOLEAN,
	filterStatus: DataTypes.STRING,
	}, {
		timestamps: false,
		tableName: 'student_grades_detailed',
		classMethods: {
			associate: function () {
				student_grade.removeAttribute('id');
			}
		}
	});
    
	return student_grade;
};
