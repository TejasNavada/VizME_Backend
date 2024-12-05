const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('variable_equation', {
    var_name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    problemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    equation: {
        type: DataTypes.TEXT,
        allowNull: true
    },
  }, {
    sequelize,
    tableName: 'variable_equations',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: []
  })
}
