// app/api/auth/refresh-token/route.js

import { NextResponse } from "next/server";
import {
  validateToken,
  generateAccessToken,
} from "../../../app/api/utils/tokenUtils"; // Подключаем свои функции

export async function POST(request) {
  try {
    // Получаем refresh токен из cookies
    const refreshToken = request.cookies.get("refreshToken");

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Токен не предоставлен" },
        { status: 401 }
      );
    }

    // Проверка refresh токена
    const isValid = (await validateToken(refreshToken)) == "valid";
    if (!isValid) {
      return NextResponse.json({ error: "Неверный токен" }, { status: 401 });
    }

    // Генерация нового access токена
    const accessToken = generateAccessToken({ userId: request.cookies.userId });

    // Возвращаем новый access токен
    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Ошибка при обновлении токена:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
