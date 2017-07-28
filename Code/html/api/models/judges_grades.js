module.exports = function(sequelize, DataTypes) {
	var judges_grade = sequelize.define('judges_grade', {
        judge: DataTypes.STRING,
        student: DataTypes.STRING,
	question: DataTypes.STRING,
        grade: DataTypes.INTEGER,
        projectName: DataTypes.STRING,
        comment: DataTypes.STRING,
	accepted: DataTypes.STRING,
        studentId: DataTypes.INTEGER,
        judgeId: DataTypes.INTEGER,
        questionId: DataTypes.INTEGER
	}, {
		timestamps: false,
		tableName: 'judges_grades',
		classMethods: {
			associate: function () {
				judges_grade.removeAttribute('id');
			}
		}
	}
    );
	return judges_grade;
};
