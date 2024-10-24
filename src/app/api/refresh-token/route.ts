// src/app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {
  validateToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils";

export async function POST(request: NextRequest) {
  try {
    // Получаем refresh token из тела запроса
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Проверяем валидность refresh token
    const result = await validateToken(refreshToken);

    if (result === "expired") {
      return NextResponse.json(
        { message: "Refresh token expired" },
        { status: 401 }
      );
    }

    // Декодируем refresh token чтобы получить userId
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as {
        userId: string;
        type: string;
      };

      // Проверяем, что это действительно refresh token
      if (decoded.type !== "refresh") {
        return NextResponse.json(
          { message: "Invalid token type" },
          { status: 400 }
        );
      }

      // Генерируем новую пару токенов
      const newAccessToken = generateAccessToken(decoded.userId);
      const newRefreshToken = generateRefreshToken(decoded.userId);

      // Возвращаем новые токены
      return NextResponse.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
