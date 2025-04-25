import argon2 from "argon2";

export async function hash(password) {
  return await argon2.hash(password);
}

export async function compare(plainTextPassword, hashedPassword) {
  return await argon2.verify(hashedPassword, plainTextPassword);
}
