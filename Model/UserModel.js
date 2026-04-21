import { DataTypes } from "sequelize";
import sequelize from "./db.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("senha")) {
          const hash = await bcrypt.hash(user.senha, 10);
          user.senha = hash;
        }
      },
    },
  },
);

export default User;
