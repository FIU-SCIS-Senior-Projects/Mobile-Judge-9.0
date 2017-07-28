module.exports = function(sequelize, DataTypes) {
	return sequelize.define('question', {
		id: {
			type: DataTypes.INTEGER(3),
			primaryKey: true,
			autoIncrement: true
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		value: {
			type: DataTypes.INTEGER(3),
			allowNull: false
		},
		display: {
			type: DataTypes.INTEGER(3),
			allowNull: true,
			get: function()  {
				var display = this.getDataValue('display');
				return (display != null) ? ((display >= 0) ? display : display * -1) : null;
			},
			set: function(val) {
				var display = this.getDataValue('display') || 0;
				if ((display < 0 && val < 0) || (display > 0 && val > 0) || (display == 0 || val == 0)) {
					this.setDataValue('display', val);
				}
				else this.setDataValue('display', val * -1);
			}
		}
	}, {
		getterMethods: {
			enabled: function() {
				var display = this.getDataValue('display') || 0;
				return display > 0;
			}
		},
		setterMethods: {
			enabled: function(val) {
				var display = this.getDataValue('display');
				if (display < 0 && val || display > 0 && !val) display *= -1;
				else if (display == null) display = val ? 1 : -1;
				this.setDataValue('display', display);
			}
		}
	});
};
