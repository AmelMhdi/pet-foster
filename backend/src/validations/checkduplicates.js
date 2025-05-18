import { User } from "../models/index.js";
import { Op } from "sequelize";

export async function checkDuplicates(email, phone_number, userId = null) {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { phone_number }],
    },
  });

  if (existingUser && existingUser.id !== userId) {
    if (existingUser.email === email) {
      const error = new Error("Cet email existe déjà.");
      error.statusCode = 409;
      throw error;
    }

    if (existingUser.phone_number === phone_number) {
      const error = new Error("Ce numéro de téléphone existe déjà.");
      error.statusCode = 409;
      throw error;
    }
  }
}