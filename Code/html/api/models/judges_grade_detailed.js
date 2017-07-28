module.exports = function(sequelize, DataTypes) {
 var judges_grade_detail = sequelize.define('judges_grade_detail', {
        judgeId: DataTypes.INTEGER,
        fullName: DataTypes.STRING,
 email: DataTypes.STRING,
        state: DataTypes.STRING,
        accepted: DataTypes.BOOLEAN,
        pending: DataTypes.BOOLEAN,
        rejected: DataTypes.BOOLEAN,
 }, {
  timestamps: false,
  tableName: 'judges_grade_detailed',
  classMethods: {
   associate: function () {
    judges_grade_detail.removeAttribute('id');
   }
  }
 }
    );
 return judges_grade_detail;
};
