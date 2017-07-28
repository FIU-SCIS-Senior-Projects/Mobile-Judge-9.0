module.exports = function(sequelize, DataTypes) {
	var contact = sequelize.define('contact', {
		email: DataTypes.STRING,
		fullName: DataTypes.STRING,
		termId: DataTypes.INTEGER,
		role: DataTypes.INTEGER,
		state: DataTypes.INTEGER
	}, {
		timestamps: false
	});

	return contact;
};
