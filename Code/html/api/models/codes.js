module.exports = function(sequelize, DataTypes) {
	return sequelize.define('code', {
		type: {
			type: DataTypes.ENUM('ROLES', 'STATES', 'GRADES', 'LOCATIONS', 'PROVIDERS'),
			allowNull: false,
			primaryKey: true
		},
		id: {
			type: DataTypes.INTEGER(3),
			allowNull: false,
			primaryKey: true
		},
		abbr: {
			type: DataTypes.STRING,
			allowNull: true,
			get: function()  {
				var abbr = this.getDataValue('abbr');
				return (abbr) ? abbr.substr(1) : null;
			},
			set: function(val) {
				var role = (this.getDataValue('abbr') || '').substr(0, 1);
				this.setDataValue('abbr', role + val.toUpperCase());
			}
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		scopes: {
			roles:      { where: { type: 'roles' } },
			grades:     { where: { type: 'grades' } },
			locations:  { where: { type: 'locations' } },
			//providers:  { where: { type: 'providers' } },
			students:   { where: { type: 'states', abbr: { $like: '1%' } } },
			judges:     { where: { type: 'states', abbr: { $like: '2%' } } },
			admins:     { where: { type: 'states', abbr: { $like: '3%' } } }
		}
	});
};
