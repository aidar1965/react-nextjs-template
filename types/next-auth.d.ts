import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    id?: string; // Добавьте здесь ваши пользовательские поля
    email?: string;
    name?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    id: string; // Если у вас есть поле id в объекте User
    name: string;
    email: string; // Другие поля
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    userId: string;
    expires: string;
  }
}
