const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('variable_constant', {
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
    constant: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
  }, {
    sequelize,
    tableName: 'variable_constants',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: []
  })
}
