const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('submission_error', {
    errorId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    errName: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    stack: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'submission_errors',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "submission_error_pkey",
        unique: true,
        fields: [
          { name: "errorId" },
        ]
      },
    ]
  })
}
