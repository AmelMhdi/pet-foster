import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function hash(password) {
  return await argon2.hash(password);
}

export async function compare(plainTextPassword, hashedPassword) {
  return await argon2.verify(hashedPassword, plainTextPassword);
}

export function generateJwtToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}