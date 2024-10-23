// File: src/utils/serverApiClient.ts

import axios, { AxiosInstance, AxiosResponse } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { decode, encode } from "next-auth/jwt";
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
      console.log(decoded);
      return decoded;
    } catch (error) {
      console.error("Ошибка при декодировании токена:", error);
      return null;
    }
  }

  private async makeRequest<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: unknown
  ): Promise<NextResponse> {
    const authToken = this.request.cookies.get("next-auth.token");

    if (authToken?.value) {
      const decoded = await this.decodeToken(authToken.value);
      if (decoded) {
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
          let response: AxiosResponse<T>;
          switch (method) {
            case "get":
              response = await this.axiosInstance.get<T>(url);
              break;
            case "post":
              response = await this.axiosInstance.post<T>(url, data);
              break;
            case "put":
              response = await this.axiosInstance.put<T>(url, data);
              break;
            case "patch":
              response = await this.axiosInstance.patch<T>(url, data);
              break;
            case "delete":
              response = await this.axiosInstance.delete<T>(url);
              break;
          }

          const nextResponse = NextResponse.json(response.data);

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

        // Если токен не истек, просто выполняем запрос
        let response: AxiosResponse<T>;
        switch (method) {
          case "get":
            response = await this.axiosInstance.get<T>(url);
            break;
          case "post":
            response = await this.axiosInstance.post<T>(url, data);
            break;
          case "put":
            response = await this.axiosInstance.put<T>(url, data);
            break;
          case "patch":
            response = await this.axiosInstance.patch<T>(url, data);
            break;
          case "delete":
            response = await this.axiosInstance.delete<T>(url);
            break;
        }
        return NextResponse.json(response.data);
      }
    }

    // Если нет токена или он не валиден
    return NextResponse.json({ message: "Access Denied" }, { status: 403 });
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
