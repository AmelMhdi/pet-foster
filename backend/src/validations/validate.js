import { userRegisterSchema } from "./userShemas.js";
import { passwordComplexity } from "./password.js";

export function validateUserInput(user) {
  const { error } = userRegisterSchema.validate(user, { abortEarly: false });

  if (error) {
    const messages = error.details.map((e) => e.message);
    return { valid: false, errors: messages }
  }

  return { valid: true };
}

export function validatePasswordComplexity(password) {
  const { error } = passwordComplexity.validate(password);
  if (error) {
    return { valid: false, error: error.message};
  }
  return { valid: true };
}