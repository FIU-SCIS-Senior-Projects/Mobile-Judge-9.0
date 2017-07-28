module.exports = function(sequelize, DataTypes) {
	var sent = sequelize.define('sent', {
		address: DataTypes.STRING,
		fullName: DataTypes.STRING,
		subject: DataTypes.STRING,
		profileImgUrl: DataTypes.STRING,
		state: DataTypes.STRING,
		sent: DataTypes.DATE,
		replied: DataTypes.DATE
	}, {
		tableName: 'emails_sent',
		timestamps: false
	});

	return sent;
};
