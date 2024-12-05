const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('message', {
    messageId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    problemId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.fn('now')
    },
  }, {
    sequelize,
    tableName: 'messages',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "message_pkey",
        unique: true,
        fields: [
          { name: "messageId" },
        ]
      },
    ]
  })
}
