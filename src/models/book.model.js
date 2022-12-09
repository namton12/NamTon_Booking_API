const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../connect/sequelize");
const Cluster = require("./cluster.model");
const Film = require("./film.model");

class Book extends Model {
  id;
  userId;
  playTimeId;
  seatIndex;
  txId;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dateStart: {
      type: DataTypes.DATE,
    },
    playTimeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "playtimes",
        key: "id",
      },
    },
    txId: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    seatIndex: {
      type: DataTypes.INTEGER,
    },
    img: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = Book;
