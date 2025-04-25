import argon2 from "argon2";
import jwt from "jsonwebtoken";

export async function hash(password) {
  return await argon2.hash(password);
}

export async function compare(plainTextPassword, hashedPassword) {
  return await argon2.verify(hashedPassword, plainTextPassword);
}


export function generateJwtToken(payload) {

  return jwt.sign(payload, "your_secret_key", { expiresIn: "1d" });
}

// necessaire ???
// export function verifyJwtToken(token) {
 
//    try {
//     return jwt.verify(token, "your_secret_key");
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }