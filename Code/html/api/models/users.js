module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', {
		role: {
			type: DataTypes.INTEGER(3),
			allowNull: false,
			defaultValue: 2
		},
		state: {
			type: DataTypes.INTEGER(3),
			allowNull: false,
			defaultValue: 1
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: true
		},
		salutation: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		affiliation: {
			type: DataTypes.STRING,
			allowNull: true
		},
		location: {
			type: DataTypes.INTEGER(3),
			allowNull: false,
			defaultValue: 0
		},
		oauth: {
			type: DataTypes.STRING,
		    allowNull: true
			/*get: function() {
				return JSON.parse(this.getDataValue('oauth'));
			},
			set: function(value) {
				this.setDataValue('oauth', JSON.stringify(value));
			}*/
		},
		/*token: {
			type: DataTypes.STRING,
			allowNull: true
		},*/
		profileImgUrl: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		classMethods: {
			associate: function (models) {
				user.hasMany(models.email);
				user.belongsTo(models.term);
				user.belongsTo(models.project);

				user.belongsToMany(models.user, {
					as: 'ConflictJudges',
					through: models.conflict,
					foreignKey: 'studentId'
				});
				user.belongsToMany(models.user, {
					as: 'ConflictStudents',
					through: models.conflict,
					foreignKey: 'judgeId'
				});

				user.addScope('current', {
					include: [
						{ model: models.term, where: { active: true }}
					]
				});
			}
		},
		getterMethods: {
			fullName: function() {
				return this.getDataValue('firstName') + ' ' + this.getDataValue('lastName');
			}
		},
		setterMethods: {
			fullName: function(value) {
				var names = value.split(' ');
				this.setDataValue('firstname', names.slice(0, -1).join(' '));
				this.setDataValue('lastname', names.slice(-1).join(' '));
			}
		},
		scopes: {
			students: { where: { role: 1 } },
			judges:   { where: { role: 2 } },
			admins:   { where: { role: 3 } }
		}
	});

	return user;
};
