// File: app/api/posts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { decode, encode } from "next-auth/jwt";
import {
  generateAccessToken,
  generateRefreshToken,
  validateToken,
} from "@/utils/tokenUtils";

async function decodeToken(token: string) {
  try {
    const secret = process.env.NEXTAUTH_SECRET!; // Убедитесь, что у вас установлена эта переменная окружения
    const decoded = await decode({
      token,
      secret,
    });
    console.log(decoded);
    return decoded;
  } catch (error) {
    console.error("Ошибка при декодировании токена:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("_page") || "1", 10);
  const cookies = request.cookies;
  const authToken = cookies.get("next-auth.token");

  if (authToken?.value) {
    const decoded = await decodeToken(authToken.value);
    if (decoded) {
      const result = await validateToken(decoded.accessToken);

      if (result === "expired") {
        const refreshResult = await validateToken(decoded.refreshToken);

        if (refreshResult === "expired") {
          return NextResponse.json(
            { message: "Access Denied" },
            { status: 403 } // Устанавливаем статус код 403 Forbidden
          );
        }

        // Генерация новых токенов
        const newAccessToken = generateAccessToken(decoded.userId);
        const newRefreshToken = generateRefreshToken(decoded.userId);

        // Получение данных
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/?_page=${page}`
        );
        const posts = await response.json();
        const nextResponse = NextResponse.json(posts);

        // Обновление токенов
        const updatedToken = {
          ...decoded,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        };

        const encodedToken = await encode({
          token: updatedToken,
          secret: process.env.NEXTAUTH_SECRET,
        });

        nextResponse.cookies.set({
          name: "next-auth.token",
          value: encodedToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 30 * 24 * 60 * 60, // 30 дней в секундах
        });

        return nextResponse;
      }

      // Если токен не истек, просто возвращаем данные
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/?_page=${page}`
      );
      const posts = await response.json();
      return NextResponse.json(posts);
    }
  }

  // Если нет токена или он не валиден
  return NextResponse.json(
    { message: "Access Denied" },
    { status: 403 } // Устанавливаем статус код 403 Forbidden
  );
}
