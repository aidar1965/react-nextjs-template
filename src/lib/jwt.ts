import jwt from "jsonwebtoken";

export const signJwt = (payload: object, secret: string, options = {}) => {
  return jwt.sign(payload, secret, {
    expiresIn: "30d", // Время жизни токена
    ...options,
  });
};
