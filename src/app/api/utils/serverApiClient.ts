import axios, { AxiosInstance, AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { decode, encode } from "next-auth/jwt";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken,
  validateToken,
} from "../utils/tokenUtils";

class ServerApiClient {
  private axiosInstance: AxiosInstance;
  private request: NextRequest;

  constructor(request: NextRequest, baseURL: string) {
    this.request = request;
    this.axiosInstance = axios.create({ baseURL });
  }

  private async decodeToken(token: string) {
    try {
      const secret = process.env.NEXTAUTH_SECRET!;
      const decoded = await decode({
        token,
        secret,
      });
      return decoded;
    } catch (error) {
      console.error("Ошибка при декодировании токена:", error);
      return null;
    }
  }

  private getAuthToken(): {
    token: string | undefined;
    type: "bearer" | "cookie";
  } {
    // Проверяем сначала Authorization заголовок
    const authHeader = this.request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      return {
        token: authHeader.substring(7),
        type: "bearer",
      };
    }

    // Если нет в заголовке, проверяем куки
    const cookieToken = this.request.cookies.get("next-auth.token");
    return {
      token: cookieToken?.value,
      type: "cookie",
    };
  }

  private async makeRequest<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: unknown
  ): Promise<NextResponse> {
    const { token, type } = this.getAuthToken();

    if (!token) {
      return NextResponse.json({ message: "Access Denied" }, { status: 403 });
    }

    if (type === "bearer") {
      try {
        // Проверяем валидность токена
        const result = await validateToken(token);
        if (result === "expired") {
          return NextResponse.json(
            { message: "Token expired" },
            { status: 401 }
          );
        }

        const userId = (
          jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
        ).userId;

        const newAccessToken = generateAccessToken(userId);
        // Выполняем запрос
        const response = await this.executeRequest<T>(method, url, data);

        const nextResponse = NextResponse.json(response.data);

        nextResponse.headers.set("Authorization", `Bearer ${newAccessToken}`);

        return nextResponse;
      } catch (error) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }
    } else {
      // Существующая логика для токена из куки
      const decoded = await this.decodeToken(token);
      if (!decoded) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }

      const result = await validateToken(decoded.accessToken);

      if (result === "expired") {
        const refreshResult = await validateToken(decoded.refreshToken);

        if (refreshResult === "expired") {
          return NextResponse.json(
            { message: "Access Denied" },
            { status: 403 }
          );
        }

        // Генерация новых токенов
        const newAccessToken = generateAccessToken(decoded.userId);
        const newRefreshToken = generateRefreshToken(decoded.userId);

        // Выполнение запроса
        const response = await this.executeRequest<T>(method, url, data);
        const nextResponse = NextResponse.json(response.data);

        // Обновление токенов в куки
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
          maxAge: 30 * 24 * 60 * 60,
        });

        return nextResponse;
      }

      // Если токен не истек, просто выполняем запрос
      const response = await this.executeRequest<T>(method, url, data);
      return NextResponse.json(response.data);
    }
  }

  private async executeRequest<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: unknown
  ): Promise<AxiosResponse<T>> {
    switch (method) {
      case "get":
        return this.axiosInstance.get<T>(url);
      case "post":
        return this.axiosInstance.post<T>(url, data);
      case "put":
        return this.axiosInstance.put<T>(url, data);
      case "patch":
        return this.axiosInstance.patch<T>(url, data);
      case "delete":
        return this.axiosInstance.delete<T>(url);
    }
  }

  public async get<T>(url: string): Promise<NextResponse> {
    return this.makeRequest<T>("get", url);
  }

  public async post<T>(url: string, data: unknown): Promise<NextResponse> {
    return this.makeRequest<T>("post", url, data);
  }

  public async put<T>(url: string, data: unknown): Promise<NextResponse> {
    return this.makeRequest<T>("put", url, data);
  }

  public async patch<T>(url: string, data: unknown): Promise<NextResponse> {
    return this.makeRequest<T>("patch", url, data);
  }

  public async delete<T>(url: string): Promise<NextResponse> {
    return this.makeRequest<T>("delete", url);
  }
}

export default ServerApiClient;
