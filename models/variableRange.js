const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('variable_range', {
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
    min: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    max: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    step: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
  }, {
    sequelize,
    tableName: 'variable_ranges',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: []
  })
}
