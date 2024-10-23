import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { generateAccessToken, generateRefreshToken } from "./tokenUtils"; // Убедитесь, что путь правильный
import { User } from "@/app/models/User";
import { AdapterUser } from "next-auth/adapters";

export const jwtCallback = async ({
  token,
  user,
}: {
  token: JWT;
  user: User | AdapterUser;
}) => {
  // Если пользователь существует, добавляем токены
  if (user) {
    if (typeof user.id === "string") {
      token.accessToken = generateAccessToken(user.id);
      token.refreshToken = generateRefreshToken(user.id);
      token.userId = user.id;
      token.expires = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString();
    } else {
      token.accessToken = generateAccessToken(user.id.toString());
      token.refreshToken = generateRefreshToken(user.id.toString());
      token.userId = user.id.toString();
      token.expires = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString();
    }
  }
  return token;
};

export const sessionCallback = async ({
  session,
  token,
}: {
  session: Session;
  token: JWT;
}): Promise<Session> => {
  // Добавляем данные токена в сессию
  if (token) {
    session.accessToken = token.accessToken;
    session.refreshToken = token.refreshToken;
    session.id = token.userId;
    session.expires = token.expires;
  }
  return session;
};
