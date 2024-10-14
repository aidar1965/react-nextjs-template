import { sign, verify } from "jsonwebtoken";
import { useSession } from "next-auth/react";
// Импорт функции getToken

export type TokenValidationResult = "valid" | "expired" | "error";

const ACCESS_TOKEN_EXPIRY = 15; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

export function generateAccessToken(userId: string): string {
  return sign({ userId, type: "access" }, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(userId: string): string {
  return sign({ userId, type: "refresh" }, process.env.JWT_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

// New function to validate the token
export async function validateToken(
  token: string
): Promise<TokenValidationResult> {
  try {
    verify(token, process.env.JWT_SECRET!); // Проверка токена
    return "valid"; // Токен действителен
  } catch (error) {
    if ((error as Error).name === "TokenExpiredError") {
      console.log("Токен истек."); // Логирование истекшего токена
      return "expired"; // Токен истек
    }
    console.log("Ошибка проверки токена: " + error); // Логирование других ошибок
    return "error"; // Ошибка проверки токена
  }
}

export function useTokensFromSession() {
  const { data: session } = useSession(); // Получение сессии
  const userId = session?.id;
  const accessToken = session?.accessToken; // Получение access token из сессии
  const refreshToken = session?.refreshToken; // Получение refresh token из сессии
  return { accessToken, refreshToken, userId };
}
