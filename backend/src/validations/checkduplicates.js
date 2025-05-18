import { User } from "../models/index.js";
import { Op } from "sequelize";

export async function checkDuplicates(email, phone_number, userId = null) {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { phone_number }],
    },
  });

  if (existingUser && existingUser.id !== userId) {
    const conflicts = [];

    if (existingUser.email === email) {
      conflicts.push("Cet email est déjà utilisé.");
    }

    if (existingUser.phone_number === phone_number) {
      conflicts.push("Ce numéro de téléphone est déjà utilisé.");
    }

    if (conflicts.length) {
      const error = new Error(conflicts.join(" "));
      error.statusCode = 409;
      throw error;
    }
  }
}