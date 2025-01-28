const usersKey1Model = (sequelize, DataTypes) => {
  return sequelize.define(
    "usersKey1",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uid: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      evmAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userKey: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "usersKey1",
      timestamps: true,
    }
  );
};

module.exports = usersKey1Model;
