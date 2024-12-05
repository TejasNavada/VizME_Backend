const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user_equation', {
    equationId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    equation: {
        type: DataTypes.TEXT,
        allowNull: true
    },
  }, {
    sequelize,
    tableName: 'user_equations',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "user_equation_pkey",
        unique: true,
        fields: [
          { name: "equationId" },
        ]
      },
    ]
  })
}
