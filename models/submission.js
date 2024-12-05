const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('submission', {
    submissionId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    problemId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pass: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.fn('now')
    },
  }, {
    sequelize,
    tableName: 'submissions',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "submission_pkey",
        unique: true,
        fields: [
          { name: "submissionId" },
        ]
      },
    ]
  })
}
