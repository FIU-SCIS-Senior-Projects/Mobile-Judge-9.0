module.exports = function(sequelize, DataTypes) {
	var lists = sequelize.define('lists', {
		name: DataTypes.STRING,
		students: {
			type: DataTypes.STRING,
			get: function(){
				return JSON.stringify(this.getDataValue('students')
						.split(',').map(function(i) {
							var s = i.split('|');
							return {
								id: s[0],
								abbr: s[1],
								name: s[2]
							}
						}));
			}
		},
		judges: {
			type: DataTypes.STRING,
			get: function(){
				return JSON.stringify(this.getDataValue('judges')
						.split(',').map(function(i) {
							var s = i.split('|');
							return {
								id: s[0],
								abbr: s[1],
								name: s[2]
							}
						}));
			}
		}
	}, {
		tableName: 'emails_lists',
		timestamps: false
	});

	return lists;
};
