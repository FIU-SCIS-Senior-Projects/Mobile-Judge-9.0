
module.exports = function(sequelize, DataTypes) {
        var grade = sequelize.define('grade', {
                value: {
                        type: DataTypes.INTEGER(3),
                        allowNull: true
                },
                comment: {
                        type: DataTypes.TEXT,
                        allowNull: true
                },
                state: {
                        type: DataTypes.INTEGER(3),
                        allowNull: false,
                        defaultValue: 0
                },
                studentId: {
                        type: DataTypes.INTEGER(3),
                        allowNull: false
                },
                judgeId: {
                        type: DataTypes.INTEGER(3),
                        allowNull: false
                },
        }, {
                classMethods: {
                        associate: function (models) {
                                grade.removeAttribute('id');
                                grade.belongsTo(models.term);
                                grade.belongsTo(models.question);
                                grade.belongsTo(models.user, {
                                        as: 'Judge',
                                        foreignKey: 'judgeId'
                                });
                                grade.belongsTo(models.user, {
                                        as: 'Student',
                                        foreignKey: 'studentId'
                                });
                        }
                }
        });

        return grade;
};


